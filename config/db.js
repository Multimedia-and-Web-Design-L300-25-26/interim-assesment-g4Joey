// ============================================
// config/db.js — Database Connection
// ============================================
// This file has ONE job: connect to MongoDB.
//
// WHY a separate file? Same reason you put components in separate files in React.
// It keeps server.js clean and this logic reusable.

import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // mongoose.connect() returns a promise — that's why we use async/await
    // process.env.MONGO_URI comes from your .env file
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // process.exit(1) stops the server — no point running without a database!
    process.exit(1);
  }
};

export default connectDB;
