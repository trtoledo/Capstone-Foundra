const express = require("express");
const router = express.Router();
const prisma = require("../db/client");
const {
  isLoggedIn,
  isAdmin
} = require("../middleware/auth");

//GET all reviews —> everyone incl guests
router.get("/", async (req, res) => {
  try {
    const reviews = await prisma.review.findMany();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//POST review -> only hirirng manager
router.post("/", isLoggedIn, async (req, res) => {
  if (req.user.role !== "HIRING_MANAGER") {
    return res.status(403).json({ error: "Only hiring managers can create reviews" });
  }

  const { content, userId, videoId } = req.body;
  try {
    const review = await prisma.review.create({
      data: {
        content,
        userId,
        videoId,
      },
    });
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//PUT review -> only author of review can update
router.put("/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const review = await prisma.review.findUnique({ where: { id } });
    if (!review) return res.status(404).json({ error: "Review not found" });

    if (req.user.userId !== review.userId) {
      return res.status(403).json({ error: "Only the review author can update this" });
    }

    const updated = await prisma.review.update({
      where: { id },
      data: { content },
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//DELETE review -> only admin or author of review can delete
router.delete("/:id", isLoggedIn, async (req, res) => {
  try {
    const review = await prisma.review.findUnique({ where: { id: req.params.id } });
    if (!review) return res.status(404).json({ error: "Review not found" });

    const isAuthor = req.user.userId === review.userId;
    const isPlatformAdmin = req.user.role === "ADMIN";

    if (!isAuthor && !isPlatformAdmin) {
      return res.status(403).json({ error: "Not authorized to delete this review" });
    }

    await prisma.review.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
