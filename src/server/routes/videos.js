const express = require("express");
const router = express.Router();
const prisma = require("../db/client");
const {
  isLoggedIn,
} = require("../middleware/auth");

//GET all videos —> everyone incl guestes
router.get("/", async (req, res) => {
  try {
    const videos = await prisma.video.findMany();
    res.json(videos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//GET one video —> only people with account who are logged in
router.get("/:id", isLoggedIn, async (req, res) => {
  try {
    const video = await prisma.video.findUnique({ where: { id: req.params.id } });
    if (!video) return res.status(404).json({ error: "Video not found" });
    res.json(video);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//POST create video —> only candidates
router.post("/", isLoggedIn, async (req, res) => {
  try {
    if (req.user.role !== "CANDIDATE") {
      return res.status(403).json({ error: "Only candidates can upload videos" });
    }

    const { title, url, companyId } = req.body;
    const video = await prisma.video.create({
      data: {
        title,
        url,
        companyId,
        //track who uploads video
        userId: req.user.userId 
      }
    });

    res.status(201).json(video);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//PUT update video —> onlu video owner or admin
router.put("/:id", isLoggedIn, async (req, res) => {
  try {
    const video = await prisma.video.findUnique({ where: { id: req.params.id } });
    if (!video) return res.status(404).json({ error: "Video not found" });

    //only video uploader or admin can update
    if (req.user.role !== "ADMIN" && req.user.userId !== video.userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    const { title, url } = req.body;
    const updated = await prisma.video.update({
      where: { id: req.params.id },
      data: { title, url }
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//DELETE video —> only video owner or admin
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

module.exports = router;
