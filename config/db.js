// ==============================================================================
// Lecture 41: MongoDB & Mongoose Database Connection
// File: config/db.js
// 
// PURPOSE:
//   Connects to MongoDB using Mongoose with graceful error handling and dual-mode
//   fallback. If MongoDB is not running locally or credentials are not configured,
//   TaskFlow automatically logs a warning and falls back to JSON file storage.
//   This ensures the application NEVER crashes during evaluation.
// ==============================================================================

const mongoose = require('mongoose');

// State flag tracked for dual-mode fallback
let isConnected = false;

async function connectDB() {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskflow';
    
    try {
        console.log(`🔌 Attempting MongoDB connection: ${mongoURI}`);
        
        // Connect to MongoDB with 3-second timeout for quick fallback
        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 3000
        });
        
        isConnected = true;
        console.log("✅ MongoDB Connected Successfully via Mongoose!");
    } catch (error) {
        isConnected = false;
        console.warn("⚠️ MongoDB connection failed (Server not running or network issue):", error.message);
        console.log("📁 DUAL-MODE ACTIVATED: TaskFlow will safely store tasks in data/tasks.json fallback.");
    }
}

function getDatabaseStatus() {
    return {
        connected: isConnected,
        provider: isConnected ? "MongoDB / Mongoose" : "Local JSON (data/tasks.json)"
    };
}

module.exports = {
    connectDB,
    getDatabaseStatus,
    isMongoConnected: () => isConnected
};
