const express = require("express");
const router = express.Router();
const prisma = require("../db/client");
const { isLoggedIn, isAdmin } = require("../middleware/auth");

//GET /api/companies -> everyone incl guests
router.get("/", async (req, res) => {
  try {
    const companies = await prisma.company.findMany();
    res.json(companies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//newly added: GET /api/companies/:id -> everyone incl guests
router.get("/:id", async (req, res) => {
  try {
    const company = await prisma.company.findUnique({
      where: {
        id: parseInt(req.params.id, 10), // This conversion is necessary
      },
    });
    if (!company) return res.status(404).json({ error: "Company not found" });
    res.json(company);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//POST /api/companies -> only admins
router.post("/", isLoggedIn, isAdmin, async (req, res) => {
  const { name, industryId } = req.body;

  try {
    const company = await prisma.company.create({
      data: {
        name: name, // Use the dynamic name from the request
        industryId: parseInt(industryId, 10) // Convert the industryId to an integer (base 10)
      }
    });
    res.status(201).json(company);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//PUT /api/companies/:id -> only admins
router.put("/:id", isLoggedIn, isAdmin, async (req, res) => {
  const { name, industryId } = req.body;
  console.log("Updating company ID:", req.params.id);
  try {
    const updated = await prisma.company.update({
      where: {
        id: parseInt(req.params.id, 10),
      },
      data: {
        name: name,
        industryId: parseInt(industryId, 10)
      }
    });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//DELETE /api/companies/:id -> only admins
router.delete("/:id", isLoggedIn, isAdmin, async (req, res) => {
  try {
    await prisma.company.delete({ where: { id: req.params.id } });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;