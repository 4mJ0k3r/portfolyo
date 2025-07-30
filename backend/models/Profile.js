const mongoose = require("mongoose");

// Skill schema for developer skills with proficiency levels
const skillSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'Skill name is required'],
    trim: true
  },
  proficiency: { 
    type: Number, 
    required: [true, 'Skill proficiency is required'],
    min: [1, 'Proficiency must be between 1 and 5'],
    max: [5, 'Proficiency must be between 1 and 5']
  },
  verified: { 
    type: Boolean, 
    default: false 
  },
  yearsOfExperience: {
    type: Number,
    default: 0,
    min: 0
  },
  category: {
    type: String,
    enum: ['Frontend', 'Backend', 'Database', 'DevOps', 'Mobile', 'Tools', 'Other'],
    default: 'Other'
  }
});

// Experience schema for work experience
const experienceSchema = new mongoose.Schema({
  company: { 
    type: String, 
    required: [true, 'Company name is required'],
    trim: true
  },
  role: { 
    type: String, 
    required: [true, 'Role is required'],
    trim: true
  },
  from: { 
    type: Date, 
    required: [true, 'Start date is required']
  },
  to: { 
    type: Date, 
    default: null 
  },
  current: {
    type: Boolean,
    default: false
  },
  achievements: { 
    type: String,
    trim: true 
  },
  location: {
    type: String,
    trim: true
  },
  workType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Freelance', 'Internship'],
    default: 'Full-time'
  }
}, {
  timestamps: true
});

// Project schema for portfolio projects
const projectSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: [true, 'Project title is required'],
    trim: true
  },
  description: { 
    type: String,
    required: [true, 'Project description is required'],
    trim: true
  },
  techStack: [{ 
    type: String,
    trim: true
  }],
  githubLink: { 
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/(www\.)?github\.com\/.+/.test(v);
      },
      message: 'Invalid GitHub URL format'
    }
  },
  liveLink: { 
    type: String,
    trim: true,
    validate: {
      validator: function(v) {
        return !v || /^https?:\/\/.+/.test(v);
      },
      message: 'Invalid URL format'
    }
  },
  images: [{
    type: String,
    trim: true
  }],
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['Completed', 'In Progress', 'Planned'],
    default: 'Completed'
  }
}, {
  timestamps: true
});

// Education schema
const educationSchema = new mongoose.Schema({
  institution: {
    type: String,
    required: [true, 'Institution name is required'],
    trim: true
  },
  degree: {
    type: String,
    required: [true, 'Degree is required'],
    trim: true
  },
  field: {
    type: String,
    trim: true
  },
  from: {
    type: Date,
    required: [true, 'Start date is required']
  },
  to: {
    type: Date
  },
  current: {
    type: Boolean,
    default: false
  },
  grade: {
    type: String,
    trim: true
  }
});

