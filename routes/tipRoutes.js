// ==============================================================================
// Lecture 29: REST API Endpoint - Study Tips
// File: routes/tipRoutes.js
// 
// PURPOSE:
//   Provides academic study advice and productivity tips to students.
// ==============================================================================

const express = require('express');
const router = express.Router();

const studentTips = [
    { id: 1, tip: "Use the Pomodoro Technique: 25 mins deep work, 5 mins rest.", category: "Time Management" },
    { id: 2, tip: "Review your lecture notes within 24 hours to double memory retention.", category: "Revision" },
    { id: 3, tip: "Active recall via practice problems beats passive re-reading every time.", category: "Exams" },
    { id: 4, tip: "Break large projects into 30-minute milestones to avoid procrastination.", category: "Productivity" },
    { id: 5, tip: "Teach complex coding topics to a friend or write quick summaries.", category: "Understanding" },
    { id: 6, tip: "Sleep 7-8 hours; memory consolidation occurs during REM sleep.", category: "Wellness" }
];

// GET /api/tips/daily - Get a random study tip
router.get('/daily', (req, res) => {
    const randomTip = studentTips[Math.floor(Math.random() * studentTips.length)];
    res.json({
        success: true,
        data: randomTip
    });
});

// GET /api/tips - Get all study tips
router.get('/', (req, res) => {
    res.json({
        success: true,
        count: studentTips.length,
        data: studentTips
    });
});

module.exports = router;
