const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const industry = await prisma.industry.create({
    data: {
      name: 'Tech'
    }
  });

  const company = await prisma.company.create({
    data: {
      name: 'OpenAI',
      industryId: industry.id
    }
  });

  const user = await prisma.user.create({
    data: {
      email: 'john@example.com',
      name: 'John Doe',
      companyId: company.id
    }
  });

  const video = await prisma.video.create({
    data: {
      url: 'https://example.com/video.mp4',
      companyId: company.id
    }
  });

  const topCandidate = await prisma.topCandidate.create({
    data: {
      userId: user.id,
      videoId: video.id
    }
  });

  await prisma.feedback.create({
    data: {
      userId: user.id,
      content: 'Great candidate!'
    }
  });

  await prisma.report.create({
    data: {
      title: 'Monthly Report',
      content: 'All systems go',
      companyId: company.id
    }
  });

  await prisma.message.create({
    data: {
      userId: user.id,
      content: 'Welcome to the platform!'
    }
  });

  await prisma.admin.create({
    data: {
      email: 'admin@example.com',
      name: 'Super Admin'
    }
  });

  console.log('Database seeded!');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });