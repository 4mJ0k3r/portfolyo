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

// @desc    Get public profile by username
// @route   GET /api/profile/:username
// @access  Public
exports.getProfileByUsername = async (req, res) => {
  try {
    const { username } = req.params;

    console.log(`🔍 Looking for public profile with username: ${username}`);

    // Validate username parameter
    if (!username || username.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Username parameter is required"
      });
    }

    // First, find the user by username
    const User = require("../models/User");
    const user = await User.findByUsername(username.toLowerCase().trim());

    console.log(`👤 User found:`, user ? `${user.name} (${user.username})` : 'No user found');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Then find their profile
    const profile = await Profile.findOne({ user: user._id })
      .populate("user", ["name", "username", "accountType"]);

    console.log(`📋 Profile found:`, profile ? `Profile ID: ${profile._id}` : 'No profile found');

    if (!profile) {
      console.log(`❌ No profile exists for user: ${user.name} (${user._id})`);
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }

    console.log(`✅ Returning public profile for: ${user.username}`);

    // Return public profile data (excluding sensitive information)
    const publicProfile = {
      _id: profile._id,
      user: profile.user,
      basicInfo: profile.basicInfo,
      skills: profile.skills,
      experience: profile.experience,
      projects: profile.projects,
      githubUsername: profile.githubUsername,
      codeforcesUsername: profile.codeforcesUsername,
      leetcodeUsername: profile.leetcodeUsername,
      socialHandles: profile.socialHandles,
      verificationStatus: profile.verificationStatus,
      rank: profile.rank,
      achievements: profile.achievements,
      profileViews: profile.profileViews,
      platformStats: profile.platformStats,
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

// Helper function to fetch GitHub stats
const fetchGitHubStats = async (githubUsername) => {
  try {
    if (!githubUsername) {
      return { totalRepos: 0, totalStars: 0, languages: {}, lastFetched: null };
    }

    console.log(`🔄 Fetching GitHub stats for: ${githubUsername}`);
    
    // Fetch user repositories
    const reposResponse = await fetch(`https://api.github.com/users/${githubUsername}/repos?per_page=100&sort=updated`);
    
    if (!reposResponse.ok) {
      throw new Error(`GitHub API Error: ${reposResponse.status} ${reposResponse.statusText}`);
    }

    const repos = await reposResponse.json();
    
    let totalStars = 0;
    let languages = {};
    
    // Process each repository
    repos.forEach(repo => {
      // Accumulate stars
      totalStars += repo.stargazers_count || 0;
      
      // Count languages (if available)
      if (repo.language) {
        languages[repo.language] = (languages[repo.language] || 0) + 1;
      }
    });

    return {
      totalRepos: repos.length,
      totalStars,
      languages,
      lastFetched: new Date()
    };

  } catch (error) {
    console.error(`❌ GitHub API error for ${githubUsername}:`, error.message);
    return { totalRepos: 0, totalStars: 0, languages: {}, lastFetched: new Date() };
  }
};

// Helper function to fetch Codeforces stats
const fetchCodeforcesStats = async (codeforcesUsername) => {
  try {
    if (!codeforcesUsername) {
      return { rating: 0, maxRating: 0, lastFetched: null };
    }

    console.log(`🔄 Fetching Codeforces stats for: ${codeforcesUsername}`);
    
    const response = await fetch(`https://codeforces.com/api/user.info?handles=${codeforcesUsername}`);
    
    if (!response.ok) {
      throw new Error(`Codeforces API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.status !== 'OK' || !data.result || data.result.length === 0) {
      throw new Error('Invalid Codeforces response or user not found');
    }

    const user = data.result[0];
    
    return {
      rating: user.rating || 0,
      maxRating: user.maxRating || 0,
      lastFetched: new Date()
    };

  } catch (error) {
    console.error(`❌ Codeforces API error for ${codeforcesUsername}:`, error.message);
    return { rating: 0, maxRating: 0, lastFetched: new Date() };
  }
};

// Helper function to fetch LeetCode stats
const fetchLeetCodeStats = async (leetcodeUsername) => {
  try {
    if (!leetcodeUsername) {
      return { easySolved: 0, mediumSolved: 0, hardSolved: 0, totalSolved: 0, lastFetched: null };
    }

    console.log(`🔄 Fetching LeetCode stats for: ${leetcodeUsername}`);
    
    const query = `
      query getUserProfile($username: String!) {
        matchedUser(username: $username) {
          submitStats {
            acSubmissionNum {
              difficulty
              count
            }
          }
        }
      }
    `;

    const response = await fetch('https://leetcode.com/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'PortFolyo/1.0'
      },
      body: JSON.stringify({
        query,
        variables: { username: leetcodeUsername }
      })
    });

    if (!response.ok) {
      throw new Error(`LeetCode API Error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.data || !data.data.matchedUser) {
      throw new Error('LeetCode user not found or API response invalid');
    }

    const submissions = data.data.matchedUser.submitStats.acSubmissionNum;
    let easySolved = 0, mediumSolved = 0, hardSolved = 0;

    submissions.forEach(sub => {
      switch (sub.difficulty) {
        case 'Easy':
          easySolved = sub.count;
          break;
        case 'Medium':
          mediumSolved = sub.count;
          break;
        case 'Hard':
          hardSolved = sub.count;
          break;
      }
    });

    const totalSolved = easySolved + mediumSolved + hardSolved;

    return {
      easySolved,
      mediumSolved,
      hardSolved,
      totalSolved,
      lastFetched: new Date()
    };

  } catch (error) {
    console.error(`❌ LeetCode API error for ${leetcodeUsername}:`, error.message);
    return { easySolved: 0, mediumSolved: 0, hardSolved: 0, totalSolved: 0, lastFetched: new Date() };
  }
};

// @desc    Fetch and sync platform statistics for profile
// @route   POST /api/profile/:username/fetchPlatforms
// @access  Private
exports.fetchPlatformsForProfile = async (req, res) => {
  try {
    const { username } = req.params;

    console.log(`🚀 Starting platform sync for username: ${username}`);

    // First, find the user by username
    const User = require("../models/User");
    const user = await User.findByUsername(username.toLowerCase().trim());

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Then find their profile
    const profile = await Profile.findOne({ user: user._id }).populate("user", ["name", "username", "email"]);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }

    // Check if the logged-in user owns this profile
    if (profile.user._id.toString() !== req.user.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only sync your own profile"
      });
    }

    console.log(`🚀 Starting platform sync for profile: ${profile.user.name}`);

    // Extract platform usernames
    const { githubUsername, codeforcesUsername, leetcodeUsername } = profile;

    // Fetch stats from all platforms in parallel
    const [githubStats, codeforcesStats, leetcodeStats] = await Promise.allSettled([
      fetchGitHubStats(githubUsername),
      fetchCodeforcesStats(codeforcesUsername),
      fetchLeetCodeStats(leetcodeUsername)
    ]);

    // Build the platformStats object
    const platformStats = {
      github: githubStats.status === 'fulfilled' ? githubStats.value : {
        totalRepos: 0, totalStars: 0, languages: {}, lastFetched: new Date()
      },
      codeforces: codeforcesStats.status === 'fulfilled' ? codeforcesStats.value : {
        rating: 0, maxRating: 0, lastFetched: new Date()
      },
      leetcode: leetcodeStats.status === 'fulfilled' ? leetcodeStats.value : {
        easySolved: 0, mediumSolved: 0, hardSolved: 0, totalSolved: 0, lastFetched: new Date()
      }
    };

    // Update the profile with new platform stats
    const updatedProfile = await Profile.findByIdAndUpdate(
      profile._id,
      { 
        $set: { 
          platformStats,
          lastUpdated: new Date()
        }
      },
      { new: true, runValidators: true }
    ).populate("user", ["name", "username", "email", "accountType"]);

    // Log the results
    console.log(`✅ Platform sync completed for ${profile.user.name}:`);
    console.log(`   GitHub: ${platformStats.github.totalRepos} repos, ${platformStats.github.totalStars} stars`);
    console.log(`   Codeforces: ${platformStats.codeforces.rating} rating (max: ${platformStats.codeforces.maxRating})`);
    console.log(`   LeetCode: ${platformStats.leetcode.totalSolved} problems solved`);

    res.status(200).json({
      success: true,
      message: "Platform statistics updated successfully",
      profile: updatedProfile,
      syncResults: {
        github: githubStats.status === 'fulfilled' ? 'success' : 'failed',
        codeforces: codeforcesStats.status === 'fulfilled' ? 'success' : 'failed',
        leetcode: leetcodeStats.status === 'fulfilled' ? 'success' : 'failed'
      }
    });

  } catch (error) {
    console.error("Fetch platforms error:", error);
    res.status(500).json({
      success: false,
      message: "Server error during platform sync",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};