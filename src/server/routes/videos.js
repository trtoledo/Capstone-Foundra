const express = require("express");
const router = express.Router();
const prisma = require("../db/client");


const { S3Client, PutObjectCommand, PutBucketCorsCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

async function applyCorsPolicy() {
  const corsParams = {
    Bucket: process.env.S3_BUCKET,
    CORSConfiguration: {
      CORSRules: [
        {
          AllowedOrigins: ['*'],
          AllowedMethods: ['GET', 'PUT', 'POST'],
          AllowedHeaders: ['*'],
          ExposeHeaders: ['ETag']
        }
      ]
    }
  };
  try {
    const command = new PutBucketCorsCommand(corsParams);
    await s3.send(command);
    console.log('✅ S3 CORS policy applied successfully.');
  } catch (err) {
    console.error('❌ Error applying S3 CORS policy:', err);
  }
}
applyCorsPolicy();

//GET all videos —> everyone incl guests

//use fallback import style to avoid undefined middleware
const auth = require("../middleware/auth");
const isLoggedIn = auth.isLoggedIn;

//debug log to confirm middleware loaded
//should be function
console.log("isLoggedIn middleware loaded:", typeof isLoggedIn); 

//GET all public videos —> everyone incl guests

router.get("/", async (req, res) => {
  try {
    const videos = await prisma.video.findMany({
      where: { isPublic: true }
    });
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//GET one video —> only logged-in users/ private access restricted
router.get("/:id", isLoggedIn, async (req, res) => {
  try {
    const video = await prisma.video.findUnique({ where: { id: req.params.id } });
    if (!video) return res.status(404).json({ error: "Video not found" });

    const isOwner = video.userId === req.user.userId;
    const isAdmin = req.user.role === "ADMIN";

    //if video on private --> only owner/ admins can see
    if (!video.isPublic && !isOwner && !isAdmin) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(video);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//POST create video —> only candidates
router.post("/", isLoggedIn, async (req, res, next) => {
  console.log(req.user.role);
  
  try {
    if (req.user.role !== "CANDIDATE") {
      return res.status(403).json({ error: "Only candidates can upload videos" });
    }


    const { title, url} = req.body;


    const video = await prisma.video.create({
      data: {
        title,
        url,
        userId: req.user.userId
      }
    });

    res.status(201).json(video);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//PUT update video —> only video owner or admin
router.put("/:id", isLoggedIn, async (req, res) => {
  try {
    const video = await prisma.video.findUnique({ where: { id: req.params.id } });
    if (!video) return res.status(404).json({ error: "Video not found" });

    if (req.user.role !== "ADMIN" && req.user.userId !== video.userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    const { title, url, isPublic } = req.body;

    const updated = await prisma.video.update({
      where: { id: req.params.id },
      data: {
        ...(title && { title }),
        ...(url && { url }),
        ...(isPublic !== undefined && { isPublic })
      }
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//DELETE video —> only video owne/ admins
router.delete("/:id", isLoggedIn, async (req, res) => {
  try {
    const video = await prisma.video.findUnique({ where: { id: req.params.id } });
    if (!video) return res.status(404).json({ error: "Video not found" });

    if (req.user.role !== "ADMIN" && req.user.userId !== video.userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    await prisma.video.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/sign-s3', isLoggedIn, async (req, res) => {
  const { filename } = req.body;
  if (!filename) return res.status(400).json({ error: 'filename is required' });

  const key = `videos/${req.user.userId}/${filename}`;

  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: key,
    ContentType: 'video/webm'
  };

  try {
    const cmd = new PutObjectCommand(params);
    const url = await getSignedUrl(s3, cmd, { expiresIn: 60 });
    res.json({ url, key });
  } catch (err) {
    console.error('Error signing S3 URL:', err);
    res.status(500).json({ error: 'Could not generate signed URL' });
  }
});

module.exports = router;