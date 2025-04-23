const express = require("express");
const router = express.Router();
const prisma = require("../db/client");

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
router.post("/", isLoggedIn, async (req, res) => {
  try {
    if (req.user.role !== "CANDIDATE") {
      return res.status(403).json({ error: "Only candidates can upload videos" });
    }

    const { title, url, isPublic = true } = req.body;

    const video = await prisma.video.create({
      data: {
        title,
        url,
        isPublic,
        //tied to candidate's account
        userId: req.user.userId 
      }
    });

    res.status(201).json(video);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//PUT update video —> only video owner/ admins
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

module.exports = router;
