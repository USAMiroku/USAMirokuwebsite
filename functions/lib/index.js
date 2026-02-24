"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPaymentIntent = void 0;
const https_1 = require("firebase-functions/v2/https");
const params_1 = require("firebase-functions/params");
const stripe_1 = __importDefault(require("stripe"));
const stripeSecretKey = (0, params_1.defineSecret)('STRIPE_SECRET_KEY');
let stripeClient = null;
function getStripeClient(secret) {
    if (!stripeClient) {
        stripeClient = new stripe_1.default(secret);
    }
    return stripeClient;
}
function setCorsHeaders(origin, res) {
    const defaultAllowed = [
        'https://mirokucanada-site.web.app',
        'https://mirokucanada-site.firebaseapp.com',
        'http://localhost:5173',
    ];
    const configured = (process.env.ALLOWED_ORIGINS ?? '')
        .split(',')
        .map((entry) => entry.trim())
        .filter(Boolean);
    const allowedOrigins = configured.length ? configured : defaultAllowed;
    if (origin && allowedOrigins.includes(origin)) {
        res.set('Access-Control-Allow-Origin', origin);
    }
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
}
exports.createPaymentIntent = (0, https_1.onRequest)({ secrets: [stripeSecretKey] }, async (req, res) => {
    setCorsHeaders(req.headers.origin, res);
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }
    if (req.method !== 'POST') {
        res.status(405).json({ error: 'Method not allowed.' });
        return;
    }
    const body = (req.body ?? {});
    const amountInCents = Number(body.amountInCents);
    if (!Number.isFinite(amountInCents) || amountInCents <= 0) {
        res.status(400).json({ error: 'Amount must be greater than 0.' });
        return;
    }
    const secretKey = stripeSecretKey.value();
    if (!secretKey) {
        res.status(500).json({ error: 'Missing Stripe secret key configuration.' });
        return;
    }
    try {
        const stripe = getStripeClient(secretKey);
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amountInCents),
            currency: (body.currency ?? 'cad').toLowerCase(),
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                donationType: body.donationType ?? 'unspecified',
                donorName: body.donorName ?? '',
                donorEmail: body.donorEmail ?? '',
            },
        });
        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : 'Could not create PaymentIntent.';
        res.status(500).json({ error: message });
    }
});
//# sourceMappingURL=index.js.map