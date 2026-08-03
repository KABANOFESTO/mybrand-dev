import { registerAs } from '@nestjs/config';

export default registerAs('payment', () => ({
  currency: process.env.PAYPACK_CURRENCY || 'RWF',
  baseUrl: process.env.PAYPACK_BASE_URL || 'https://payments.paypack.rw/api',
  checkoutBaseUrl:
    process.env.PAYPACK_CHECKOUT_BASE_URL || 'https://checkout.paypack.rw/api',
  clientId: process.env.PAYPACK_CLIENT_ID || process.env.PAYPACK_API_KEY || '',
  clientSecret:
    process.env.PAYPACK_CLIENT_SECRET || process.env.PAYPACK_API_SECRET || '',
  appId: process.env.PAYPACK_APP_ID || '',
  webhookSecret: process.env.PAYPACK_WEBHOOK_SECRET || '',
  webhookMode: process.env.PAYPACK_WEBHOOK_MODE || 'development',
  requestTimeoutSeconds: Number(process.env.PAYPACK_REQUEST_TIMEOUT_SECONDS || '30'),
}));
