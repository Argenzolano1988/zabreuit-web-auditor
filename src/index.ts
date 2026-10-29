import {
  getInput,
  setOutput,
  addStepSummary,
  logInfo,
  logWarning,
  setFailed,
} from './runner-context.js';
import { runAuditService } from './auditor-service.js';
import { formatStepSummary } from './summary-formatter.js';
import type { ActionInputs, AuditPresetType } from './types.js';

export async function run(): Promise<void> {
  try {
    const url = getInput('url', { required: true });
    const auditPreset = (getInput('audit_preset') || 'seo-opengraph') as AuditPresetType;
    const licenseKey = getInput('license_key') || undefined;
    const failOnCritical = getInput('fail_on_critical').toLowerCase() === 'true';
    const minScoreStr = getInput('min_score') || '70';
    const minScore = parseInt(minScoreStr, 10) || 70;

    const inputs: ActionInputs = {
      url,
      auditPreset,
      licenseKey,
      failOnCritical,
      minScore,
    };

    logInfo(`Starting Zabreuit Technical Audit on ${url} (preset: ${auditPreset})...`);

    const result = await runAuditService(inputs);
    const summary = formatStepSummary(result);

    setOutput('audit_score', String(result.score));
    setOutput('findings_json', JSON.stringify(result.findings));
    setOutput('markdown_summary', summary);

    addStepSummary(summary);

    logInfo(`Audit completed with score ${result.score}/100 in ${result.durationMs}ms.`);

    const hasCritical = result.findings.some((f) => f.severity === 'ERROR');
    const isBelowMinScore = result.score < minScore;

    if (failOnCritical && (hasCritical || isBelowMinScore)) {
      const reasons: string[] = [];
      if (hasCritical) reasons.push('Critical ERROR findings detected');
      if (isBelowMinScore) reasons.push(`Score ${result.score} is below threshold ${minScore}`);
      setFailed(`Audit failed: ${reasons.join(', ')}.`);
    } else if (isBelowMinScore) {
      logWarning(`Audit score ${result.score} is below configured min_score ${minScore}.`);
    }
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    setFailed(`Fatal execution error: ${errorMsg}`);
  }
}

// Automatically invoke if executed directly
if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'test') {
  void run();
}
