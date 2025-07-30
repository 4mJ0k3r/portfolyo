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

    // Calculate and update completeness before returning
    profile.calculateCompleteness();
    
    // Calculate radar chart values if missing or outdated
    if (!profile.radarAxes || !profile.radarMeta || !profile.radarMeta.lastComputed) {
      profile.calculateRadarChart();
    }
    
    await profile.save();

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
    console.log('🔄 Profile operation started');
    console.log('👤 User ID:', req.user.userId);
    console.log('📝 Request body keys:', Object.keys(req.body));
    console.log('📊 Request body size:', JSON.stringify(req.body).length, 'characters');
    
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

    console.log('🔧 Profile fields prepared:', Object.keys(profileFields));

    // Check if profile already exists
    let profile = await Profile.findOne({ user: req.user.userId });
    console.log('📋 Existing profile:', profile ? `Found (ID: ${profile._id})` : 'Not found');

    if (profile) {
      // Update existing profile
      console.log('🔄 Updating existing profile...');
      profile = await Profile.findOneAndUpdate(
        { user: req.user.userId },
        { $set: profileFields },
        { new: true, runValidators: true }
      ).populate("user", ["name", "email", "accountType"]);

      // Calculate radar chart values if missing or outdated
      if (!profile.radarAxes || !profile.radarMeta || !profile.radarMeta.lastComputed) {
        profile.calculateRadarChart();
        await profile.save();
      }

      console.log('✅ Profile updated successfully:', profile._id);
      return res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        profile
      });
    }

    // Create new profile
    console.log('🆕 Creating new profile...');
    profile = new Profile(profileFields);
    await profile.save();
    
    // Calculate radar chart values for new profile
    profile.calculateRadarChart();
    await profile.save();
    
    // Populate user data
    await profile.populate("user", ["name", "email", "accountType"]);

    console.log('✅ Profile created successfully:', profile._id);
    res.status(201).json({
      success: true,
      message: "Profile created successfully",
      profile
    });

  } catch (error) {
    console.error("❌ Create/Update profile error:", error);

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      console.error("❌ Validation errors:", errors);
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

    // Debug: Log AI fields from database
    console.log(`🧠 AI fields in database:`, {
      primaryExpertise: profile.primaryExpertise,
      hireableScore: profile.hireableScore,
      subScores: profile.subScores,
      narrativeSummary: profile.narrativeSummary,
      aiAnalysis: profile.aiAnalysis
    });

    // Calculate and update completeness before returning
    profile.calculateCompleteness();
    
    // Calculate radar chart values if missing or outdated
    if (!profile.radarAxes || !profile.radarMeta || !profile.radarMeta.lastComputed) {
      profile.calculateRadarChart();
    }
    
    await profile.save();

    console.log(`✅ Returning public profile for: ${user.username}`);

    // Return public profile data (excluding sensitive information)
    const publicProfile = {
      _id: profile._id,
      user: profile.user,
      bio: profile.bio,
      headline: profile.headline,
      location: profile.location,
      phone: profile.phone,
      portfolioWebsite: profile.portfolioWebsite,
      expectedSalary: profile.expectedSalary,
      jobSeekingStatus: profile.jobSeekingStatus,
      skills: profile.skills,
      experience: profile.experience,
      education: profile.education,
      projects: profile.projects,
      githubUsername: profile.githubUsername,
      codeforcesUsername: profile.codeforcesUsername,
      leetcodeUsername: profile.leetcodeUsername,
      socialHandles: profile.socialHandles,
      verification: profile.verification,
      rank: profile.rank,
      achievements: profile.achievements,
      profileViews: profile.profileViews,
      platformStats: profile.platformStats,
      isPublic: profile.isPublic,
      completeness: profile.completeness,
      createdAt: profile.createdAt,
      updatedAt: profile.updatedAt,
      // AI-generated fields (Phase 4)
      primaryExpertise: profile.primaryExpertise,
      hireableScore: profile.hireableScore,
      subScores: profile.subScores,
      scoreJustifications: profile.scoreJustifications,
      narrativeSummary: profile.narrativeSummary,
      aiAnalysis: profile.aiAnalysis,
      // Radar chart fields
      radarAxes: profile.radarAxes,
      radarMeta: profile.radarMeta,
      // Supporting metrics for radar chart
      projectMetrics: profile.projectMetrics,
      writing: profile.writing,
      social: profile.social,
      verifiedSkillsCount: profile.verifiedSkillsCount,
      documentsScore: profile.documentsScore
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

// @desc    Run AI-powered skill extraction and ranking
// @route   POST /api/profile/:username/runSkillExtractor
// @access  Private
exports.runSkillExtractor = async (req, res) => {
  try {
    const { username } = req.params;

    console.log(`🤖 Starting AI skill extraction for username: ${username}`);

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

    // Check if the logged-in user owns this profile (skip if no authentication)
    if (req.user && profile.user._id.toString() !== req.user.userId.toString()) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only run AI analysis on your own profile"
      });
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "AI analysis is not configured. Please contact administrator."
      });
    }

    // Import and run the SkillExtractor
    const { runSkillExtractor } = require("../services/skillExtractor");
    
    console.log(`🚀 Running AI analysis for profile: ${profile.user.name}`);
    
    // Run the AI analysis
    const aiAnalysis = await runSkillExtractor(profile);

    // Debug: Log the AI analysis data before saving
    console.log(`🔍 AI Analysis data to save:`, {
      primaryExpertise: aiAnalysis.primaryExpertise,
      hireableScore: aiAnalysis.hireableScore,
      subScores: aiAnalysis.subScores,
      scoreJustifications: aiAnalysis.scoreJustifications,
      narrativeSummary: aiAnalysis.narrativeSummary,
      aiAnalysis: aiAnalysis.aiAnalysis
    });

    // Update the profile with AI analysis results
    const updatedProfile = await Profile.findByIdAndUpdate(
      profile._id,
      { 
        $set: {
          primaryExpertise: aiAnalysis.primaryExpertise,
          hireableScore: aiAnalysis.hireableScore,
          subScores: aiAnalysis.subScores,
          scoreJustifications: aiAnalysis.scoreJustifications,
          narrativeSummary: aiAnalysis.narrativeSummary,
          aiAnalysis: aiAnalysis.aiAnalysis,
          radarAxes: aiAnalysis.radarAxes,
          radarMeta: aiAnalysis.radarMeta,
          lastUpdated: new Date()
        }
      },
      { new: true, runValidators: true }
    ).populate("user", ["name", "username", "email", "accountType"]);

    // Debug: Log the updated profile to verify AI fields were saved
    console.log(`🔍 Updated profile AI fields:`, {
      primaryExpertise: updatedProfile.primaryExpertise,
      hireableScore: updatedProfile.hireableScore,
      subScores: updatedProfile.subScores,
      narrativeSummary: updatedProfile.narrativeSummary
    });

    // Log the results
    console.log(`✅ AI analysis completed for ${profile.user.name}:`);
    console.log(`   Primary Expertise: ${aiAnalysis.primaryExpertise}`);
    console.log(`   Hireable Score: ${aiAnalysis.hireableScore}/100`);
    console.log(`   Code Activity: ${aiAnalysis.subScores.codeActivityScore}/5`);
    console.log(`   Writing Quality: ${aiAnalysis.subScores.writingScore}/5`);
    console.log(`   Social Fit: ${aiAnalysis.subScores.socialFitScore}/5`);

    res.status(200).json({
      success: true,
      message: "AI skill extraction completed successfully",
      profile: updatedProfile,
      aiAnalysis: {
        primaryExpertise: aiAnalysis.primaryExpertise,
        hireableScore: aiAnalysis.hireableScore,
        subScores: aiAnalysis.subScores,
        scoreJustifications: aiAnalysis.scoreJustifications,
        narrativeSummary: aiAnalysis.narrativeSummary,
        dataSourcesUsed: aiAnalysis.aiAnalysis.dataSourcesUsed,
        lastAnalyzed: aiAnalysis.aiAnalysis.lastAnalyzed
      }
    });

  } catch (error) {
    console.error("AI skill extraction error:", error);
    
    // Handle specific error types
    let errorMessage = "Server error during AI analysis";
    let statusCode = 500;
    
    if (error.message.includes('OpenAI')) {
      errorMessage = "AI service temporarily unavailable. Please try again later.";
      statusCode = 503;
    } else if (error.message.includes('rate limit')) {
      errorMessage = "AI analysis rate limit exceeded. Please try again in a few minutes.";
      statusCode = 429;
    } else if (error.message.includes('Skill extraction failed')) {
      errorMessage = error.message;
      statusCode = 400;
    }

    res.status(statusCode).json({
      success: false,
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Clear Twitter and LinkedIn fields (for testing)
// @route   POST /api/profile/clear-social
// @access  Private
exports.clearSocialFields = async (req, res) => {
  try {
    console.log(`🧹 Clearing social fields for user: ${req.user.userId}`);

    // Find and update the profile to remove Twitter and LinkedIn fields
    const updatedProfile = await Profile.findOneAndUpdate(
      { user: req.user.userId },
      { 
        $unset: { 
          twitterHandle: "",
          linkedinUrl: ""
        },
        $set: {
          lastUpdated: new Date()
        }
      },
      { new: true, runValidators: true }
    ).populate("user", ["name", "username", "email", "accountType"]);

    if (!updatedProfile) {
      return res.status(404).json({
        success: false,
        message: "Profile not found"
      });
    }

    console.log(`✅ Social fields cleared for ${updatedProfile.user.name}`);

    res.status(200).json({
      success: true,
      message: "Twitter and LinkedIn fields cleared successfully",
      profile: updatedProfile
    });

  } catch (error) {
    console.error("Clear social fields error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while clearing social fields",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};