import { TechnicalAuditorEngine } from '@zabreuit/core';
import { verifyLicenseToken, DEFAULT_ED25519_PUBLIC_KEY_PEM } from '@zabreuit/core/browser';
import type { ActionInputs, ActionAuditResult, ActionFinding } from './types.js';

export interface AuditServiceOptions {
  mockHtml?: string;
  timeoutMs?: number;
  publicKeyPem?: string;
}

export async function runAuditService(
  inputs: ActionInputs,
  options?: AuditServiceOptions
): Promise<ActionAuditResult> {
  const startTime = Date.now();
  let isProUnlocked = false;

  if (inputs.licenseKey && inputs.licenseKey.trim().length > 0) {
    try {
      const pubKey =
        options?.publicKeyPem ||
        process.env.ZABREUIT_LICENSE_PUBLIC_KEY ||
        DEFAULT_ED25519_PUBLIC_KEY_PEM;

      const verification = await verifyLicenseToken(inputs.licenseKey, pubKey);
      if (
        verification.valid &&
        verification.payload &&
        (verification.payload.tier === 'PRO' || verification.payload.tier === 'ENTERPRISE')
      ) {
        isProUnlocked = true;
      }
    } catch {
      isProUnlocked = false;
    }
  }

  const engine = new TechnicalAuditorEngine();
  const engineOptions = {
    html: options?.mockHtml,
    timeoutMs: options?.timeoutMs ?? 5000,
    checkOpenGraph:
      inputs.auditPreset === 'seo-opengraph' ||
      inputs.auditPreset === 'seo-audit' ||
      inputs.auditPreset === 'full-technical',
    checkSsl:
      inputs.auditPreset === 'seo-audit' ||
      inputs.auditPreset === 'security-audit' ||
      inputs.auditPreset === 'full-technical',
    checkRobotsTxt:
      inputs.auditPreset === 'seo-audit' ||
      inputs.auditPreset === 'full-technical',
    checkSecurityTxt:
      inputs.auditPreset === 'security-audit' ||
      inputs.auditPreset === 'full-technical',
    checkRdap:
      isProUnlocked &&
      (inputs.auditPreset === 'security-audit' || inputs.auditPreset === 'full-technical'),
  };

  const result = await engine.extract(inputs.url, engineOptions);

  if (!result.success || !result.data) {
    const errorFinding: ActionFinding = {
      severity: 'ERROR',
      code: result.error?.code || 'AUDIT_EXECUTION_FAILED',
      message: result.error?.message || 'Technical audit execution failed',
      recommendation: 'Check that target URL is reachable and well-formed.',
    };

    return {
      url: inputs.url,
      score: 0,
      preset: inputs.auditPreset,
      durationMs: Date.now() - startTime,
      isProUnlocked,
      findings: [errorFinding],
      details: {},
    };
  }

  const report = result.data;
  const findings: ActionFinding[] = report.issues.map((iss) => ({
    severity: iss.severity,
    code: iss.code,
    message: iss.message,
    recommendation: getRecommendation(iss.code),
  }));

  const securityHeadersPresent: string[] = [];
  if (report.ssl?.valid) securityHeadersPresent.push('TLS/HTTPS');
  if (report.securityTxt?.found) securityHeadersPresent.push('security.txt');

  return {
    url: inputs.url,
    score: report.complianceScore,
    preset: inputs.auditPreset,
    durationMs: Date.now() - startTime,
    isProUnlocked,
    findings,
    details: {
      sslValid: report.ssl?.valid,
      sslDaysRemaining: report.ssl?.daysRemaining,
      openGraphValid: report.openGraph?.valid,
      securityTxtFound: report.securityTxt?.found,
      robotsTxtFound: report.robotsTxt?.found,
      securityHeadersPresent,
    },
  };
}

function getRecommendation(code: string): string {
  switch (code) {
    case 'OG_INCOMPLETE':
      return 'Add required og:title, og:description, and og:image tags in <head>.';
    case 'SSL_INVALID':
      return 'Verify domain TLS certificate validity and CA chain.';
    case 'SSL_EXPIRING_SOON':
      return 'Renew SSL certificate before expiration to prevent browser warnings.';
    case 'SECURITY_TXT_NOT_FOUND':
      return 'Publish a standard security.txt file under /.well-known/security.txt.';
    case 'ROBOTS_DISALLOW_ALL':
      return 'Ensure robots.txt does not inadvertently block search engine crawlers with Disallow: /';
    case 'HTTP_ERROR_STATUS':
      return 'Fix web server configuration to return HTTP 200 OK.';
    default:
      return 'Review detected issue according to web standards.';
  }
}
