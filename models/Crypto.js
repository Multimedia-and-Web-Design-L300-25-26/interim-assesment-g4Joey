// ============================================
// models/Crypto.js — Cryptocurrency Schema
// ============================================
// This defines what a cryptocurrency looks like in our database.
// Each crypto entry will have a name, symbol, price, image, and 24h change.

import mongoose from 'mongoose';

const cryptoSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Crypto name is required'],
      trim: true,
      // Example: "Bitcoin", "Ethereum", "Solana"
    },

    symbol: {
      type: String,
      required: [true, 'Symbol is required'],
      uppercase: true,     // "btc" becomes "BTC"
      trim: true,
      // Example: "BTC", "ETH", "SOL"
    },

    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
      // Example: 67542.30
    },

    image: {
      type: String,
      required: [true, 'Image URL is required'],
      // This will be a URL to the crypto's logo
      // Example: "https://example.com/bitcoin-logo.png"
    },

    change24h: {
      type: Number,
      required: [true, '24h change is required'],
      // This is the percentage change in price over 24 hours
      // Positive = price went UP, Negative = price went DOWN
      // Example: +2.5 means price increased 2.5%
      // Example: -1.3 means price decreased 1.3%
    },
  },
  {
    timestamps: true,
    // timestamps gives us "createdAt" — we'll use this to sort "new listings"
    // and "updatedAt" — useful to know when data was last changed
  }
);

const Crypto = mongoose.model('Crypto', cryptoSchema);

export default Crypto;
