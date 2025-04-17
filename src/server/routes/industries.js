const express = require("express");
const router = express.Router();
const prisma = require("../db/client");
const { isLoggedIn, isAdmin } = require("../middleware/auth");

//GET /api/industries -> everyone incl guests
router.get("/", async (req, res) => {
  try {
    const industries = await prisma.industry.findMany();
    res.json(industries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//POST /api/industries -> only admins
router.post("/", isLoggedIn, isAdmin, async (req, res) => {
  const { name } = req.body;
  try {
    const industry = await prisma.industry.create({
      data: { name },
    });
    res.status(201).json(industry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
