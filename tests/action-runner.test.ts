import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {
  getInput,
  setOutput,
  addStepSummary,
  _resetRunnerContextForTests,
  _getRecordedOutputsForTests,
  _getRecordedSummaryForTests,
} from '../src/runner-context.js';
import { runAuditService } from '../src/auditor-service.js';
import { formatStepSummary } from '../src/summary-formatter.js';
import { run } from '../src/index.js';
import {
  generateEd25519KeyPair,
  signLicensePayload,
} from '@zabreuit/core/browser';

describe('GitHub Action Internal Test Suite (@zabreuit/github-action)', () => {
  let tmpOutputDir: string;
  let tmpOutputFile: string;
  let tmpSummaryFile: string;

  beforeEach(() => {
    _resetRunnerContextForTests();
    tmpOutputDir = fs.mkdtempSync(path.join(os.tmpdir(), 'gh-action-unit-'));
    tmpOutputFile = path.join(tmpOutputDir, 'output.txt');
    tmpSummaryFile = path.join(tmpOutputDir, 'summary.md');
    process.env.GITHUB_OUTPUT = tmpOutputFile;
    process.env.GITHUB_STEP_SUMMARY = tmpSummaryFile;
    delete process.env.INPUT_URL;
    delete process.env.INPUT_AUDIT_PRESET;
    delete process.env.INPUT_LICENSE_KEY;
    delete process.env.INPUT_FAIL_ON_CRITICAL;
    delete process.env.INPUT_MIN_SCORE;
  });

  afterEach(() => {
    delete process.env.GITHUB_OUTPUT;
    delete process.env.GITHUB_STEP_SUMMARY;
    try {
      fs.rmSync(tmpOutputDir, { recursive: true, force: true });
    } catch {
      // ignore
    }
  });

  it('parses input variables and executes preset seo-opengraph with mock HTML', async () => {
    const mockHtml = `
      <html>
        <head>
          <title>Test Page</title>
          <meta property="og:title" content="Test Page Title" />
          <meta property="og:description" content="Test Description" />
          <meta property="og:image" content="https://example.com/img.png" />
          <meta property="og:type" content="website" />
        </head>
        <body>Hello</body>
      </html>
    `;

    const res = await runAuditService(
      {
        url: 'https://example.com',
        auditPreset: 'seo-opengraph',
        failOnCritical: false,
        minScore: 70,
      },
      { mockHtml }
    );

    expect(res.score).toBe(100);
    expect(res.details.openGraphValid).toBe(true);
    expect(res.findings).toHaveLength(0);

    const summary = formatStepSummary(res);
    expect(summary).toContain('seo-opengraph');
    expect(summary).toContain('100 / 100');
  });

  it('writes outputs and handles step summary correctly', () => {
    setOutput('score', '90');
    addStepSummary('# Step Summary');

    const outContent = fs.readFileSync(tmpOutputFile, 'utf-8');
    expect(outContent).toContain('score=90');

    const sumContent = fs.readFileSync(tmpSummaryFile, 'utf-8');
    expect(sumContent).toContain('# Step Summary');
  });

  it('runs main entrypoint without crashing', async () => {
    process.env.INPUT_URL = 'https://example.com';
    process.env.INPUT_AUDIT_PRESET = 'seo-opengraph';
    await run();

    const outputs = _getRecordedOutputsForTests();
    expect(outputs.audit_score).toBeDefined();
    expect(outputs.findings_json).toBeDefined();
    expect(outputs.markdown_summary).toBeDefined();
  });
});
