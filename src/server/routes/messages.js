const express = require("express");
const router = express.Router();
const prisma = require("../db/client");
const { isLoggedIn } = require("../middleware/auth");
router.use(express.json());
//GET /api/messages —> fetch messages relevant to the logged-in user
router.get("/", isLoggedIn, async (req, res) => {
  try {
    let messages;

    if (req.user.role === "ADMIN") {
      //admins see all messages
      messages = await prisma.message.findMany({
        include: {
          sender: { select: { id: true, name: true, role: true } },
          recipient: { select: { id: true, name: true, role: true } },
        },
      });
    } else {
      //other users see only their own (sent or received)
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

//POST /api/messages —> Admins or HMs send messages (with role restrictions)
router.post("/", isLoggedIn, async (req, res) => {
  const { recipientId, content } = req.body;

  if (req.user.role === "CANDIDATE") {
    return res.status(403).json({ error: "Candidates cannot send messages" });
  }

  try {
    const recipient = await prisma.user.findUnique({
      where: { id: recipientId },
    });

    if (!recipient) {
      return res.status(404).json({ error: "Recipient not found" });
    }

    //HMs can only message candidates
    if (
      req.user.role === "HIRING_MANAGER" &&
      recipient.role !== "CANDIDATE"
    ) {
      return res
        .status(403)
        .json({ error: "HMs can only message candidates" });
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

//GET /api/messages/:id —> only sender/recipient/admin can access message
router.get("/:id", isLoggedIn, async (req, res, next) => {
  const {id} = req.params;
  
  try {
    const message = await prisma.message.findMany({
      where: { senderId: id },
      include: {
        sender: true,
        recipient: true,
      },
    });
    
    if (!message) {
      return res.status(404).json({ error: "Message not found" });
    }

    // const isSender = message.senderId === req.user.userId;
    // const isRecipient = message.recipientId === req.user.userId;
    // const isAdmin = req.user.role === "ADMIN";

    // if (!isSender && !isRecipient) {
    //   return res.status(403).json({ error: "Access denied" });
    // }

    res.json(message);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;