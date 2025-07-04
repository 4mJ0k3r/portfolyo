const express = require("express");
const router = express.Router();
const { 
  registerUser, 
  loginUser, 
  getCurrentUser, 
  logoutUser 
} = require("../controllers/authController");
const { protect, rateLimit } = require("../middleware/authMiddleware");

// Apply rate limiting to auth routes
const authRateLimit = rateLimit(10, 15 * 60 * 1000); // 10 requests per 15 minutes

// @route   POST /api/auth/register
// @desc    Register a new user and return JWT
// @access  Public
router.post("/register", authRateLimit, registerUser);

// @route   POST /api/auth/login
// @desc    Authenticate user & return JWT
// @access  Public
router.post("/login", authRateLimit, loginUser);

// @route   GET /api/auth/me
// @desc    Get current user data
// @access  Private
router.get("/me", protect, getCurrentUser);

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Public
router.post("/logout", logoutUser);

// @route   GET /api/auth/verify-token
// @desc    Verify if token is valid (for frontend checks)
// @access  Private
router.get("/verify-token", protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Token is valid",
    user: {
      id: req.user.userId,
      name: req.user.name,
      email: req.user.email,
      accountType: req.user.accountType,
      role: req.user.role,
      subscriptionTier: req.user.subscriptionTier
    }
  });
});

// @route   POST /api/auth/get-token

// @desc    Debug endpoint to see complete token clearly
// @access  Public
router.post("/get-token", async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password"
      });
    }

    // Find user and verify password (same as login)
    const User = require("../models/User");
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Generate token
    const jwt = require("jsonwebtoken");
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    // Return token with formatting for easy copying
    res.status(200).json({
      success: true,
      message: "Token generated successfully",
      tokenInfo: {
        length: token.length,
        parts: token.split('.').length,
        header: token.split('.')[0],
        payload: token.split('.')[1],
        signature: token.split('.')[2]
      },
      COMPLETE_TOKEN: token,
      copyThisToken: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        accountType: user.accountType
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
});

module.exports = router;
