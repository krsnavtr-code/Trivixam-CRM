const express = require("express");
const router = express.Router();

// Import route files
const auth = require("./auth");
const userRoles = require("./userRoles");

// Mount routes
router.use("/auth", auth);
router.use("/roles", userRoles);

// Health check
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API is healthy",
  });
});

module.exports = router;
