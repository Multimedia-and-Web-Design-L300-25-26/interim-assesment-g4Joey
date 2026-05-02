// ============================================
// models/User.js — User Schema
// ============================================
// A schema is like a BLUEPRINT for your data.
// It says: "Every user MUST have these fields, with these types."
//
// Think of it like a form — you define which fields exist,
// which are required, and what type of data they accept.

import mongoose from 'mongoose';

// mongoose.Schema() creates the blueprint
const userSchema = new mongoose.Schema(
  {
    // Each field has a type and rules (called "validators")
    name: {
      type: String,        // Must be a string
      required: [true, 'Name is required'],  // Can't be empty — the message shows if someone forgets it
      trim: true,          // Removes extra spaces: "  Josh  " becomes "Josh"
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,        // No two users can have the same email
      lowercase: true,     // "Josh@Email.com" becomes "josh@email.com"
      trim: true,
    },

    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      // NOTE: We'll store the HASHED version, never the plain text!
      // The hashing happens in the controller, not here.
    },
  },
  {
    // This option automatically adds "createdAt" and "updatedAt" fields
    // So you know when each user was created and last modified
    timestamps: true,
  }
);

// mongoose.model() takes the schema blueprint and creates a usable Model
// 'User' = the name → MongoDB will create a collection called "users" (lowercase + plural)
const User = mongoose.model('User', userSchema);

export default User;
