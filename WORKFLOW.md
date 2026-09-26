# Working on the website from different computers

Use the T7 folder `Projects/USAMirokuwebsite` as the working project.
Its `.git` folder contains the history. GitHub repository:
https://github.com/USAMiroku/USAMirokuwebsite

The neighboring `usa-mirokuwebsite-live/src` folder is a source-only mirror.
Do not edit or deploy that mirror. The original recovered copy was older than
GitHub and could overwrite improvements. Do not run `sync-usamiroku-repo.sh`.

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
its URL and source commit, pushes that record, and refreshes the source mirror.
A failure is an incomplete release; read the output before retrying. If the
site deployed but the record push failed, finish that push and run the mirror
command without redeploying. No force pushes or automatic conflict resolution.

The final check is: live deployment ready, GitHub main = T7 HEAD, clean working
tree, and a matching `.source-commit` file in the source mirror. Safely eject T7
before changing computers. This workflow runs when invoked; it is not a
background synchronization service.
