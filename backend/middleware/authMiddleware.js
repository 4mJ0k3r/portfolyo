const jwt = require("jsonwebtoken");
const User = require("../models/User");

// @desc    Protect routes - verify JWT token
const protect = async (req, res, next) => {
  let token;

  try {
    // Check if token exists in Authorization header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      // Extract token from "Bearer TOKEN"
      token = req.headers.authorization.split(' ')[1];
    }
    // Alternative: Check if token exists in cookies (for web apps)
    else if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    // If no token found
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. No token provided."
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user by ID from token payload
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Token is valid but user no longer exists"
      });
    }

    // Check if user account is active
    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: "User account has been deactivated"
      });
    }

    // Add user to request object for use in protected routes
    req.user = {
      userId: user._id,
      name: user.name,
      email: user.email,
      accountType: user.accountType,
      role: user.role,
      subscriptionTier: user.subscriptionTier
    };

    next();

  } catch (error) {
    console.error("Auth middleware error:", error);

    // Handle specific JWT errors
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: "Invalid token"
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: "Token has expired"
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error in authentication",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Authorize specific roles (developer, recruiter)
const authorize = (...roles) => {
  return (req, res, next) => {
    // Check if user role is included in allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. Required role: ${roles.join(' or ')}. Your role: ${req.user.role}`
      });
    }
    next();
  };
};

// @desc    Authorize premium features (pro subscriptions)
const requirePremium = () => {
  return (req, res, next) => {
    // Check if user has premium subscription
    if (!req.user.subscriptionTier.includes('pro')) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Premium subscription required.",
        upgradeRequired: true,
        currentPlan: req.user.accountType
      });
    }
    next();
  };
};

// @desc    Optional auth - doesn't fail if no token, but adds user if token exists
const optionalAuth = async (req, res, next) => {
  let token;

  try {
    // Check for token
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.jwt) {
      token = req.cookies.jwt;
    }

    // If no token, continue without user
    if (!token) {
      req.user = null;
      return next();
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    // If user exists and is active, add to request
    if (user && user.isActive) {
      req.user = {
        userId: user._id,
        name: user.name,
        email: user.email,
        accountType: user.accountType,
        role: user.role,
        subscriptionTier: user.subscriptionTier
      };
    } else {
      req.user = null;
    }

    next();

  } catch (error) {
    // If token is invalid, continue without user (don't throw error)
    req.user = null;
    next();
  }
};

// @desc    Rate limiting middleware (basic implementation)
const rateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const requests = new Map();

  return (req, res, next) => {
    const identifier = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    const windowStart = now - windowMs;

    // Clean old entries
    if (requests.has(identifier)) {
      const userRequests = requests.get(identifier).filter(time => time > windowStart);
      requests.set(identifier, userRequests);
    }

    // Check rate limit
    const userRequests = requests.get(identifier) || [];
    
    if (userRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: "Too many requests. Please try again later.",
        retryAfter: Math.ceil((userRequests[0] + windowMs - now) / 1000)
      });
    }

    // Add current request
    userRequests.push(now);
    requests.set(identifier, userRequests);

    next();
  };
};

module.exports = {
  protect,
  authorize,
  requirePremium,
  optionalAuth,
  rateLimit
};
