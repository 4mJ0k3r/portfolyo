const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getCurrentUserProfile,
  createOrUpdateProfile,
  getProfileByUsername
} = require("../controllers/profileController");

// @route   GET /api/profile/me
// @desc    Get logged-in user's profile
// @access  Private
router.get("/me", protect, getCurrentUserProfile);

// @route   PUT /api/profile
// @desc    Create or update user profile
// @access  Private
router.put("/", protect, createOrUpdateProfile);

// @route   GET /api/profile/:username
// @desc    Get public profile by GitHub username
// @access  Public
router.get("/:username", getProfileByUsername);

module.exports = router;