import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create sample team
  const team = await prisma.team.create({
    data: {
      name: 'Design Team',
      description: 'Our awesome design team',
    },
  });

  // Create sample project
  const project = await prisma.project.create({
    data: {
      name: 'Website Redesign',
      description: 'Complete website overhaul',
      teamId: team.id,
    },
  });

  // Create sample tasks
  const tasks = await Promise.all([
    prisma.task.create({
      data: {
        title: 'Create wireframes',
        description: 'Design initial wireframes',
        status: 'TODO',
        priority: 'HIGH',
        projectId: project.id,
      },
    }),
    prisma.task.create({
      data: {
        title: 'Design color scheme',
        description: 'Select primary and secondary colors',
        status: 'IN_PROGRESS',
        priority: 'MEDIUM',
        projectId: project.id,
      },
    }),
  ]);

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });