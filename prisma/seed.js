const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const { faker } = require("@faker-js/faker");

const prisma = new PrismaClient();

async function main() {
  const industryNames = [
    "Healthcare",
    "Finance",
    "Education",
    "Technology",
    "Retail",
    "Manufacturing",
    "Energy",
    "Transportation",
    "Hospitality",
    "Media",
  ];

  const industries = [];
  for (const name of industryNames) {
    const industry = await prisma.industry.create({
      data: { name },
    });
    industries.push(industry);
    console.log("Created industry:", industry.name);
  }

  const companyNames = [
    "Nimbus Tech",
    "UrbanGrid Solutions",
    "BlueRiver Financial",
    "NextGen Learning",
    "PulseCare Systems",
    "AeroBuild Manufacturing",
    "SunCore Energy",
    "MetroMove Logistics",
    "Skyline Hotels",
    "Visionary Media",
  ];

  const companies = [];
  for (let i = 0; i < 10; i++) {
    const company = await prisma.company.create({
      data: {
        name: companyNames[i],
        industryId: industries[i].id,
      },
    });
    companies.push(company);
  }

  const candidates = [];
  const hiringManagers = [];
  const admins = [];

  for (let i = 0; i < 30; i++) {
    const role = i < 10 ? "CANDIDATE" : i < 20 ? "HIRING_MANAGER" : "ADMIN";
    const user = await prisma.user.create({
      data: {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: await bcrypt.hash("password123", 10),
        role,
        companyId: companies[i % companies.length].id,
      },
    });

    if (role === "CANDIDATE") candidates.push(user);
    else if (role === "HIRING_MANAGER") hiringManagers.push(user);
    else admins.push(user);
  }

  const videos = [];
  for (let i = 0; i < candidates.length; i++) {
    const video = await prisma.video.create({
      data: {
        title: `Intro by ${candidates[i].name}`,
        url: `https://video-platform.com/video/${faker.word.noun()}-${i}`,
        userId: candidates[i].id,
        companyId: candidates[i].companyId,
        isPublic: i % 2 === 0,
      },
    });
    videos.push(video);
  }

  for (let i = 0; i < 5; i++) {
    await prisma.topCandidate.create({
      data: {
        name: candidates[i].name,
        companyId: candidates[i].companyId,
        videoUrl: videos[i].url,
        userId: candidates[i].id,
        isPublic: i % 2 === 0,
      },
    });
  }

  const reporters = [...candidates.slice(0, 5), ...hiringManagers.slice(0, 5)];
  for (const user of reporters) {
    await prisma.report.create({
      data: {
        reason: faker.hacker.phrase(),
        userId: user.id,
        companyId: user.companyId,
      },
    });
  }

  const commentContent = [
    "Impressive pitch! You clearly know your strengths.",
    "Loved your passion for tech — very authentic.",
    "Your leadership experience stood out in this.",
    "Great example of applying theory to real projects.",
    "You communicated your goals very effectively.",
    "Clear, concise, and confident — well done!",
    "Strong cultural fit, great energy!",
    "You highlighted your collaboration skills really well.",
    "Excellent explanation of your past projects.",
    "Your enthusiasm was contagious!",
    "Nice blend of technical and people skills.",
    "You articulated your value to the team clearly.",
    "Really appreciated your thoughtful career path.",
    "I can tell you’d be a great team member.",
    "Your story was very engaging — strong communicator.",
    "Good callout on data ethics — well thought out.",
    "You clearly did your research on our company.",
    "Your video made me excited to learn more about you.",
    "You showed great initiative — love that!",
    "Fantastic breakdown of complex ideas.",
  ];

  let commentIndex = 0;
  for (let i = 0; i < videos.length; i++) {
    const video = videos[i];
    for (let j = 0; j < 2; j++) {
      const commenter = [...candidates, ...hiringManagers][(i + j) % 20];
      await prisma.comment.create({
        data: {
          content: commentContent[commentIndex % commentContent.length],
          userId: commenter.id,
          videoId: video.id,
        },
      });
      commentIndex++;
    }
  }

  function getMessageContent(senderRole, recipientRole) {
    if (senderRole === "ADMIN" && recipientRole === "CANDIDATE") {
      return faker.helpers.arrayElement([
        "Welcome to the platform!",
        "Please complete your profile.",
        "Your video pitch looks great!",
      ]);
    } else if (senderRole === "ADMIN" && recipientRole === "HIRING_MANAGER") {
      return faker.helpers.arrayElement([
        "Please review the latest candidate.",
        "Reminder to leave feedback.",
        "Let’s sync about next week’s hiring plan.",
      ]);
    } else if (
      senderRole === "HIRING_MANAGER" &&
      recipientRole === "CANDIDATE"
    ) {
      return faker.helpers.arrayElement([
        "We’re impressed by your video!",
        "Can you tell us more about your experience?",
        "Great energy — let’s chat soon!",
      ]);
    } else {
      return faker.helpers.arrayElement([
        "Looking forward to connecting.",
        "Let’s discuss your application soon.",
        "Thanks for being on the platform!",
      ]);
    }
  }

  let createdMessages = 0;
  while (createdMessages < 15) {
    const senderPool = [...hiringManagers, ...admins];
    const recipientPool = [...candidates, ...hiringManagers, ...admins];

    const sender = senderPool[Math.floor(Math.random() * senderPool.length)];
    let recipient;
    do {
      recipient =
        recipientPool[Math.floor(Math.random() * recipientPool.length)];
    } while (recipient.id === sender.id);

    const content = getMessageContent(sender.role, recipient.role);

    await prisma.message.create({
      data: {
        senderId: sender.id,
        recipientId: recipient.id,
        content,
      },
    });

    createdMessages++;
  }

  console.log("Database seeded");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
