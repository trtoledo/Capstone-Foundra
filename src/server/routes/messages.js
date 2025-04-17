const express = require("express");
const router = express.Router();
const prisma = require("../db/client");
const { isLoggedIn, isAdmin } = require("../middleware/auth");

//GET /api/messages —> just individual user aka every user can only see their own messages that admin sent them
router.get("/", isLoggedIn, async (req, res) => {
  try {
    const messages = await prisma.message.findMany({
      //only own messages!!
      where: { userId: req.user.userId }, 
    });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//POST /api/messages -> only admins who can send the messages to individual users
router.post("/", isLoggedIn, isAdmin, async (req, res) => {
  const { userId, content } = req.body;
  try {
    const message = await prisma.message.create({
      data: { userId, content },
    });
    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
