// ==============================================================================
// Lecture 41: Mongoose Schema & Model - Task
// File: models/Task.js
// 
// TOPICS DEMONSTRATED:
//   - Schema definition with typed fields
//   - Built-in Schema Validations (required, enum, minlength)
//   - Relationship reference (ref: 'User') demonstrating populate()
// ==============================================================================

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    // Numeric or string ID to support both JSON legacy IDs and MongoDB _id
    id: {
        type: Number,
        default: () => Date.now()
    },
    title: {
        type: String,
        required: [true, 'Task title is required'],
        trim: true,
        minlength: [2, 'Task title must be at least 2 characters long']
    },
    description: {
        type: String,
        default: '',
        trim: true
    },
    priority: {
        type: String,
        enum: {
            values: ['low', 'medium', 'high'],
            message: '{VALUE} is not a valid priority level (low, medium, high)'
        },
        default: 'medium'
    },
    dueDate: {
        type: String,
        default: ''
    },
    completed: {
        type: Boolean,
        default: false
    },
    attachment: {
        type: String,
        default: null
    },
    // Relationship: Student who created/owns this task (for populate() in Lec 41)
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Task', taskSchema);
