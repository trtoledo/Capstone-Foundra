const express = require("express");
const router = express.Router();
const prisma = require("../db/client");
const { isLoggedIn } = require("../middleware/auth");

router.use(express.json());

//GET /api/messages 
router.get("/", isLoggedIn, async (req, res) => {
  try {
    let messages;

    if (req.user.role === "ADMIN") {
      messages = await prisma.message.findMany({
        include: {
          sender: { select: { id: true, name: true, role: true } },
          recipient: { select: { id: true, name: true, role: true } },
        },
      });
    } else {
      messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: req.user.userId },
            { recipientId: req.user.userId },
          ],
        },
        include: {
          sender: { select: { id: true, name: true, role: true } },
          recipient: { select: { id: true, name: true, role: true } },
        },
      });
    }

    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//POST /api/messages 
router.post("/", isLoggedIn, async (req, res) => {
  const { recipientId, content } = req.body;

  try {
    const recipient = await prisma.user.findUnique({
      where: { id: recipientId },
    });

    if (!recipient) {
      return res.status(404).json({ error: "Recipient not found" });
    }

    const message = await prisma.message.create({
      data: {
        senderId: req.user.userId,
        recipientId,
        content,
      },
    });

    res.status(201).json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//GET /api/messages/:id 
router.get("/:id", isLoggedIn, async (req, res) => {
  const { id } = req.params;

  try {
    const message = await prisma.message.findUnique({
      where: { id: Number(id) },
      include: {
        sender: { select: { id: true, name: true } },
        recipient: { select: { id: true, name: true } },
      },
    });

    if (
      req.user.role !== "ADMIN" &&
      message.senderId !== req.user.userId &&
      message.recipientId !== req.user.userId
    ) {
      return res.status(403).json({ error: "Not authorized to view this message" });
    }

    res.json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//GET /api/messages/conversation/:userId/:otherUserId 
router.get("/conversation/:userId/:otherUserId", isLoggedIn, async (req, res) => {
  const { userId, otherUserId } = req.params;

  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, recipientId: otherUserId },
          { senderId: otherUserId, recipientId: userId },
        ],
      },
      orderBy: {
        createdAt: "asc",
      },
      include: {
        sender: { select: { id: true, name: true } },
        recipient: { select: { id: true, name: true } },
      },
    });

    res.json(messages);
  } catch (err) {
    console.error("Failed to fetch conversation:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
