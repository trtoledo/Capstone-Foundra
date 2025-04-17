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

//PUT /api/users/:id —> only that individual user or an admin
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

//DELETE /api/users/:id —> only that individual user or an admin
router.delete('/:id', isLoggedIn, isOwnerOrAdmin, async (req, res) => {
  try {
    await prisma.feedback.deleteMany({ where: { userId: req.params.id } });
    await prisma.message.deleteMany({ where: { userId: req.params.id } });
    await prisma.report.deleteMany({ where: { userId: req.params.id } });
    const deletedUser = await prisma.user.delete({ where: { id: req.params.id } });
    res.json({ message: "User deleted", deletedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
