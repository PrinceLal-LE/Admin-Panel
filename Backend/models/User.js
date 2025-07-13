// backend/models/User.js
const mongoose = require('mongoose');
const argon2 = require('argon2'); // Import argon2

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
  }
}, {
  collection: 'Ad_users' // Explicitly set the collection name to Ad_users
});

// Hash password before saving the user using argon2
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    this.password = await argon2.hash(this.password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,     // 64 MB
      timeCost: 3,            // Iterations
      parallelism: 1          // Threads
    });
    next();
  } catch (err) {
    next(err); // Pass error to the next middleware
  }
});

// Method to compare entered password with hashed password in the database using argon2
UserSchema.methods.matchPassword = async function (enteredPassword) {
  try {
    return await argon2.verify(this.password, enteredPassword); // Use argon2.verify
  } catch (err) {
    console.error("Password verification error:", err);
    return false;
  }
};

module.exports = mongoose.model('User', UserSchema);
