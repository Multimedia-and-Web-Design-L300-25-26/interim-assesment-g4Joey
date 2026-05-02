// ============================================
// routes/authRoutes.js
// ============================================
// Routes are like a MENU — they list all the available URLs
// and which controller function handles each one.
//
// Routes DON'T contain logic. They just say:
//   "POST /register? → call register() from authController"
//   "POST /login?    → call login() from authController"
//   "GET  /profile?  → check token first (protect), then call getProfile()"

import express from 'express';
import { register, login, getProfile } from '../controllers/authController.js';
import protect from '../middleware/auth.js';

// express.Router() creates a "mini-app" for a group of related routes
const router = express.Router();

// Public routes — anyone can access these (no token needed)
router.post('/register', register);
router.post('/login', login);

// Protected route — protect middleware runs FIRST
// If the token is valid, protect() calls next() and getProfile() runs
// If invalid, protect() sends a 401 and getProfile() NEVER runs
router.get('/profile', protect, getProfile);
//                     ↑↑↑↑↑↑↑
//                     This is the middleware! Just pass it as an argument.
//                     Express runs them left to right.

export default router;
