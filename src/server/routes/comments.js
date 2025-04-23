const express = require("express");
const router = express.Router();
const prisma = require("../db/client");
const { isLoggedIn } = require("../middleware/auth");

//GET /api/comments -> everyone incl guests
router.get("/", async (req, res) => {
  try {
    const comments = await prisma.comment.findMany({
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
    });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//POST /api/comments —> only people who have an account (NOT admins)
router.post("/", isLoggedIn, async (req, res) => {
  const { content } = req.body;

  //block admins from creating comments
  if (req.user.role === "ADMIN") {
    return res.status(403).json({ error: "Admins cannot create comments" });
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        //only use authenticated user
        userId: req.user.userId,
      },
    });
    res.status(201).json(comment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//PUT /api/comments/:id —> only author (NOT admins)
router.put("/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  try {
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    //block admins from editing comments
    if (req.user.role === "ADMIN") {
      return res.status(403).json({ error: "Admins cannot edit comments" });
    }

    if (req.user.userId !== comment.userId) {
      return res.status(403).json({ error: "You can only edit your own comment" });
    }

    const updated = await prisma.comment.update({
      where: { id },
      data: { content },
    });

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//DELETE /api/comments/:id —> either author or admin
router.delete("/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;

  try {
    const comment = await prisma.comment.findUnique({ where: { id } });
    if (!comment) return res.status(404).json({ error: "Comment not found" });

    const isAuthor = req.user.userId === comment.userId;
    const isAdmin = req.user.role === "ADMIN";

    if (!isAuthor && !isAdmin) {
      return res.status(403).json({ error: "Not authorized to delete this comment" });
    }

    await prisma.comment.delete({ where: { id } });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