// Main profile schema
const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },
    // Contact Information
    phone: { 
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          return !v || /^\+?[\d\s\-\(\)]+$/.test(v);
        },
        message: 'Invalid phone number format'
      }
    },
    location: { 
      type: String,
      trim: true
    },
    
    // Social Links
    githubUsername: { 
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          return !v || /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i.test(v);
        },
        message: 'Invalid GitHub username format'
      }
    },
    linkedinUrl: { 
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          return !v || /^https?:\/\/(www\.)?linkedin\.com\/in\/.+/.test(v);
        },
        message: 'Invalid LinkedIn URL format'
      }
    },
    twitterHandle: { 
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          return !v || /^@?[a-zA-Z0-9_]{1,15}$/.test(v);
        },
        message: 'Invalid Twitter handle format'
      }
    },
    portfolioWebsite: {
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          return !v || /^https?:\/\/.+/.test(v);
        },
        message: 'Invalid website URL format'
      }
    },
    
    // Coding Platforms
    codeforcesUsername: { 
      type: String,
      trim: true
    },
    leetcodeUsername: { 
      type: String,
      trim: true
    },
    stackoverflowId: { 
      type: String,
      trim: true
    },
    hackerrankUsername: {
      type: String,
      trim: true
    },
    
    // Repository URLs for AI analysis
    topRepoUrls: [{
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          return !v || /^https?:\/\/(www\.)?github\.com\/.+\/.+/.test(v);
        },
        message: 'Invalid GitHub repository URL format'
      }
    }],
    
    // Article URLs for AI analysis
    articleUrls: [{
      type: String,
      trim: true,
      validate: {
        validator: function(v) {
          return !v || /^https?:\/\/.+/.test(v);
        },
        message: 'Invalid article URL format'
      }
    }],
    
    // Job Preferences
    jobSeekingStatus: {
      type: String,
      enum: {
        values: ["actively_looking", "open_to_opps", "not_looking"],
        message: 'Job seeking status must be actively_looking, open_to_opps, or not_looking'
      },
      default: "actively_looking"
    },
    preferredRoles: [{ 
      type: String,
      trim: true
    }],
    expectedSalary: { 
      type: String,
      trim: true
    },
    workPreference: {
      type: String,
      enum: {
        values: ["remote", "hybrid", "onsite", "flexible"],
        message: 'Work preference must be remote, hybrid, onsite, or flexible'
      },
      default: "remote"
    },
    availability: {
      type: String,
      enum: ['Immediately', '2 weeks', '1 month', '2+ months'],
      default: 'Immediately'
    },
    
    // Professional Information
    bio: {
      type: String,
      trim: true,
      maxlength: [500, 'Bio cannot exceed 500 characters']
    },
    headline: {
      type: String,
      trim: true,
      maxlength: [100, 'Headline cannot exceed 100 characters']
    },
    yearsOfExperience: {
      type: Number,
      default: 0,
      min: 0
    },
    
    // Arrays of embedded documents
    skills: [skillSchema],
    experience: [experienceSchema],
    projects: [projectSchema],
    education: [educationSchema],
    
    // Verification and ranking
    verification: {
      skillTestsPassed: { 
        type: Number, 
        default: 0,
        min: 0
      },
      videoVerified: { 
        type: Boolean, 
        default: false 
      },
      documentsVerified: { 
        type: Boolean, 
        default: false 
      },
      githubVerified: {
        type: Boolean,
        default: false
      },
      emailVerified: {
        type: Boolean,
        default: false
      },
      phoneVerified: {
        type: Boolean,
        default: false
      }
    },
    
    // AI-generated ranking
    rank: { 
      type: Number, 
      default: 0,
      min: 0,
      max: 100
    },
    
    // Profile completeness
    completeness: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    
    // Profile visibility
    isPublic: {
      type: Boolean,
      default: true
    },
    
    // Profile views and analytics
    profileViews: {
      type: Number,
      default: 0
    },
    
    // Platform Statistics (Phase 3)
    platformStats: {
      github: {
        totalRepos: { type: Number, default: 0 },
        totalStars: { type: Number, default: 0 },
        languages: { type: Map, of: Number, default: {} },
        commitCount90d: { type: Number, default: 0 },
        activeWeeks90d: { type: Number, default: 0 },
        lastFetched: { type: Date, default: null }
      },
      codeforces: {
        rating: { type: Number, default: 0 },
        maxRating: { type: Number, default: 0 },
        lastFetched: { type: Date, default: null }
      },
      leetcode: {
        easySolved: { type: Number, default: 0 },
        mediumSolved: { type: Number, default: 0 },
        hardSolved: { type: Number, default: 0 },
        totalSolved: { type: Number, default: 0 },
        lastFetched: { type: Date, default: null }
      }
    },
    
    // AI-Powered Skill Extraction & Ranking (Phase 4)
    primaryExpertise: { 
      type: String, 
      default: "" 
    },
    
    hireableScore: { 
      type: Number, 
      default: 0,
      min: 0,
      max: 100
    },
    
    subScores: {
      codeActivityScore: { type: Number, default: 0, min: 0, max: 5 },
      writingScore: { type: Number, default: 0, min: 0, max: 5 },
      socialFitScore: { type: Number, default: 0, min: 0, max: 5 }
    },
    
    scoreJustifications: {
      codeActivity: [{ type: String }],
      writing: [{ type: String }],
      socialFit: [{ type: String }]
    },
    
    narrativeSummary: { 
      type: String, 
      default: "" 
    },
    
    // AI Analysis metadata
    aiAnalysis: {
      lastAnalyzed: { type: Date, default: null },
      dataSourcesUsed: [{
        type: String,
        enum: ['github', 'codeforces', 'leetcode', 'linkedin', 'twitter', 'articles']
      }],
      analysisVersion: { type: String, default: "1.0" }
    },
    
    // Project Metrics for Radar Chart
    projectMetrics: {
      featuredStars: { type: Number, default: 0 },
      readmeCoverage: { type: Number, default: 0, min: 0, max: 100 },
      recencyMonthsMedian: { type: Number, default: null }
    },
    
    // Writing Metrics for Radar Chart
    writing: {
      readmeQualityScore: { type: Number, default: 0, min: 0, max: 100 },
      blogReadability: { type: Number, default: 0, min: 0, max: 100 },
      articlesLast90d: { type: Number, default: 0 }
    },
    
    // Social Metrics for Radar Chart
    social: {
      githubFollowers: { type: Number, default: 0 },
      twitterFollowers: { type: Number, default: 0 },
      linkedInPresent: { type: Boolean, default: false }
    },
    
    // Additional Metrics for Radar Chart
    verifiedSkillsCount: { type: Number, default: 0 },
    documentsScore: { type: Number, default: 0, min: 0, max: 100 },
    
    // Radar Chart Data
    radarAxes: {
      codeActivity: { type: Number, default: 0, min: 0, max: 100 },
      problemSolving: { type: Number, default: 0, min: 0, max: 100 },
      projectImpact: { type: Number, default: 0, min: 0, max: 100 },
      writingDocumentation: { type: Number, default: 0, min: 0, max: 100 },
      socialCommunity: { type: Number, default: 0, min: 0, max: 100 },
      verificationTrust: { type: Number, default: 0, min: 0, max: 100 }
    },
    
    // Radar Chart Metadata
    radarMeta: {
      version: { type: String, default: "1.0" },
      lastComputed: { type: Date, default: null },
      inputsUsed: [{ type: String }],
      normalizationNotes: { type: String, default: "" },
      inferenceNotes: [{ type: String }]
    },
    
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for full GitHub URL
profileSchema.virtual('githubUrl').get(function () {
  return this.githubUsername ? `https://github.com/${this.githubUsername}` : null;
});

