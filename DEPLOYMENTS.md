# Production deployment record

Each entry identifies the application source commit, validation, and immutable
Vercel deployment URL. The subsequent documentation commit records the result;
it does not change the deployed application. Failed/incomplete steps must be
reported separately and must not be recorded as successful.

## 2026-09-26 — Full-page form recovery

- Source commit: `e58eb0348aa4d618cfba6d2b13783d568a18930e`.
- Production deployment: https://usa-mirokuwebsite-c9nke6e45-website-1824s-projects.vercel.app
- Vercel deployment ID: `dpl_5X7PMK682fhd6FbvxMv2yBbT1snr`.
- Confirmed Ready, production target, aliased to https://www.worldmessianic.org.
- Validation: build passed; lint passed with one existing unrelated warning;
  nine standard Letter PDFs and their overflow cases passed. Rendered PDF
  layouts checked. Browser check confirmed 24 rows, PDF preparation, continued
  form retaining center/name/date, and sequential PDF filenames.
- Application source pushed to GitHub main and mirrored on T7 before deploy.
- CLI emitted extra output after deployment; the release recorder stopped
  safely. Deployment was inspected and recorded manually. URL extraction was
  updated to handle additional CLI output and shell syntax checked.
- This record and script adjustment do not change deployed application code.

## 2026-09-26 23:48 UTC

- Source commit: `44e21841f7d99daf34506cac0d5524403e9cb222`
- Production deployment: https://usa-mirokuwebsite-ot2sisjhk-website-1824s-projects.vercel.app
- Validation: lint, build and form PDF regression checks passed; Vercel deployment inspected.
