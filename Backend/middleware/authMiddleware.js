// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config(); // Load environment variables

// Middleware to protect routes (verify JWT token)
exports.protect = async (req, res, next) => {
  let token;

  // Check for token in the 'Authorization' header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Get token from header (format: "Bearer TOKEN")
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to the request object (without password)
      req.user = await User.findById(decoded.id).select('-password');
      req.user.role = decoded.role; // Ensure role is available from token

      next(); // Proceed to the next middleware/route handler
    } catch (error) {
      console.error('Token verification failed:', error.message);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// Middleware for role-based access control
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {
    // Check if user is authenticated and has a role
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: 'Access denied, no user role found' });
    }

    // Check if the user's role is included in the allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `Access denied, role ${req.user.role} is not authorized for this action` });
    }
    next(); // User has the required role, proceed
  };
};
