# Working on the website from different computers

Use the T7 folder `Projects/USAMirokuwebsite` as the working project.
Its `.git` folder contains the history. GitHub repository:
https://github.com/USAMiroku/USAMirokuwebsite

Keep exactly one website folder on T7: `USAMirokuwebsite`. The duplicate
`usa-mirokuwebsite-live` folder and obsolete sync scripts were removed at the
user's request. Do not recreate mirrors or backup source folders. Use Git
history and GitHub to inspect or recover earlier versions.

## Start work

1. Connect T7 and open `USAMirokuwebsite` in your coding app.
2. Run `git status`, then `git fetch origin` and `git pull --ff-only origin main`
   from a clean main checkout. Resolve divergence rather than overwriting it.
3. Read `CHANGELOG.md` and `DEPLOYMENTS.md`. Check other branches if an expected
   feature is missing: a branch saved on GitHub is not necessarily in main.
4. Use the Node version in `.nvmrc`; run `npm ci` on a new computer. Dependencies
   may need reinstalling when switching operating systems or CPU architectures.
5. Authenticate GitHub and Vercel on each computer. Local secret configuration
   is not committed; use authorized Vercel environment settings when needed.

## Finish work

Update CHANGELOG.md, run lint/build/form tests, then commit and push main.
Run `bash scripts/release.sh` from the T7 checkout. The script verifies that
main is current, deploys to the existing Vercel project in production, records
its URL and source commit, pushes that record, and verifies T7 matches GitHub.
A failure is an incomplete release; read the output before retrying. If the
site deployed but the record push failed, finish that push and verify
`git rev-parse HEAD` matches `git ls-remote origin refs/heads/main`. No force pushes or automatic conflict resolution.

The final check is: live deployment ready, GitHub main = T7 HEAD, clean working
tree, and an accurate entry in `DEPLOYMENTS.md`. Safely eject T7
before changing computers. This workflow runs when invoked; it is not a
background synchronization service.
