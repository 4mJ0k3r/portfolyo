// Load environment variables first
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/auth');
const profileRoutes = require('./routes/profile');

// Create Express app
const app = express();

// Connect to database
connectDB();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path} - ${new Date().toISOString()}`);
  next();
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'PortFolyo Backend Server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Welcome endpoint
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to PortFolyo API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      profile: '/api/profile',
      health: '/api/health'
    }
  });
});

// Handle undefined routes
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
});

// Global error handling middleware
app.use((error, req, res, next) => {
  console.error('Global error handler:', error);
  
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Server Error',
    error: process.env.NODE_ENV === 'development' ? error.stack : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});
