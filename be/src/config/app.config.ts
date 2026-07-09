import { registerAs } from '@nestjs/config';
import { envBoolean, envList, envNumber } from '../shared/helpers/env.helper';

export default registerAs('app', () => {
  const port = envNumber(process.env.APP_PORT, 3000);

  return {
    name: process.env.APP_NAME || 'mybrand',
    version: process.env.APP_VERSION || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    port,
    apiPrefix: process.env.API_PREFIX || 'api',
    corsOrigin: envList(process.env.CORS_ORIGIN, ['http://localhost:5173']),
    docsEnabled: envBoolean(process.env.SWAGGER_ENABLED, true),
  };
});
