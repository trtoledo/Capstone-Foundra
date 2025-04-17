const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  //industry
  const industry = await prisma.industry.upsert({
    where: { name: 'Tech' },
    update: {},
    create: { name: 'Tech' },
  });

  //company
  const company = await prisma.company.create({
    data: {
      name: 'OpenAI',
      industryId: industry.id,
    },
  });

  //candidate user
  const hashedUserPassword = await bcrypt.hash('password123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'john@example.com' },
    update: {},
    create: {
      email: 'john@example.com',
      name: 'John Doe',
      password: hashedUserPassword,
      companyId: company.id,
      role: 'CANDIDATE',
    },
  });

  //video (with userId now)
  const video = await prisma.video.create({
    data: {
      url: 'https://example.com/video.mp4',
      title: 'Intro Video',
      companyId: company.id,
      userId: user.id,
    },
  });

  //top candidate
  await prisma.topCandidate.create({
    data: {
      name: 'John Doe',
      companyId: company.id,
      videoUrl: 'https://example.com/video.mp4',
    },
  });

  //feedback
  await prisma.feedback.create({
    data: {
      userId: user.id,
      content: 'Great candidate!',
    },
  });

  //report
  await prisma.report.create({
    data: {
      reason: 'Inappropriate content',
      companyId: company.id,
    },
  });

  //message
  await prisma.message.create({
    data: {
      userId: user.id,
      content: 'Welcome to the platform!',
    },
  });

  //comment
  await prisma.comment.create({
    data: {
      userId: user.id,
      content: 'This is a test comment',
    },
  });

  //admin user
  const hashedAdminPassword = await bcrypt.hash('adminpassword', 10);
  await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Super Admin',
      email: 'admin@example.com',
      password: hashedAdminPassword,
      role: 'ADMIN',
    },
  });

  console.log('Database seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
