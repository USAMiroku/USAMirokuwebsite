# World Messianic Church of America / Miroku Association USA

React + Vite website for the USA organization, with multilingual UI (`EN | ES | PT`) and dual PayPal donation flows.

## Single Source of Truth
All branding, contact, center, and donate routing data is centralized in:
- `src/config/siteConfig.ts`

## Tech Stack
- React 19 + TypeScript
- Vite
- Tailwind CSS
- Vercel (frontend + serverless API routes)

## Local Development
```bash
npm install
npm run dev
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

## PayPal API Routes (Vercel)
- `POST /api/paypal/create-order`
- `POST /api/paypal/capture-order`

Funding paths:
- `fundType=donation` (main donations account)
- `fundType=sangetsu` (Sangetsu account)

## Vercel Deployment
1. Import repository into Vercel.
2. Build command: `npm run build`
3. Output directory: `dist`
4. Configure environment variables in Vercel Project Settings.
5. Deploy.

`vercel.json` includes SPA rewrites for React Router paths.
