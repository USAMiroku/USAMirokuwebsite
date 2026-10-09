# Website change log

## 2026-09-26 — Restore full-page forms and establish release tracking

Problem: September 25 form improvements were committed to
`codex/site-updates-portable-setup`, but not merged into `main`. September 26
navigation releases on main therefore lacked those improvements. The changes
were still recoverable; there is no evidence that their commits were deleted.

- Recover 24 ancestor rows and 17/15 writing lines from commits `5169c05` and
  `b5f8584`, including Letter-page PDF spacing and continuation instructions.
- Restore sharp text-based PDFs and the separate PDF preparation/sharing flow
  from `4c495e3`, including Copy center email and download fallback.
- Add Save PDF and prepare another form in EN/PT/ES. Downloads the prepared
  sheet, clears writing fields, retains center/name/date, and numbers PDFs.
- Preserve main's September 26 navigation changes (`db1a4f7`, `5181e8c`).
- Add AGENTS.md, portable workflow, deployment records, release/mirror scripts
  and form PDF regression checks. Unrelated changes on the recovery branch
  remain there; they were not silently merged as part of this form repair.
- Validation: build passed; lint passed with one pre-existing unrelated warning;
  all nine standard PDFs and overflow cases passed; rendered Portuguese Ancestors
  and Spanish Paradise PDFs checked; browser continuation flow retained sender
  details and cleared writing entries. Deployment is recorded in DEPLOYMENTS.md.

## Recovered history (not a complete historical deployment audit)

- 2026-09-25 `5169c05`: expand Annual Ancestors to 24 rows/full Letter page.
- 2026-09-25 `b5f8584`: increase prayer writing areas to 17 and 15 lines.
- 2026-09-25 `4c495e3`: save improved special-service sharing and PDF generation.
- 2026-09-26 `db1a4f7`: desktop navigation on laptop screens (main).
- 2026-09-26 `5181e8c`: Special Services in navigation (main).

Git history remains the detailed record of older changes. Deployment status
for old commits above has not been independently reconstructed.

### Release workflow follow-up

Vercel's installed CLI added extra stdout text. Production succeeded, but the
release recorder correctly stopped at its URL guard. Verified the Ready
production deployment, recorded it, and adjusted URL extraction to accept the
CLI output. Both T7 source locations and GitHub receive the same final record.

## 2026-09-26 — Keep one authoritative T7 website folder

User requested one folder to prevent confusion between different source copies.
Keep `Projects/USAMirokuwebsite`, the Git checkout synchronized with GitHub main.
Remove the duplicate `Projects/usa-mirokuwebsite-live`, including its old recovery
backup, and the obsolete parent `sync-usamiroku-repo.sh`. Remove the mirror
script and update release instructions so no second source folder is created.
Earlier entries mentioning mirrors describe the previous arrangement only.
Git commits, CHANGELOG.md and DEPLOYMENTS.md preserve the history and progress.
No application behavior changes. Shell syntax and release checks validate the
updated workflow; the release record identifies the deployed source commit.

## 2026-10-09 — Keep navigation visible on laptop and intermediate widths

- Replace the public header's 1280px compact-menu cutoff with wrapping navigation
  from 768px, using a separate navigation row below 1536px. Keep the brand,
  donation action and language selection readable without resetting browser zoom.
- Add a visible localized Menu label, expanded state, closed-menu inertness and
  Escape-key dismissal with focus return. Give the phone brand its own row.
- Measure header height so page spacing and the compact menu follow wrapped
  content; exclude this screen spacing from printed forms.
- Validation: Chromium and WebKit passed 84 combinations of 320–1920 CSS-pixel
  viewports and EN/PT/ES, including narrow effective widths encountered at higher
  zoom. Checked menu interactions, visible link bounds and representative screenshots.
  Browser form checks passed in EN/PT/ES for 24 rows, PDF download, mocked native
  sharing/clipboard and new-form continuation preserving name/date/center.
  Print layout has no added header padding. Node 22 lint/build/PDF regression
  results and the production release are recorded through the release workflow.
- Existing unrelated lint warning and bundle-size warning remain. Native Safari
  UI zoom settings were not automated; WebKit viewport reflow was tested.
