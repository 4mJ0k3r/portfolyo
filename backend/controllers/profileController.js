const Profile = require("../models/Profile");

// @desc    Get current user's profile
// @route   GET /api/profile/me
// @access  Private
exports.getCurrentUserProfile = async (req, res) => {
  try {
    // Find profile by user ID from auth middleware
    const profile = await Profile.findOne({ user: req.user.userId })
      .populate("user", ["name", "email", "accountType"]);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }

    res.status(200).json({
      success: true,
      profile
    });

  } catch (error) {
    console.error("Get current user profile error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Create or update user profile
// @route   PUT /api/profile
// @access  Private
exports.createOrUpdateProfile = async (req, res) => {
  try {
    // Build profile fields object
    const profileFields = {
      user: req.user.userId,
      ...req.body
    };

    // Remove any undefined fields
    Object.keys(profileFields).forEach(key => {
      if (profileFields[key] === undefined) {
        delete profileFields[key];
      }
    });

    // Check if profile already exists
    let profile = await Profile.findOne({ user: req.user.userId });

    if (profile) {
      // Update existing profile
      profile = await Profile.findOneAndUpdate(
        { user: req.user.userId },
        { $set: profileFields },
        { new: true, runValidators: true }
      ).populate("user", ["name", "email", "accountType"]);

      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        profile
      });
    }

    // Create new profile
    profile = new Profile(profileFields);
    await profile.save();
    
    // Populate user data
    await profile.populate("user", ["name", "email", "accountType"]);

    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      profile
    });

  } catch (error) {
    console.error("Create/Update profile error:", error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Get public profile by GitHub username
// @route   GET /api/profile/:username
// @access  Public
exports.getProfileByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    // Validate username parameter
    if (!username || username.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Username parameter is required"
      });
    }

    // Find profile by GitHub username
    const profile = await Profile.findOne({ 
      githubUsername: username.toLowerCase().trim() 
    }).populate("user", ["name", "accountType"]);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }

    // Return public profile data (excluding sensitive information)
    const publicProfile = {
      _id: profile._id,
      user: profile.user,
      basicInfo: profile.basicInfo,
      skills: profile.skills,
      experience: profile.experience,
      projects: profile.projects,
      githubUsername: profile.githubUsername,
      socialHandles: profile.socialHandles,
      verificationStatus: profile.verificationStatus,
      rank: profile.rank,
      achievements: profile.achievements,
      profileViews: profile.profileViews,
      isPublic: profile.isPublic,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt
    };

    // Increment profile views (optional - for analytics)
    await Profile.findByIdAndUpdate(profile._id, {
      $inc: { profileViews: 1 }
    });

    res.status(200).json({
      success: true,
      profile: publicProfile
    });

  } catch (error) {
    console.error("Get profile by username error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};