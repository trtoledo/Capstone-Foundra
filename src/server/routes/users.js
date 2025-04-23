const express = require('express');
const router = express.Router();
const prisma = require('../db/client');
const {
  isLoggedIn,
  isOwnerOrAdmin,
} = require('../middleware/auth');

//GET all users -> everyone incl guests
router.get('/', async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//GET own profile —> logged-in user only
router.get('/me', isLoggedIn, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId }
    });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//GET one user by ID -> everyone incl guests
router.get('/:id', async (req, res) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.params.id } });
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//newly added: GET candidate by ID -> returns only if user is candidate
router.get('/candidates/:id', async (req, res) => {
  try {
    const candidate = await prisma.user.findFirst({
      where: {
        id: req.params.id,
        role: "CANDIDATE",
      },
      select: {
        id: true,
        name: true,
        email: true,
        companyId: true,
        role: true,
      },
    });

    if (!candidate) return res.status(404).json({ error: "Candidate not found" });
    res.json(candidate);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//PUT /api/users/:id —> only that individual user or admins
router.put('/:id', isLoggedIn, isOwnerOrAdmin, async (req, res) => {
  try {
    const { name, companyId } = req.body;
    const updated = await prisma.user.update({
      where: { id: req.params.id },
      data: { name, companyId }
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//DELETE /api/users/:id —> only that individual user or admins
router.delete('/:id', isLoggedIn, isOwnerOrAdmin, async (req, res) => {
  try {
    await prisma.feedback.deleteMany({ where: { userId: req.params.id } });
    await prisma.report.deleteMany({ where: { userId: req.params.id } });

    //FIXED: delete messages where user is sender or recipient
    await prisma.message.deleteMany({
      where: {
        OR: [
          { senderId: req.params.id },
          { recipientId: req.params.id }
        ]
      }
    });

    const deletedUser = await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ message: "User deleted", deletedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
