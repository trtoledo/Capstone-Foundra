const express = require("express");
const router = express.Router();
const prisma = require("../db/client");

const { S3Client, PutObjectCommand, PutBucketCorsCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const {
  isLoggedIn,
  isOwnerOrAdmin,
} = require('../middleware/auth');

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function applyCorsPolicy() {
  const corsParams = {
    Bucket: process.env.S3_BUCKET,
    CORSConfiguration: {
      CORSRules: [
        {
          AllowedOrigins: ["*"],
          AllowedMethods: ["GET", "PUT", "POST"],
          AllowedHeaders: ["*"],
          ExposeHeaders: ["ETag"],
        },
      ],
    },
  };
  try {
    const command = new PutBucketCorsCommand(corsParams);
    await s3.send(command);
    console.log("✅ S3 CORS policy applied successfully.");
  } catch (err) {
    console.error("❌ Error applying S3 CORS policy:", err);
  }
}
applyCorsPolicy();

//GET all users -> everyone incl guests
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//GET own profile —> logged-in user only
router.get('/me', isLoggedIn, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//GET one user by ID -> everyone incl guests
router.get('/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//newly added: GET candidate by ID -> returns only if user is candidate
router.get('/candidates/:id', async (req, res) => {
  try {
    const candidate = await prisma.user.findFirst({
      where: {
        id: req.params.id,
        role: "CANDIDATE",
      },
      select: {
        id: true,
        name: true,
        email: true,
        companyId: true,
        role: true,
      },
    });

    if (!candidate) return res.status(404).json({ error: "Candidate not found" });
    res.json(candidate);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//PUT /api/users/:id —> only that individual user or admins
router.put('/:id', isLoggedIn, isOwnerOrAdmin, async (req, res) => {
  try {
    const { name, companyId, email, bio, avatarUrl } = req.body;
    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { name, companyId, email, bio, avatarUrl }
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//DELETE /api/users/:id —> only that individual user or admins
router.delete('/:id', isLoggedIn, isOwnerOrAdmin, async (req, res) => {
  try {
    await prisma.feedback.deleteMany({ where: { userId: req.params.id } });
    await prisma.report.deleteMany({ where: { userId: req.params.id } });

    //FIXED: delete messages where user is sender or recipient
    await prisma.message.deleteMany({
      where: {
        OR: [
          { senderId: req.params.id },
          { recipientId: req.params.id }
        ]
      }
    });

    const deletedUser = await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ message: "User deleted", deletedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/users/sign-profile-upload → get S3 signed URL for avatar
router.post("/sign-s3-profile", isLoggedIn, async (req, res) => {
  const { filename } = req.body;
  if (!filename) return res.status(400).json({ error: "filename is required" });

  const key = `avatar/${req.user.userId}/${filename}`;

  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: key,
    ContentType: "image/jpeg",
  };

  try {
    const cmd = new PutObjectCommand(params);
    const url = await getSignedUrl(s3, cmd, { expiresIn: 60 });
    res.json({ url, key });
  } catch (err) {
    console.error("Error signing S3 URL:", err);
    res.status(500).json({ error: "Could not generate signed URL" });
  }
});

module.exports = router;
