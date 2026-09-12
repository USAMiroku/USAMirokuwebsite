# World Messianic Church of America / Miroku Association USA

React + Vite website for the USA organization, with multilingual UI (`EN | ES | PT`) and dual PayPal donation flows.

Production: [www.worldmessianic.org](https://www.worldmessianic.org)

Repository: [github.com/USAMiroku/USAMirokuwebsite](https://github.com/USAMiroku/USAMirokuwebsite)

## Single Source of Truth
All branding, contact, center, and donate routing data is centralized in:
- `src/config/siteConfig.ts`

## Tech Stack
- React 19 + TypeScript
- Vite
- Tailwind CSS
- Vercel (frontend + serverless API routes)

## Local Development

Requirements:

- Node.js 22 LTS
- npm 10 or newer
- Access to the `USAMiroku/USAMirokuwebsite` GitHub repository

```bash
git clone https://github.com/USAMiroku/USAMirokuwebsite.git
cd USAMirokuwebsite
npm ci
cp .env.example .env.local
npm run dev
```

After the first installation, use `npm ci` whenever `package-lock.json` has not been intentionally changed. Before submitting changes, run:

```bash
npm run lint
npm run build
```

## Environment Variables
Copy `.env.example` and set values:

```bash
cp .env.example .env.local
```

Required:
- `VITE_SITE_URL`
- `PAYPAL_ENV` (`live` or `sandbox`)
- `PAYPAL_DONATIONS_CLIENT_ID`
- `PAYPAL_DONATIONS_SECRET`
- `PAYPAL_SANGETSU_CLIENT_ID`
- `PAYPAL_SANGETSU_SECRET`

Optional:
- `SITE_URL`
- `VITE_DONATION_API_BASE_URL`
- `VITE_GA4_ID`

Never commit `.env`, `.env.local`, Supabase service-role keys, PayPal secrets, Vercel tokens, or passwords. Local environment files and `.vercel/` are ignored by Git.

## PayPal API Routes (Vercel)
- `POST /api/paypal/create-order`
- `POST /api/paypal/capture-order`

Funding paths:
- `fundType=donation` (main donations account)
- `fundType=sangetsu` (Sangetsu account)

## Vercel Deployment

The production project is managed in the Miroku USA Vercel account. A new maintainer needs to be added to the Vercel team/project before deploying from another computer or AI account.

1. Install and authenticate the Vercel CLI: `npm install -g vercel && vercel login`.
2. From the repository root, run `vercel link` and select the existing `usa-mirokuwebsite` project. Do not create a duplicate production project.
3. Confirm that the required environment variables exist in Vercel Project Settings. Secrets should be configured in Vercel, never copied into GitHub.
4. Create a preview with `vercel deploy`.
5. After reviewing the preview, publish with `vercel deploy --prod`.

`vercel.json` includes SPA rewrites for React Router paths.

## Working From Another Computer or AI Account

Code access and service access are separate:

- **GitHub:** add the person or service account as a collaborator or organization member with the minimum required repository permission.
- **Vercel:** add the account to the existing team/project so it can create previews or production deployments.
- **Supabase:** grant access separately. Do not share the service-role key in chat or source control.
- **PayPal:** manage production credentials in the PayPal and Vercel dashboards; never transfer them through GitHub.

Recommended workflow:

```bash
git switch main
git pull --ff-only origin main
git switch -c codex/short-description
# make and test changes
git push -u origin codex/short-description
```

Open a pull request, allow the GitHub checks to finish, review the Vercel preview, and merge only after approval. Pull the updated `main` branch before starting the next change.

An AI account should receive only the repository and service permissions needed for the current task. It should not be given passwords in prompts, and it should never commit local environment files or tokens.

## Database Changes

Files under `supabase/` are versioned schema definitions and migrations. Apply a new migration to the intended Supabase project only after review and record it in Git. Never assume that committing a SQL file applies it automatically.
