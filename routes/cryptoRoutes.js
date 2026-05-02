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
// /:id is a dynamic segment — Express captures whatever is in that position
// and puts it in req.params.id inside the controller
router.delete('/:id', deleteCrypto);

export default router;
