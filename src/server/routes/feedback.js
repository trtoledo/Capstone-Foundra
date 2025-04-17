const express = require("express");
const router = express.Router();
const prisma = require("../db/client");

router.get("/", async (req, res) => {
  try {
    const feedback = await prisma.feedback.findMany();
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  const { userId, content } = req.body;
  try {
    const feedback = await prisma.feedback.create({
      data: { userId, content },
    });
    res.status(201).json(feedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await prisma.feedback.delete({ where: { id: req.params.id } });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
