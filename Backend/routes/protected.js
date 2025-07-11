// backend/routes/protected.js
const express = require('express');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

const router = express.Router();

// Example protected route accessible by any authenticated user
router.get('/profile', protect, (req, res) => {
  res.json({
    message: 'Welcome to your profile!',
    user: {
      id: req.user._id,
      username: req.user.username,
      role: req.user.role,
    },
  });
});

// Example route accessible only by 'admin'
router.get('/admin-dashboard', protect, authorizeRoles('admin'), (req, res) => {
  res.json({ message: 'Welcome to the Admin Dashboard, Admin!' });
});

// Example route accessible by 'user' (and 'admin' if they also have 'user' permissions, though typically not needed this way)
router.get('/user-dashboard', protect, authorizeRoles('user', 'admin'), (req, res) => {
  res.json({ message: 'Welcome to the User Dashboard!' });
});

// Example route accessible by both 'admin' and 'user'
router.get('/public-data', protect, authorizeRoles('admin', 'user'), (req, res) => {
  res.json({ message: 'This data is accessible to both admin and regular users.' });
});

module.exports = router;
