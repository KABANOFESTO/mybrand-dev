import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function seedDatabase() {
  await prisma.skill.upsert({
    where: { name: 'NestJS' },
    update: {},
    create: {
      name: 'NestJS',
      category: 'BACKEND',
      proficiency: 90,
      sortOrder: 1,
    },
  });

  await prisma.project.upsert({
    where: { slug: 'mybrand-portfolio' },
    update: {},
    create: {
      slug: 'mybrand-portfolio',
      title: 'MyBrand Portfolio',
      description: 'AI-powered developer portfolio platform.',
      featured: true,
      status: 'IN_PROGRESS',
      technologies: ['NestJS', 'Prisma', 'PostgreSQL', 'React'],
      features: [
        'Owner dashboard',
        'AI tools',
        'Analytics',
        'Premium subscriptions',
      ],
    },
  });
}

if (require.main === module) {
  seedDatabase()
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error);
      process.exitCode = 1;
    })
    .finally(async () => {
      await prisma.$disconnect();
    });
}
