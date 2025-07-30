const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const {
  getCurrentUserProfile,
  createOrUpdateProfile,
  getProfileByUsername,
  fetchPlatformsForProfile,
  runSkillExtractor,
  clearSocialFields
} = require("../controllers/profileController");

// @route   GET /api/profile/me
// @desc    Get logged-in user's profile
// @access  Private
router.get("/me", protect, getCurrentUserProfile);

// @route   PUT /api/profile
// @desc    Create or update user profile
// @access  Private
router.put("/", protect, createOrUpdateProfile);

// @route   POST /api/profile/create
// @desc    Manually create profile (if auto-creation failed)
// @access  Private
router.post("/create", protect, createOrUpdateProfile);

// @route   GET /api/profile/:username
// @desc    Get public profile by username
// @access  Public
router.get("/:username", getProfileByUsername);

// @route   POST /api/profile/:username/fetchPlatforms
// @desc    Fetch and sync platform statistics for profile
// @access  Private
router.post("/:username/fetchPlatforms", protect, fetchPlatformsForProfile);

// @route   POST /api/profile/:username/runSkillExtractor
// @desc    Run AI-powered skill extraction and ranking
// @access  Public (temporarily for testing)
router.post("/:username/runSkillExtractor", runSkillExtractor);

// @route   POST /api/profile/clear-social
// @desc    Clear Twitter and LinkedIn fields (for testing)
// @access  Private
router.post("/clear-social", protect, clearSocialFields);

module.exports = router;