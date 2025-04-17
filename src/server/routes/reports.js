const express = require("express");
const router = express.Router();
const prisma = require("../db/client");
const { isLoggedIn, isAdmin } = require("../middleware/auth");

//view all reports (only admin)
router.get("/", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const reports = await prisma.report.findMany();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//submit report (anyone who has account and is logged in)
router.post("/", isLoggedIn, async (req, res) => {
  const { reason, userId, companyId } = req.body;
  try {
    const report = await prisma.report.create({
      data: { reason, userId, companyId },
    });
    res.status(201).json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//delete report (only admins)
router.delete("/:id", isLoggedIn, isAdmin, async (req, res) => {
  try {
    await prisma.report.delete({ where: { id: req.params.id } });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
