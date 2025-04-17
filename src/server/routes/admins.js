const express = require("express");
const router = express.Router();
const prisma = require("../db/client");

router.get("/", async (req, res) => {
  try {
    const admins = await prisma.admin.findMany();
    res.json(admins);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
