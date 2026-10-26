// ==============================================================================
// Lecture 41: MongoDB Migration Script
// File: scripts/migrateTasks.js
// 
// HOW TO RUN:
//   node scripts/migrateTasks.js
// 
// PURPOSE:
//   Migrates existing tasks from data/tasks.json into MongoDB using Mongoose.
// ==============================================================================

require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const Task = require('../models/Task');

const jsonFilePath = path.join(__dirname, '..', 'data', 'tasks.json');
const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/taskflow';

async function migrate() {
    console.log("=== TaskFlow: MongoDB Migration Tool ===");
    console.log(`Connecting to: ${mongoURI}`);

    try {
        await mongoose.connect(mongoURI);
        console.log("✓ Connected to MongoDB.");

        if (!fs.existsSync(jsonFilePath)) {
            console.log("❌ data/tasks.json not found!");
            process.exit(1);
        }

        const rawData = fs.readFileSync(jsonFilePath, 'utf8');
        const tasks = JSON.parse(rawData || '[]');
        console.log(`Found ${tasks.length} task(s) in data/tasks.json.`);

        let insertedCount = 0;
        for (const t of tasks) {
            // Check if already in MongoDB
            const exists = await Task.findOne({ id: t.id });
            if (!exists) {
                await Task.create({
                    id: t.id,
                    title: t.title,
                    description: t.description || '',
                    priority: t.priority || 'medium',
                    dueDate: t.dueDate || '',
                    completed: Boolean(t.completed)
                });
                insertedCount++;
            }
        }

        console.log(`✅ Migration complete! Inserted ${insertedCount} new task(s) into MongoDB.`);
        await mongoose.disconnect();
        console.log("✓ Disconnected cleanly.");
        process.exit(0);
    } catch (err) {
        console.error("❌ Migration failed:", err.message);
        process.exit(1);
    }
}

migrate();
