import fs from 'node:fs';

const memoryOutputs: Record<string, string> = {};
let memorySummary = '';

/**
 * Reads an input parameter from GitHub Actions runner environment variables.
 * Variable convention: INPUT_<UPPERCASE_NAME_WITH_UNDERSCORES>
 */
export function getInput(name: string, options?: { required?: boolean }): string {
  const envKey = 'INPUT_' + name.toUpperCase().replace(/ /g, '_');
  const val = process.env[envKey] || '';
  const trimmed = val.trim();

  if (options?.required && !trimmed) {
    const errorMsg = `Input required and not supplied: ${name}`;
    setFailed(errorMsg);
    throw new Error(errorMsg);
  }

  return trimmed;
}

/**
 * Writes an output parameter to the GitHub Actions runner.
 * Follows multiline delimiter specification if value contains newlines.
 */
export function setOutput(name: string, value: string): void {
  memoryOutputs[name] = value;
  const outputPath = process.env.GITHUB_OUTPUT;

  if (outputPath) {
    if (value.includes('\n')) {
      const delimiter = `ghadelimiter_${Math.random().toString(36).substring(2, 10)}`;
      const formatted = `${name}<<${delimiter}\n${value}\n${delimiter}\n`;
      fs.appendFileSync(outputPath, formatted, 'utf-8');
    } else {
      fs.appendFileSync(outputPath, `${name}=${value}\n`, 'utf-8');
    }
  }
}

/**
 * Writes markdown content to GITHUB_STEP_SUMMARY.
 */
export function addStepSummary(markdownContent: string): void {
  memorySummary += markdownContent + '\n';
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;

  if (summaryPath) {
    fs.appendFileSync(summaryPath, markdownContent + '\n', 'utf-8');
  }
}

export function logInfo(message: string): void {
  console.log(message);
}

export function logWarning(message: string): void {
  console.log(`::warning::${message}`);
}

export function logError(message: string): void {
  console.log(`::error::${message}`);
}

export function setFailed(message: string): void {
  logError(message);
  process.exitCode = 1;
}

export function _resetRunnerContextForTests(): void {
  for (const k of Object.keys(memoryOutputs)) {
    delete memoryOutputs[k];
  }
  memorySummary = '';
}

export function _getRecordedOutputsForTests(): Record<string, string> {
  return { ...memoryOutputs };
}

export function _getRecordedSummaryForTests(): string {
  return memorySummary;
}
