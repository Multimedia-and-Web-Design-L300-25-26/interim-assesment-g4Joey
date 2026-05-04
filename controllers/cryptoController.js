// ============================================
// controllers/cryptoController.js
// ============================================
// Handles all 4 crypto endpoints:
//   GET  /api/crypto          → all cryptos
//   GET  /api/crypto/gainers  → sorted by highest % gain
//   GET  /api/crypto/new      → sorted by newest first
//   POST /api/crypto          → create a new crypto entry

import Crypto from '../models/Crypto.js';

// ─── GET ALL CRYPTOS ───────────────────────────────────────
// GET /api/crypto
export const getAllCryptos = async (req, res) => {
  try {
    // Crypto.find() with no arguments = "give me everything"
    const cryptos = await Crypto.find();
    res.json(cryptos);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── GET TOP GAINERS ───────────────────────────────────────
// GET /api/crypto/gainers
// Returns cryptos sorted by change24h — highest percentage gain first
export const getGainers = async (req, res) => {
  try {
    const gainers = await Crypto.find()
      .sort({ change24h: -1 });
      // .sort() tells MongoDB how to order the results
      // { change24h: -1 } means "sort by change24h DESCENDING" (highest first)
      // { change24h:  1 } would be ascending (lowest first)

    res.json(gainers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── GET NEW LISTINGS ──────────────────────────────────────
// GET /api/crypto/new
// Returns cryptos sorted by when they were added — newest first
export const getNewListings = async (req, res) => {
  try {
    const newListings = await Crypto.find()
      .sort({ createdAt: -1 });
      // createdAt is the timestamp auto-added by mongoose (timestamps: true in the schema)
      // -1 = descending = newest first

    res.json(newListings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── CREATE A NEW CRYPTO ───────────────────────────────────
// POST /api/crypto
// Adds a new cryptocurrency to the database
export const createCrypto = async (req, res) => {
  try {
    // Destructure the fields from the request body
    const { name, symbol, price, image, change24h } = req.body;

    // Validate all required fields are present
    if (!name || !symbol || !price || !image || change24h === undefined) {
      return res.status(400).json({
        message: 'Please provide name, symbol, price, image and change24h',
      });
    }

    // Create the crypto in the database
    // Crypto.create() = new Crypto({...}).save() — just shorter
    const crypto = await Crypto.create({
      name,
      symbol,
      price,
      image,
      change24h,
    });

    // 201 = Created
    res.status(201).json({
      message: 'Cryptocurrency added successfully',
      crypto,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── DELETE A CRYPTO ───────────────────────────────────────
// DELETE /api/crypto/:id
// The :id part is a URL parameter — it's whatever the caller puts in the URL
// e.g. DELETE /api/crypto/664abc123... → req.params.id = "664abc123..."
export const deleteCrypto = async (req, res) => {
  try {
    // req.params.id = the MongoDB _id from the URL
    const crypto = await Crypto.findByIdAndDelete(req.params.id);

    if (!crypto) {
      // 404 = "Not Found" — no document with that ID exists
      return res.status(404).json({ message: 'Crypto not found' });
    }

    res.json({ message: 'Crypto deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// ─── UPDATE A CRYPTO ───────────────────────────────────────
// PUT /api/crypto/:id
// Updates an existing cryptocurrency by its ID
export const updateCrypto = async (req, res) => {
  try {
    const { name, symbol, price, image, change24h } = req.body;
    
    // Find and update in one go
    // { new: true } returns the updated document instead of the old one
    const crypto = await Crypto.findByIdAndUpdate(
      req.params.id,
      { name, symbol, price, image, change24h },
      { new: true, runValidators: true }
    );

    if (!crypto) {
      return res.status(404).json({ message: 'Crypto not found' });
    }

    res.json({
      message: 'Cryptocurrency updated successfully',
      crypto,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