// Virtual for formatted Twitter handle
profileSchema.virtual('twitterUrl').get(function () {
  if (!this.twitterHandle) return null;
  const handle = this.twitterHandle.startsWith('@') ? this.twitterHandle.slice(1) : this.twitterHandle;
  return `https://twitter.com/${handle}`;
});

// Virtual for total years of experience
profileSchema.virtual('totalExperience').get(function () {
  if (!this.experience || this.experience.length === 0) return 0;
  
  let totalMonths = 0;
  this.experience.forEach(exp => {
    const startDate = new Date(exp.from);
    const endDate = exp.to ? new Date(exp.to) : new Date();
    const months = (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
                   (endDate.getMonth() - startDate.getMonth());
    totalMonths += Math.max(0, months);
  });
  
  return Math.round(totalMonths / 12 * 10) / 10; // Round to 1 decimal place
});

// Method to calculate profile completeness
profileSchema.methods.calculateCompleteness = function () {
  let score = 0;
  const maxScore = 100;
  
  // Basic info (30 points)
  if (this.bio) score += 10;
  if (this.headline) score += 5;
  if (this.phone) score += 5;
  if (this.location) score += 5;
  if (this.expectedSalary) score += 5;
  
  // Social links (20 points)
  if (this.githubUsername) score += 10;
  if (this.linkedinUrl) score += 5;
  if (this.portfolioWebsite) score += 5;
  
  // Professional data (40 points)
  if (this.skills && this.skills.length > 0) score += 15;
  if (this.experience && this.experience.length > 0) score += 15;
  if (this.projects && this.projects.length > 0) score += 10;
  
  // Verification (10 points)
  if (this.verification.emailVerified) score += 5;
  if (this.verification.githubVerified) score += 5;
  
  this.completeness = Math.min(score, maxScore);
  return this.completeness;
};

// Method to calculate radar chart values
profileSchema.methods.calculateRadarChart = function () {
  const inputsUsed = [];
  const inferenceNotes = [];
  
  // Helper function to clamp values between 0 and 100
  const clamp = (value, min = 0, max = 100) => Math.round(Math.max(min, Math.min(max, value)));
  
  // Calculate supporting metrics first
  this.verifiedSkillsCount = this.skills ? this.skills.filter(skill => skill.verified).length : 0;
  this.social.linkedInPresent = Boolean(this.linkedinUrl && this.linkedinUrl.trim());
  
  // Set default values for missing metrics
  if (!this.projectMetrics.featuredStars) {
    this.projectMetrics.featuredStars = this.projects ? this.projects.filter(p => p.featured).length : 0;
  }
  if (!this.writing.articlesLast90d) {
    this.writing.articlesLast90d = this.articleUrls ? this.articleUrls.length : 0;
  }
  if (!this.documentsScore) {
    this.documentsScore = 0;
    inferenceNotes.push("documentsScore set to 0 due to lack of evidence");
  }
  
  // 1. Code Activity (0-100)
  let codeActivity = 0;
  if (this.platformStats?.github?.totalRepos > 0) {
    codeActivity += Math.min(40, this.platformStats.github.totalRepos * 2);
    inputsUsed.push("platformStats.github.totalRepos");
  }
  if (this.platformStats?.github?.commitCount90d > 0) {
    codeActivity += Math.min(30, this.platformStats.github.commitCount90d / 2);
    inputsUsed.push("platformStats.github.commitCount90d");
  } else if (this.subScores?.codeActivityScore > 0) {
    codeActivity += this.subScores.codeActivityScore * 20;
    inputsUsed.push("subScores.codeActivityScore");
    inferenceNotes.push("Used subScores.codeActivityScore as fallback for commit activity");
  }
  if (this.verification?.githubVerified) {
    codeActivity += 20;
    inputsUsed.push("verification.githubVerified");
  }
  if (this.topRepoUrls?.length > 0) {
    codeActivity += Math.min(10, this.topRepoUrls.length * 2);
    inputsUsed.push("topRepoUrls.length");
  }
  this.radarAxes.codeActivity = clamp(codeActivity);
  
  // 2. Problem Solving (0-100)
  let problemSolving = 0;
  if (this.platformStats?.codeforces?.rating > 0) {
    problemSolving += Math.min(50, this.platformStats.codeforces.rating / 40);
    inputsUsed.push("platformStats.codeforces.rating");
  }
  if (this.platformStats?.leetcode?.totalSolved > 0) {
    problemSolving += Math.min(40, this.platformStats.leetcode.totalSolved / 25);
    inputsUsed.push("platformStats.leetcode.totalSolved");
  }
  if (this.skills?.length > 0) {
    const avgProficiency = this.skills.reduce((sum, skill) => sum + skill.proficiency, 0) / this.skills.length;
    problemSolving += avgProficiency * 10;
    inputsUsed.push("skills.proficiency");
  }
  if (problemSolving === 0 && this.projects?.length > 0) {
    problemSolving = Math.min(30, this.projects.length * 10);
    inputsUsed.push("projects.length");
    inferenceNotes.push("Used projects.length as conservative proxy for problem solving");
  }
  this.radarAxes.problemSolving = clamp(problemSolving);
  
  // 3. Project Impact (0-100)
  let projectImpact = 0;
  if (this.platformStats?.github?.totalStars > 0) {
    projectImpact += Math.min(50, this.platformStats.github.totalStars / 10);
    inputsUsed.push("platformStats.github.totalStars");
  }
  if (this.projectMetrics?.featuredStars > 0) {
    projectImpact += Math.min(30, this.projectMetrics.featuredStars * 10);
    inputsUsed.push("projectMetrics.featuredStars");
  }
  if (this.projects?.length > 0) {
    projectImpact += Math.min(20, this.projects.length * 5);
    inputsUsed.push("projects.length");
  }
  this.radarAxes.projectImpact = clamp(projectImpact);
  
  // 4. Writing & Documentation (0-100)
  let writingDocumentation = 0;
  if (this.writing?.readmeQualityScore > 0) {
    writingDocumentation += this.writing.readmeQualityScore * 0.4;
    inputsUsed.push("writing.readmeQualityScore");
  }
  if (this.writing?.articlesLast90d > 0) {
    writingDocumentation += Math.min(30, this.writing.articlesLast90d * 10);
    inputsUsed.push("writing.articlesLast90d");
  }
  if (this.subScores?.writingScore > 0) {
    writingDocumentation += this.subScores.writingScore * 20;
    inputsUsed.push("subScores.writingScore");
  }
  if (this.projectMetrics?.readmeCoverage > 0) {
    writingDocumentation += this.projectMetrics.readmeCoverage * 0.3;
    inputsUsed.push("projectMetrics.readmeCoverage");
  }
  if (writingDocumentation === 0 && this.bio) {
    writingDocumentation = 20;
    inputsUsed.push("bio");
    inferenceNotes.push("Used bio presence as minimal writing indicator");
  }
  this.radarAxes.writingDocumentation = clamp(writingDocumentation);
  
  // 5. Social & Community (0-100)
  let socialCommunity = 0;
  if (this.social?.githubFollowers > 0) {
    socialCommunity += Math.min(30, this.social.githubFollowers / 10);
    inputsUsed.push("social.githubFollowers");
  }
  if (this.social?.twitterFollowers > 0) {
    socialCommunity += Math.min(25, this.social.twitterFollowers / 100);
    inputsUsed.push("social.twitterFollowers");
  }
  if (this.social?.linkedInPresent) {
    socialCommunity += 20;
    inputsUsed.push("social.linkedInPresent");
  }
  if (this.subScores?.socialFitScore > 0) {
    socialCommunity += this.subScores.socialFitScore * 20;
    inputsUsed.push("subScores.socialFitScore");
  }
  if (this.portfolioWebsite) {
    socialCommunity += 15;
    inputsUsed.push("portfolioWebsite");
  }
  if (socialCommunity === 0) {
    socialCommunity = 10;
    inferenceNotes.push("Assigned minimal social score due to lack of social presence data");
  }
  this.radarAxes.socialCommunity = clamp(socialCommunity);
  
  // 6. Verification & Trust (0-100)
  let verificationTrust = 0;
  if (this.verification?.emailVerified) {
    verificationTrust += 20;
    inputsUsed.push("verification.emailVerified");
  }
  if (this.verification?.githubVerified) {
    verificationTrust += 25;
    inputsUsed.push("verification.githubVerified");
  }
  if (this.verification?.phoneVerified) {
    verificationTrust += 15;
    inputsUsed.push("verification.phoneVerified");
  }
  if (this.verification?.documentsVerified) {
    verificationTrust += 20;
    inputsUsed.push("verification.documentsVerified");
  }
  if (this.verifiedSkillsCount > 0) {
    verificationTrust += Math.min(20, this.verifiedSkillsCount * 5);
    inputsUsed.push("verifiedSkillsCount");
  }
  this.radarAxes.verificationTrust = clamp(verificationTrust);
  
  // Update metadata
  this.radarMeta.version = "1.0";
  this.radarMeta.lastComputed = new Date();
  this.radarMeta.inputsUsed = [...new Set(inputsUsed)];
  this.radarMeta.normalizationNotes = "Values clamped to 0-100 scale using weighted combinations of platform stats, verification status, and profile completeness.";
  this.radarMeta.inferenceNotes = inferenceNotes;
  
  return {
    radarAxes: this.radarAxes,
    radarMeta: this.radarMeta
  };
};

// Method to update last updated timestamp
profileSchema.methods.updateLastModified = function () {
  this.lastUpdated = new Date();
  return this.save();
};

// Pre-validation middleware to clean and validate data
profileSchema.pre('validate', function(next) {
  // Clean GitHub username (remove @ if present)
  if (this.githubUsername && this.githubUsername.startsWith('@')) {
    this.githubUsername = this.githubUsername.slice(1);
  }
  
  // Clean Twitter handle (ensure @ prefix)
  if (this.twitterHandle && !this.twitterHandle.startsWith('@')) {
    this.twitterHandle = '@' + this.twitterHandle;
  }
  
  // Validate skill proficiency levels
  if (this.skills && this.skills.length > 0) {
    this.skills.forEach(skill => {
      if (skill.proficiency < 1) skill.proficiency = 1;
      if (skill.proficiency > 5) skill.proficiency = 5;
    });
  }
  
  next();
});

// Pre-save hook to calculate completeness
profileSchema.pre('save', function (next) {
  this.calculateCompleteness();
  this.lastUpdated = new Date();
  next();
});

// Post-save middleware for analytics and notifications
profileSchema.post('save', function(doc, next) {
  // Log profile updates
  if (this.isNew) {
    console.log(`🎯 New profile created for user: ${doc.user}`);
  } else {
    console.log(`📊 Profile updated: ${doc.user} (${doc.completeness}% complete)`);
  }
  
  // Check for completion milestones
  if (doc.completeness >= 50 && doc.completeness < 60) {
    console.log(`🎉 Profile ${doc.user} reached 50% completion milestone!`);
  } else if (doc.completeness >= 80 && doc.completeness < 90) {
    console.log(`🚀 Profile ${doc.user} reached 80% completion milestone!`);
  } else if (doc.completeness === 100) {
    console.log(`⭐ Profile ${doc.user} is now 100% complete!`);
  }
  
  next();
});

// Indexes for better query performance
profileSchema.index({ user: 1 });
profileSchema.index({ jobSeekingStatus: 1 });
profileSchema.index({ 'skills.name': 1 });
profileSchema.index({ rank: -1 });
profileSchema.index({ completeness: -1 });
profileSchema.index({ lastUpdated: -1 });

module.exports = mongoose.model("Profile", profileSchema);
