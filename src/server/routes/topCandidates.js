const express = require("express");
const router = express.Router();
const prisma = require("../db/client");
const { isLoggedIn, isHiringManager, isAdmin } = require("../middleware/auth");

//GET /api/top-candidates -> everyone incl guests
router.get("/", async (req, res) => {
  try {
    const top = await prisma.topCandidate.findMany();
    res.json(top);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//POST /api/top-candidates -> only hiring manager can create top candidate
router.post("/", isLoggedIn, isHiringManager, async (req, res) => {
  const { name, companyId, videoUrl } = req.body;
  try {
    const newTop = await prisma.topCandidate.create({
      data: { name, companyId, videoUrl },
    });
    res.status(201).json(newTop);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//DELETE /api/top-candidates/:id -> only admin or hiring manager can remove top candidate
router.delete("/:id", isLoggedIn, async (req, res) => {
  const isPrivileged =
    req.user.role === "ADMIN" || req.user.role === "HIRING_MANAGER";

  if (!isPrivileged) {
    return res.status(403).json({ error: "Access denied" });
  }

  try {
    await prisma.topCandidate.delete({ where: { id: req.params.id } });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
