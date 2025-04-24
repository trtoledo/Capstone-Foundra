const express = require("express");
const router = express.Router();
const prisma = require("../db/client");
const { isLoggedIn, isAdmin } = require("../middleware/auth");

//view all reports (admin only)
router.get("/", isLoggedIn, isAdmin, async (req, res) => {
  try {
    const reports = await prisma.report.findMany();
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//view own reports
router.get("/mine", isLoggedIn, async (req, res) => {
  try {
    const myReports = await prisma.report.findMany({
      where: { userId: req.user.userId }
    });
    res.json(myReports);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//submit report
router.post("/", isLoggedIn, async (req, res) => {
  const { reason, companyId } = req.body;
  const userId = req.user.userId;
  try {
    const report = await prisma.report.create({
      data: { reason, userId, companyId },
    });
    res.status(201).json(report);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//delete report (owner or admin only)
router.delete("/:id", isLoggedIn, async (req, res) => {
  try {
    const report = await prisma.report.findUnique({
      where: { id: req.params.id }
    });

    if (!report) return res.status(404).json({ error: "Report not found" });

    const isOwner = report.userId === req.user.userId;
    const isAdminUser = req.user.role === "ADMIN";

    if (!isOwner && !isAdminUser) {
      return res.status(403).json({ error: "Access denied" });
    }

    await prisma.report.delete({ where: { id: req.params.id } });
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

