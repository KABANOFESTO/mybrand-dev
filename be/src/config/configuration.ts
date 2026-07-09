import appConfig from './app.config';
import databaseConfig from './database.config';
import jwtConfig from './jwt.config';
import aiConfig from './ai.config';
import paymentConfig from './payment.config';
import mailConfig from './mail.config';

const configuration = [
  appConfig,
  databaseConfig,
  jwtConfig,
  aiConfig,
  paymentConfig,
  mailConfig,
];

export default configuration;
