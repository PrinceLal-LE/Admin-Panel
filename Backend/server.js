// backend/server.js
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const protectedRoutes = require('./routes/protected');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors()); // Enable CORS for all origins (for development)
app.use(express.json()); // Body parser for JSON data

// Routes
app.use('/api/auth', authRoutes); // Authentication routes (register, login)
app.use('/api/protected', protectedRoutes); // Protected routes with RBAC

// Basic route for testing server
app.get('/', (req, res) => {
  res.send('API is running...');
});

// Define port
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
