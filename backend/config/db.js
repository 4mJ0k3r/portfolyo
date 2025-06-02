const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Get MongoDB URI from environment variables
    const mongoURI = process.env.MONGO_URI;

    if (!mongoURI) {
      console.error('❌ Error: MONGO_URI is not defined in environment variables');
      process.exit(1);
    }

    // Connect to MongoDB (removed deprecated options)
    const conn = await mongoose.connect(mongoURI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database Name: ${conn.connection.name}`);
    
    // Handle connection events
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected');
    });

    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    
    // Exit process with failure if cannot connect to database
    process.exit(1);
  }
};

module.exports = connectDB;