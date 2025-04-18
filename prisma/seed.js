const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function main() {
  const industries = ['Tech', 'Finance', 'Health', 'Education', 'Retail', 'Media', 'Manufacturing', 'Energy', 'Transport', 'Hospitality'];

  const createdIndustries = [];
  for (const name of industries) {
    const industry = await prisma.industry.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    createdIndustries.push(industry);
  }

  const createdCompanies = [];
  for (let i = 0; i < 10; i++) {
    const company = await prisma.company.create({
      data: {
        name: `Company ${i + 1}`,
        industryId: createdIndustries[i % industries.length].id,
      },
    });
    createdCompanies.push(company);
  }

  const users = [];
  for (let i = 0; i < 10; i++) {
    const hashedPassword = await bcrypt.hash('password123', 10);
    const user = await prisma.user.create({
      data: {
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
        password: hashedPassword,
        role: 'CANDIDATE',
        companyId: createdCompanies[i % createdCompanies.length].id,
      },
    });
    users.push(user);

    const video = await prisma.video.create({
      data: {
        title: `Video ${i + 1}`,
        url: `https://example.com/video${i + 1}.mp4`,
        companyId: createdCompanies[i % createdCompanies.length].id,
        userId: user.id,
      },
    });

    await prisma.topCandidate.create({
      data: {
        name: user.name,
        companyId: createdCompanies[i % createdCompanies.length].id,
        videoUrl: video.url,
      },
    });

    await prisma.feedback.create({
      data: {
        userId: user.id,
        content: `Feedback for ${user.name}`,
      },
    });

    await prisma.report.create({
      data: {
        reason: 'Flagged for review',
        userId: user.id,
        companyId: createdCompanies[i % createdCompanies.length].id,
      },
    });

    await prisma.message.create({
      data: {
        userId: user.id,
        content: `Welcome, ${user.name}!`,
      },
    });

    await prisma.comment.create({
      data: {
        userId: user.id,
        content: `Comment by ${user.name}`,
      },
    });

    // Review
    await prisma.review.create({
      data: {
        userId: user.id,
        content: `Review by ${user.name}`,
        videoId: video.id,
      },
    });
  }

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

  console.log('Database seeded with 10 users, companies, industries and related data');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });