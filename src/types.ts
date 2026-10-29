export type AuditPresetType =
  | 'seo-opengraph'
  | 'seo-audit'
  | 'security-audit'
  | 'full-technical';

export interface ActionInputs {
  url: string;
  auditPreset: AuditPresetType;
  licenseKey?: string;
  failOnCritical: boolean;
  minScore: number;
}

export interface ActionFinding {
  severity: 'ERROR' | 'WARN' | 'INFO';
  code: string;
  message: string;
  recommendation?: string;
}

export interface ActionAuditResult {
  url: string;
  score: number;
  preset: string;
  durationMs: number;
  isProUnlocked: boolean;
  findings: ActionFinding[];
  details: {
    sslValid?: boolean;
    sslDaysRemaining?: number;
    openGraphValid?: boolean;
    securityTxtFound?: boolean;
    robotsTxtFound?: boolean;
    securityHeadersPresent?: string[];
  };
}

export interface ActionOutputs {
  auditScore: number;
  findingsJson: string;
  markdownSummary: string;
}
