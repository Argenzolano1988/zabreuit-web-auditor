# Zabreuit Technical SEO & Web Auditor Action

Automated technical audit for any URL in your CI/CD pipeline: SEO metadata, OpenGraph tags, SSL/TLS, and HTTP security headers.

Runs on your own GitHub runner — no external service, no server costs, no API keys.

## Usage

```yaml
- name: Technical audit
  uses: Argenzolano1988/zabreuit-web-auditor@v1.0.0
  with:
    url: https://example.com
    audit_preset: full-technical
    fail_on_critical: true
    min_score: 80
```

## Inputs

| Input | Description | Required | Default |
|---|---|---|---|
| `url` | Target URL to audit | yes | — |
| `audit_preset` | `seo-opengraph`, `seo-audit`, `security-audit`, `full-technical` | no | `seo-opengraph` |
| `license_key` | Optional Pro license (Ed25519 signed token) | no | `''` |
| `fail_on_critical` | Exit 1 when critical issues are found | no | `false` |
| `min_score` | Minimum health score (0-100) before failing | no | `0` |

## What it checks

- Title, meta description, canonical URL
- OpenGraph and Twitter card tags
- HSTS, CSP, X-Frame-Options, X-Content-Type-Options, Referrer-Policy
- TLS certificate validity and expiry
- Structured data (JSON-LD) presence

## Output

A Markdown report in the workflow summary, plus JSON outputs for downstream steps.

## License

MIT

## Ready-made packs

If you prefer working tools instead of building your own, there are curated CLI packs
(10 tools each, Node.js, no dependencies):

- **B2B Leads Arsenal** — https://gumroad.com/l/zabreuit-pack-03
- **E-commerce Intelligence** — https://gumroad.com/l/zabreuit-pack-01
- **SEO & Web Health Auditors** — https://gumroad.com/l/zabreuit-pack-09
