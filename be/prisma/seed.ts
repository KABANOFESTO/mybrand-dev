import { seedDatabase } from '../src/database/prisma/prisma.seed';

seedDatabase().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exitCode = 1;
});
