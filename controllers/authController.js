// ============================================
// controllers/authController.js
// ============================================
// Controllers contain the LOGIC for each route.
// Think of them as the "brain" — they receive a request,
// do the work (talk to the DB, hash a password, etc.),
// and send back a response.
//
// Routes will just say "when someone hits POST /register,
// run this controller function".

import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// ─── HELPER FUNCTION ───────────────────────────────────────
// This creates a JWT token for a given user
// We'll reuse this in both register and login
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },            // The "payload" — data encoded IN the token
    process.env.JWT_SECRET,    // The secret key used to SIGN (lock) it
    { expiresIn: '7d' }        // Token expires after 7 days (user must log in again)
  );
  // The result is a long string like:
  // "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY..."
  // Anyone can decode the payload, but only YOUR server (with the secret) can verify it's real
};


// ─── REGISTER ──────────────────────────────────────────────
// POST /api/auth/register
// What it does:
//   1. Check if email is already taken
//   2. Hash the password
//   3. Save user to database
//   4. Return a JWT token (so they're instantly "logged in" after registering)
export const register = async (req, res) => {
  try {
    // req.body contains what the frontend sent (name, email, password)
    const { name, email, password } = req.body;

    // 1. Validate — make sure all fields were provided
    if (!name || !email || !password) {
      // 400 = "Bad Request" — the user sent invalid data
      return res.status(400).json({ message: 'Please provide name, email and password' });
    }

    // 2. Check if email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // 3. Hash the password
    // bcrypt.genSalt(10) generates a "salt" — random data added to the password before hashing
    // The 10 is the "cost factor" — higher = more secure but slower. 10 is standard.
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Now hashedPassword looks like: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"
    // This gets stored in the DB. The original "password" is never stored!

    // 4. Create the user in the database
    const user = await User.create({
      name,
      email,
      password: hashedPassword,   // ← Store the hash, not the plain password
    });

    // 5. Generate a JWT token for this new user
    const token = generateToken(user._id);
    // user._id is MongoDB's auto-generated unique ID for each document

    // 6. Send back the token and basic user info
    // 201 = "Created" — resource was successfully created
    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    // 500 = "Internal Server Error" — something unexpected broke
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// ─── LOGIN ─────────────────────────────────────────────────
// POST /api/auth/login
// What it does:
//   1. Find user by email
//   2. Compare the password they sent with the hash stored in DB
//   3. If correct → return a JWT token
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    // 2. Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      // Use a vague message intentionally — don't tell hackers if the email exists
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // 3. Compare passwords
    // bcrypt.compare() hashes the incoming "password" the same way and compares
    // It returns true if they match, false if not
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
      // 401 = "Unauthorized" — credentials are wrong
    }

    // 4. Passwords match! Generate and return a token
    const token = generateToken(user._id);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


// ─── GET PROFILE ───────────────────────────────────────────
// GET /api/auth/profile
// This route is PROTECTED — only works if you send a valid JWT token
// The actual token verification happens in middleware/auth.js
// By the time we get here, req.user has already been set by that middleware
export const getProfile = async (req, res) => {
  try {
    // req.user.id was set by the auth middleware after verifying the token
    // .select('-password') means "give me everything EXCEPT the password field"
    const user = await User.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
