// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true, // Remove whitespace from both ends of a string
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['user', 'admin'], // Define allowed roles
    default: 'user', // Default role for new users
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Hash password before saving the user
UserSchema.pre('save', async function (next) {
  // Only hash if the password has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }
  // Generate a salt
  const salt = await bcrypt.genSalt(10);
  // Hash the password with the salt
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password with hashed password in the database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
