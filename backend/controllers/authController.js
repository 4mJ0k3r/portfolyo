const User = require("../models/User");
const jwt = require("jsonwebtoken");

// Helper function to generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId }, 
    process.env.JWT_SECRET, 
    { expiresIn: "7d" }
  );
};

// Helper function to validate email format
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Helper function to validate password strength
const isValidPassword = (password) => {
  // At least 6 characters, contains letter and number
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/;
  return passwordRegex.test(password);
};

// @route   POST /api/auth/register
// @desc    Register a new user and return JWT
// @access  Public
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, accountType } = req.body;

    // 1. Validate input fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password"
      });
    }

    // Validate name length
    if (name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: "Name must be at least 2 characters long"
      });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address"
      });
    }

    // Validate password strength
    if (!isValidPassword(password)) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long and contain both letters and numbers"
      });
    }

    // Validate account type
    const validAccountTypes = ["developer_free", "developer_pro", "recruiter_basic", "recruiter_pro"];
    const userAccountType = accountType || "developer_free";
    
    if (!validAccountTypes.includes(userAccountType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid account type. Must be developer_free, developer_pro, recruiter_basic, or recruiter_pro"
      });
    }

    // 2. Check if user with email already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists"
      });
    }

    // 3. Create new user (pre-save hook will hash password)
    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password,
      accountType: userAccountType
    });

    // 4. Generate JWT token
    const token = generateToken(newUser._id);

    // 5. Return success response (password excluded via toJSON method)
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        accountType: newUser.accountType,
        role: newUser.role,
        subscriptionTier: newUser.subscriptionTier,
        createdAt: newUser.createdAt
      }
    });

  } catch (error) {
    console.error("Registration error:", error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors
      });
    }

    // Handle duplicate key error (email)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists"
      });
    }

    res.status(500).json({
      success: false,
      message: "Server error during registration",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @route   POST /api/auth/login
// @desc    Authenticate user & return JWT
// @access  Public
exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate input fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password"
      });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address"
      });
    }

    // 2. Find user by email (including password for comparison)
    const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Check if user account is active
    if (!user.isActive) {
      return res.status(400).json({
        success: false,
        message: "Account has been deactivated. Please contact support."
      });
    }

    // 3. Compare password using user method
    const isPasswordMatch = await user.comparePassword(password);
    
    if (!isPasswordMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // 4. Update last login timestamp
    user.lastLogin = new Date();
    await user.save();

    // 5. Generate JWT token
    const token = generateToken(user._id);

    // 6. Return success response
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        accountType: user.accountType,
        role: user.role,
        subscriptionTier: user.subscriptionTier,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    
    res.status(500).json({
      success: false,
      message: "Server error during login",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @route   GET /api/auth/me
// @desc    Get current user data
// @access  Private (requires JWT)
exports.getCurrentUser = async (req, res) => {
  try {
    // req.user is set by auth middleware
    const user = await User.findById(req.user.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        accountType: user.accountType,
        role: user.role,
        subscriptionTier: user.subscriptionTier,
        isActive: user.isActive,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error("Get current user error:", error);
    
    res.status(500).json({
      success: false,
      message: "Server error",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Public
exports.logoutUser = (req, res) => {
  // Since JWT is stateless, logout is handled on client side
  // But we can log the action or invalidate refresh tokens here
  res.status(200).json({
    success: true,
    message: "Logout successful. Please remove token from client storage."
  });
};
