const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      maxlength: [50, 'Name cannot exceed 50 characters']
    },
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, 'Username must be at least 3 characters'],
      maxlength: [30, 'Username cannot exceed 30 characters'],
      match: [
        /^[a-zA-Z0-9_-]+$/,
        'Username can only contain letters, numbers, underscores, and hyphens'
      ]
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please enter a valid email'
      ]
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters']
    },
    accountType: {
      type: String,
      enum: {
        values: ["developer_free", "developer_pro", "recruiter_basic", "recruiter_pro"],
        message: 'Account type must be developer_free, developer_pro, recruiter_basic, or recruiter_pro'
      },
      default: "developer_free"
    },
    isActive: {
      type: Boolean,
      default: true
    },
    lastLogin: {
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

// Pre-save hook to hash password
userSchema.pre("save", async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified("password")) return next();
  
  try {
    // Hash password with cost of 12
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Post-save middleware for logging and analytics
userSchema.post('save', function(doc, next) {
  // Log user registration/update
  if (this.isNew) {
    console.log(`✅ New user registered: ${doc.email} (${doc.accountType})`);
  } else {
    console.log(`📝 User updated: ${doc.email}`);
  }
  next();
});

// Post-save middleware for creating default profile
userSchema.post('save', async function(doc, next) {
  // Only create profile for new users who are developers
  if (this.isNew && doc.isDeveloper()) {
    try {
      // Use dynamic import to avoid circular dependency issues
      const Profile = mongoose.model('Profile');
      
      console.log(`🔄 Attempting to create profile for new user: ${doc.email}`);
      
      // Check if profile already exists
      const existingProfile = await Profile.findOne({ user: doc._id });
      
      if (!existingProfile) {
        const newProfile = await Profile.create({
          user: doc._id,
          bio: `Welcome to PortFolyo! I'm ${doc.name}, a ${doc.accountType.replace('_', ' ')} looking for exciting opportunities.`,
          headline: `${doc.accountType.includes('pro') ? 'Professional' : 'Aspiring'} Developer`,
          jobSeekingStatus: 'actively_looking',
          workPreference: 'remote',
          availability: 'Immediately',
          yearsOfExperience: 0,
          skills: [],
          experience: [],
          projects: [],
          education: []
        });
        console.log(`🎯 Default profile created successfully for: ${doc.email} (Profile ID: ${newProfile._id})`);
      } else {
        console.log(`📋 Profile already exists for: ${doc.email}`);
      }
    } catch (error) {
      console.error(`❌ Error creating profile for ${doc.email}:`, error);
      console.error(`Error details:`, error.stack);
    }
  }
  next();
});

// Instance method to compare password
userSchema.methods.comparePassword = async function (plaintextPassword) {
  try {
    return await bcrypt.compare(plaintextPassword, this.password);
  } catch (error) {
    throw new Error('Password comparison failed');
  }
};

// Instance method to check if user is developer
userSchema.methods.isDeveloper = function () {
  return this.accountType.includes('developer');
};

// Instance method to check if user is recruiter
userSchema.methods.isRecruiter = function () {
  return this.accountType.includes('recruiter');
};

// Instance method to check if user has premium features
userSchema.methods.hasPremiumFeatures = function () {
  return this.accountType.includes('pro');
};

// Virtual for user role
userSchema.virtual('role').get(function () {
  return this.accountType ? this.accountType.split('_')[0] : 'developer'; // 'developer' or 'recruiter'
});

// Virtual for subscription tier
userSchema.virtual('subscriptionTier').get(function () {
  return this.accountType ? this.accountType.split('_')[1] : 'free'; // 'free', 'pro', 'basic'
});

// Remove password from JSON output
userSchema.methods.toJSON = function () {
  const userObject = this.toObject();
  delete userObject.password;
  delete userObject.__v;
  return userObject;
};

// Static method to find user by email
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Static method to find user by username
userSchema.statics.findByUsername = function (username) {
  return this.findOne({ username: username.toLowerCase() });
};

// Index for email (for faster queries)
userSchema.index({ email: 1 });

// Index for username (for faster queries)
userSchema.index({ username: 1 });

module.exports = mongoose.model("User", userSchema);
