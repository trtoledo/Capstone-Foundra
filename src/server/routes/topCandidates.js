const express = require("express");
const router = express.Router();
const prisma = require("../db/client");
const { isLoggedIn, isAdmin, isHiringManager } = require("../middleware/auth");

//public list

//GET /api/top-candidates/public — Admins & HM can view
router.get("/public", isLoggedIn, async (req, res) => {
  const allowed = req.user.role === "ADMIN" || req.user.role === "HIRING_MANAGER";
  if (!allowed) return res.status(403).json({ error: "Access denied" });

  try {
    const top = await prisma.topCandidate.findMany({
      where: { isPublic: true },
    });
    res.json(top);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//POST /api/top-candidates/public — admins only
router.post("/public", isLoggedIn, isAdmin, async (req, res) => {
  const { name, companyId, videoUrl } = req.body;
  try {
    const newTop = await prisma.topCandidate.create({
      data: {
        name,
        companyId,
        videoUrl,
        isPublic: true,
      },
    });
    res.status(201).json(newTop);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//DELETE /api/top-candidates/public/:id — admins only
router.delete("/public/:id", isLoggedIn, isAdmin, async (req, res) => {
  try {
    await prisma.topCandidate.delete({ where: { id: req.params.id } });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//HM wishlist

//GET /api/top-candidates/wishlist — HM sees only their own
router.get("/wishlist", isLoggedIn, isHiringManager, async (req, res) => {
  try {
    const wishlist = await prisma.topCandidate.findMany({
      where: {
        userId: req.user.userId,
        isPublic: false,
      },
    });
    res.json(wishlist);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//POST /api/top-candidates/wishlist — HM adds to own private list
router.post("/wishlist", isLoggedIn, isHiringManager, async (req, res) => {
  const { name, companyId, videoUrl } = req.body;
  try {
    const newEntry = await prisma.topCandidate.create({
      data: {
        name,
        companyId,
        videoUrl,
        isPublic: false,
        userId: req.user.userId, //tie to HM
      },
    });
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//DELETE /api/top-candidates/wishlist/:id — HM can delete only their own
router.delete("/wishlist/:id", isLoggedIn, isHiringManager, async (req, res) => {
  try {
    const topCandidate = await prisma.topCandidate.findUnique({
      where: { id: req.params.id },
    });

    if (!topCandidate || topCandidate.userId !== req.user.userId) {
      return res.status(403).json({ error: "Access denied" });
    }

    await prisma.topCandidate.delete({ where: { id: req.params.id } });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
