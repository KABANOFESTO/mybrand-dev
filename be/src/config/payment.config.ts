import { registerAs } from '@nestjs/config';

export default registerAs('payment', () => ({
  currency: process.env.PAYMENT_CURRENCY || 'USD',
  stripeSecretKey: process.env.STRIPE_SECRET_KEY || '',
  stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET || '',
  mtnApiKey: process.env.MTN_API_KEY || '',
  airtelApiKey: process.env.AIRTEL_API_KEY || '',
}));
