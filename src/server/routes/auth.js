const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
//prisma connection added shortly when tomas is ready

//tempo data storage
const dummyUsers = []; 

//register route
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = { id: dummyUsers.length + 1, email, password: hashedPassword };
    dummyUsers.push(newUser);

    res.status(201).json(newUser);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//oogin route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = dummyUsers.find(u => u.email === email);

    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ userId: user.id }, "supersecret", { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
