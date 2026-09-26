#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
case "$PWD" in /Volumes/*/USAMirokuwebsite) ;; *) echo 'Run from the canonical T7 USAMirokuwebsite checkout.' >&2; exit 1;; esac
[[ $(git branch --show-current) == main ]] || { echo 'Merge changes into main first.'; exit 1; }
[[ -z $(git status --porcelain) ]] || { echo 'Commit changes and change log first.'; exit 1; }
git fetch origin
[[ $(git rev-parse HEAD) == $(git rev-parse origin/main) ]] || { echo 'Synchronize main with GitHub first.'; exit 1; }
[[ -f .vercel/project.json ]] || { echo 'Link the existing usa-mirokuwebsite Vercel project first.'; exit 1; }
node -e 'const p=require("./.vercel/project.json"); if(p.projectId!=="prj_2CkPfZbp9DuaQoVGCEq2Oh6sIEiH") process.exit(1)'
npm run lint
npm run build
npm run test:forms
source_commit=$(git rev-parse HEAD)
# Save both source copies before production deployment.
python3 scripts/sync-t7-mirror.py
deployment_output=$(vercel deploy --prod -y)
deployment_url=$(printf '%s\n' "$deployment_output" | python3 -c 'import re,sys; urls=re.findall(r"https://[a-zA-Z0-9.-]+\.vercel\.app", sys.stdin.read()); print(urls[-1] if urls else "")')
[[ "$deployment_url" == https://*.vercel.app ]] || { echo 'Unexpected deployment output; inspect Vercel before continuing.'; exit 1; }
vercel inspect "$deployment_url"
{
  printf '\n## %s\n\n' "$(date -u '+%Y-%m-%d %H:%M UTC')"
  printf -- '- Source commit: `%s`\n' "$source_commit"
  printf -- '- Production deployment: %s\n' "$deployment_url"
  printf -- '- Validation: lint, build and form PDF regression checks passed; Vercel deployment inspected.\n'
} >> DEPLOYMENTS.md
git add DEPLOYMENTS.md
git commit -m 'Record verified production deployment'
git push origin main
python3 scripts/sync-t7-mirror.py
echo "Production deployed; GitHub and T7 synchronized: $deployment_url"
