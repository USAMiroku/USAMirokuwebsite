# World Messianic Church of Canada

Official website for World Messianic Church of Canada, discovering Johrei in Canada.

## Live Website
The site is hosted on Firebase:
[https://mirokucanada-site.web.app](https://mirokucanada-site.web.app)

## Tech Stack
- **Framework**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Hosting**: Firebase Hosting

## Development
To run the project locally:
```bash
npm install
npm run dev
```

For Stripe local setup:
```bash
cp .env.example .env
npm install
cd functions && npm install && cd ..
firebase functions:secrets:set STRIPE_SECRET_KEY
```

## Deployment
To deploy changes to Firebase:
```bash
npm run build
npx firebase deploy
```

This project now deploys both:
- Firebase Hosting (frontend)
- Firebase Functions (`/api/create-payment-intent` for Stripe PaymentIntent creation)
