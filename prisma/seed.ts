import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create sample team
  const team = await prisma.team.create({
    data: {
      name: 'Default Team',
      description: 'Default team for tasks',
    },
  });

  // Create sample project
  const project = await prisma.project.create({
    data: {
      name: 'Default Project',
      description: 'Default project for tasks',
      teamId: team.id,
    },
  });

  console.log('Database seeded successfully with default team and project!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });