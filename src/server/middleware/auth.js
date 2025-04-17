const jwt = require("jsonwebtoken");
const prisma = require("../db/client");

//middleware: anyone who is logged in
const isLoggedIn = async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid token" });
  }
};

//middleware: admins only
const isAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return res.status(403).json({ error: "Admin access required" });
  }
  next();
};

//middleware: hiring managers only
const isHiringManager = (req, res, next) => {
  if (req.user.role !== "HIRING_MANAGER") {
    return res.status(403).json({ error: "Hiring Manager access required" });
  }
  next();
};

//middleware: owner or admin
//for routes where users are only allowed to access or modify their own data unless they are an admin
const isOwnerOrAdmin = (req, res, next) => {
  if (req.user.role === "ADMIN" || req.user.userId === req.params.id) {
    return next();
  }
  return res.status(403).json({ error: "Access denied" });
};

module.exports = {
  isLoggedIn,
  isAdmin,
  isHiringManager,
  isOwnerOrAdmin,
};
