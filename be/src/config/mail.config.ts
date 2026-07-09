import { registerAs } from '@nestjs/config';
import { envNumber } from '../shared/helpers/env.helper';

export default registerAs('mail', () => ({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: envNumber(process.env.SMTP_PORT, 587),
  user: process.env.SMTP_USER || '',
  pass: process.env.SMTP_PASS || '',
  from: process.env.SMTP_FROM || 'no-reply@mybrand.dev',
}));
