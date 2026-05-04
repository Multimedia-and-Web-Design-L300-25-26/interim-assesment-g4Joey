// ============================================
// routes/cryptoRoutes.js
// ============================================
// Maps URLs to controller functions — same pattern as authRoutes.js
//
// IMPORTANT: Order matters here!
// "/gainers" and "/new" must come BEFORE "/:id" (if we had one)
// because Express reads routes top-to-bottom and "/gainers" would
// match "/:id" with id = "gainers" if /:id came first.

import express from 'express';
import {
  getAllCryptos,
  getGainers,
  getNewListings,
  createCrypto,
  deleteCrypto,
  updateCrypto,
} from '../controllers/cryptoController.js';

const router = express.Router();

// GET /api/crypto         → all cryptos
router.get('/', getAllCryptos);

// GET /api/crypto/gainers → top gainers
router.get('/gainers', getGainers);

// GET /api/crypto/new     → newest listings
router.get('/new', getNewListings);

// POST /api/crypto        → add new crypto
router.post('/', createCrypto);

// DELETE /api/crypto/:id  → delete by ID
router.delete('/:id', deleteCrypto);

// PUT /api/crypto/:id     → update by ID
router.put('/:id', updateCrypto);

export default router;
