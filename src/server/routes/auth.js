const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { PrismaClient, Role } = require("@prisma/client");

const prisma = new PrismaClient();

//register new user
router.post("/register", async (req, res) => {
  try {
    const { name, email, password, role = "CANDIDATE" } = req.body;

    const allowedRoles = ["CANDIDATE", "HIRING_MANAGER", "ADMIN"];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({ error: "Invalid role provided." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: Role[role],
      },
    });

    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//login user
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ token, Role });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
