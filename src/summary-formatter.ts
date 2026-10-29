import type { ActionAuditResult } from './types.js';

export function formatStepSummary(result: ActionAuditResult): string {
  const statusEmoji = result.score >= 80 ? '🟢' : result.score >= 60 ? '🟡' : '🔴';
  const proBadge = result.isProUnlocked ? '🛡️ **Pro Unlocked**' : '🌱 **Community Tier**';

  const rows: string[] = [
    `# ${statusEmoji} Zabreuit Technical Audit Summary`,
    '',
    '| Metric | Value |',
    '| :--- | :--- |',
    `| **Target URL** | \`${result.url}\` |`,
    `| **Preset** | \`${result.preset}\` |`,
    `| **Score** | **${result.score} / 100** |`,
    `| **License Tier** | ${proBadge} |`,
    `| **Duration** | \`${result.durationMs}ms\` |`,
    '',
    `### 📋 Audit Findings (${result.findings.length})`,
    '',
  ];

  if (result.findings.length === 0) {
    rows.push('✨ *No issues detected! All technical checks passed.*');
  } else {
    rows.push('| Severity | Code | Description | Recommendation |');
    rows.push('| :--- | :--- | :--- | :--- |');
    for (const f of result.findings) {
      const sevBadge =
        f.severity === 'ERROR' ? '🔴 ERROR' : f.severity === 'WARN' ? '🟡 WARN' : 'ℹ️ INFO';
      rows.push(`| ${sevBadge} | \`${f.code}\` | ${f.message} | ${f.recommendation || '-'} |`);
    }
  }

  rows.push('');
  rows.push('### 🔍 Technical Checks Breakdown');
  if (result.details.sslValid !== undefined) {
    rows.push(
      `- **SSL/TLS**: ${result.details.sslValid ? '✅ Valid' : '❌ Invalid'} (${result.details.sslDaysRemaining ?? 0} days remaining)`
    );
  }
  if (result.details.openGraphValid !== undefined) {
    rows.push(
      `- **OpenGraph**: ${result.details.openGraphValid ? '✅ Complete' : '⚠️ Missing Tags'}`
    );
  }
  if (result.details.securityTxtFound !== undefined) {
    rows.push(
      `- **security.txt**: ${result.details.securityTxtFound ? '✅ Present' : 'ℹ️ Not Found'}`
    );
  }
  if (result.details.robotsTxtFound !== undefined) {
    rows.push(
      `- **robots.txt**: ${result.details.robotsTxtFound ? '✅ Present' : 'ℹ️ Not Found'}`
    );
  }

  rows.push('');
  rows.push('---');
  rows.push('*Generated with zero infrastructure cost by [Zabreuit Technical Auditor](https://github.com/Argenzolano1988).*');

  return rows.join('\n');
}
