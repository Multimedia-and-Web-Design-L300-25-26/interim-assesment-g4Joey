// ============================================
// server.js — The Entry Point of Your Backend
// ============================================
// This is where everything starts. Think of it as the "main.jsx" of your backend.
// It does 3 things:
//   1. Sets up Express (the web framework)
//   2. Connects to MongoDB (the database)
//   3. Tells Express which URLs (routes) to listen for

// --- IMPORTS ---
// 'import' works because we set "type": "module" in package.json
import express from 'express';       // The web framework
import dotenv from 'dotenv';         // Loads .env file into process.env
import cors from 'cors';             // Allows frontend to talk to backend
import connectDB from './config/db.js';  // Our database connection function
import authRoutes from './routes/authRoutes.js';
import cryptoRoutes from './routes/cryptoRoutes.js';

// Load environment variables FIRST (before anything else uses them)
// This reads your .env file and makes variables available as process.env.VARIABLE_NAME
dotenv.config();

// --- CREATE THE APP ---
// express() creates your application. Think of it like createRoot() in React.
const app = express();

// --- MIDDLEWARE ---
// Middleware = functions that run on EVERY request before your route handlers
// Think of them as "filters" that process requests as they come in

// 1. CORS - Cross-Origin Resource Sharing
//    Without this, your browser will BLOCK requests from localhost:5173 (frontend)
//    to localhost:5000 (backend) because they're different "origins"
app.use(cors());

// 2. JSON Parser
//    When the frontend sends data (like a new user's name/email), it comes as JSON.
//    This middleware reads that JSON and puts it in req.body so you can use it.
app.use(express.json());

// --- ROUTES ---
// These tell Express: "when someone visits THIS url, run THIS code"
// We'll add our real routes (auth, crypto) in the next phases

// A simple test route to make sure the server is working
app.get('/', (req, res) => {
  res.json({ message: 'Coinbase Clone API is running 🚀' });
});

// Mount the auth router at /api/auth
// This means every route inside authRoutes.js gets prefixed with /api/auth
// So router.post('/register') becomes POST /api/auth/register
// And  router.get('/profile')  becomes GET  /api/auth/profile
app.use('/api/auth', authRoutes);
app.use('/api/crypto', cryptoRoutes);

// --- CONNECT TO DATABASE & START SERVER ---
const PORT = process.env.PORT || 5000;

// Connect to MongoDB first, THEN start listening for requests
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
  });
});
