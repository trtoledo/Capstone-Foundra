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

//newly added: GET /api/industries/:id -> everyone incl guests
router.get("/:id", async (req, res) => {
  try {
    const industry = await prisma.industry.findUnique({
      where: { id: req.params.id },
    });
    if (!industry) return res.status(404).json({ error: "Industry not found" });
    res.json(industry);
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

//PUT /api/industries/:id -> only admins
router.put("/:id", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const updated = await prisma.industry.update({
      where: { id: req.params.id },
      data: { name: req.body.name },
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//DELETE /api/industries/:id -> only admins
router.delete("/:id", isLoggedIn, isAdmin, async (req, res) => {
  try {
    await prisma.industry.delete({ where: { id: req.params.id } });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
