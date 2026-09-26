# Website maintenance agreement

User instruction (2026-09-26): every website change must be logged, tested,
saved on the T7 external drive and GitHub, and deployed to the live website.
Do not report completion until all three locations are verified, or clearly
report which step is blocked. Never assume a pushed feature branch is live.

Canonical repository: USAMiroku/USAMirokuwebsite, production branch main.
The T7 checkout is Projects/USAMirokuwebsite. Projects/usa-mirokuwebsite-live/src
is a generated source mirror, not a separate development/deployment source.
Paths may have different drive prefixes on another computer.

Before editing:
- Read CHANGELOG.md and WORKFLOW.md; inspect git status and fetch origin.
- Compare main with all relevant branches and the last deployment record.
- Preserve existing uncommitted work and previously accepted improvements.
- Never run the legacy sync-usamiroku-repo.sh: it can overwrite newer code
  with the old recovered source. Do not deploy from a stale checkout.

For each change:
- Add a dated CHANGELOG.md entry with reason, behavior, validation and recovery
  commit references where relevant. Do not invent historical deployment facts.
- Check forms in EN/PT/ES: 24 ancestor rows, 17/15 prayer writing lines,
  sharp PDF text, overflow pages, PDF sharing, selected-center email copying,
  and saving/starting another form while preserving name, date and center.
- Run npm run lint, npm run build, and npm run test:forms.
- Commit and push to main (merge reviewed branches first when applicable).
- Run bash scripts/release.sh from the T7 checkout. It checks synchronization,
  publishes production, records the deployment and updates the source mirror.
- Verify origin/main equals the T7 HEAD and the working tree is clean.
- If network, drive, credentials or deployment are unavailable, explicitly
  report the incomplete step. Never claim automatic synchronization occurred.

Secrets stay in ignored environment files and Vercel; never commit them.
