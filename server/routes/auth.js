const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const UserRole = require("../models/UserRole");
const { protect } = require("../middleware/auth");

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

// Register user
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password, roleName } = req.body;

    const userExists = await User.findOne({ email }).populate({
      path: "role",
      select: "name displayName permissions level",
    });
    if (userExists) {
      return res.status(400).json({
        success: false,
        error: "User already exists",
      });
    }

    // Find the role by name
    let userRole;
    if (roleName) {
      userRole = await UserRole.getRoleByName(roleName);
    } else {
      // Default to TrivixamCrmChildAdmin if no role specified
      userRole = await UserRole.getRoleByName("TrivixamCrmChildAdmin");
    }

    if (!userRole) {
      return res.status(400).json({
        success: false,
        error: "Invalid role specified",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: userRole._id,
    });

    // Populate the role for the response
    await user.populate({
      path: "role",
      select: "name displayName permissions level",
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Login user
router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: "Please provide email and password",
      });
    }

    const user = await User.findOne({ email }).select("+password").populate({
      path: "role",
      select: "name displayName permissions level",
    });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        error: "Invalid credentials",
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Get current user
router.get("/me", protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "role",
      select: "name displayName permissions level",
    });
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
