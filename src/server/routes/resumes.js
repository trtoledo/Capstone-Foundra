const express = require("express");
const router = express.Router();
const { S3Client, PutObjectCommand, PutBucketCorsCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");

const { isLoggedIn } = require("../middleware/auth");

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
    console.log("✅ S3 CORS policy applied successfully (resumes).");
  } catch (err) {
    console.error("❌ Error applying S3 CORS policy (resumes):", err);
  }
}
applyCorsPolicy();

router.post("/sign-upload", isLoggedIn, async (req, res) => {
  const { filename } = req.body;
  if (!filename) return res.status(400).json({ error: "filename is required" });

  const key = `resumes/${req.user.userId}/${filename}`;

  const params = {
    Bucket: process.env.S3_BUCKET,
    Key: key,
    ContentType: "application/pdf", 
  };

  try {
    const cmd = new PutObjectCommand(params);
    const url = await getSignedUrl(s3, cmd, { expiresIn: 60 });
    res.json({ url, key });
  } catch (err) {
    console.error("Error signing resume S3 URL:", err);
    res.status(500).json({ error: "Could not generate signed URL" });
  }
});

module.exports = router;