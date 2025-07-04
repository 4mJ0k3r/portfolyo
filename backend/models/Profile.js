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
