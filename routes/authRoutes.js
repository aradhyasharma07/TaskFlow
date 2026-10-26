// ==============================================================================
// Lecture 39-40: Authentication Routes (JWT & Bcrypt)
// File: routes/authRoutes.js
// 
// ENDPOINTS:
//   POST /api/auth/register  -> Register student (hashes password with bcrypt)
//   POST /api/auth/login     -> Authenticate student & return signed JWT
//   GET  /api/auth/me        -> Protected route returning current user profile
// ==============================================================================

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const { generateToken, verifyToken } = require('../middleware/auth');
const { validateAuthInput } = require('../middleware/validate');
const { isMongoConnected } = require('../config/db');

// In-memory user store fallback if MongoDB is not connected
const memoryUsers = [];

// POST /api/auth/register - Register a new student
router.post('/register', validateAuthInput, async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        const studentName = name || email.split('@')[0];

        // 1. If MongoDB is connected, use Mongoose
        if (isMongoConnected()) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ success: false, error: "A user with this email already exists" });
            }

            const newUser = new User({ name: studentName, email, password });
            await newUser.save();

            const token = generateToken({ id: newUser._id, email: newUser.email, name: newUser.name });
            return res.status(201).json({
                success: true,
                message: "Student registered successfully (MongoDB)",
                token,
                user: { id: newUser._id, name: newUser.name, email: newUser.email }
            });
        }

        // 2. Fallback mode (In-memory storage)
        const existing = memoryUsers.find(u => u.email === email);
        if (existing) {
            return res.status(400).json({ success: false, error: "A user with this email already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const fallbackUser = {
            id: Date.now().toString(),
            name: studentName,
            email,
            password: hashedPassword,
            createdAt: new Date()
        };
        memoryUsers.push(fallbackUser);

        const token = generateToken({ id: fallbackUser.id, email: fallbackUser.email, name: fallbackUser.name });
        return res.status(201).json({
            success: true,
            message: "Student registered successfully (Dual-mode Fallback)",
            token,
            user: { id: fallbackUser.id, name: fallbackUser.name, email: fallbackUser.email }
        });
    } catch (error) {
        next(error);
    }
});

// POST /api/auth/login - Student login
router.post('/login', validateAuthInput, async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // 1. MongoDB Mode
        if (isMongoConnected()) {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(401).json({ success: false, error: "Invalid email or password" });
            }

            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(401).json({ success: false, error: "Invalid email or password" });
            }

            const token = generateToken({ id: user._id, email: user.email, name: user.name });
            return res.json({
                success: true,
                message: "Logged in successfully",
                token,
                user: { id: user._id, name: user.name, email: user.email }
            });
        }

        // 2. Fallback Mode
        const user = memoryUsers.find(u => u.email === email);
        if (!user) {
            return res.status(401).json({ success: false, error: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, error: "Invalid email or password" });
        }

        const token = generateToken({ id: user.id, email: user.email, name: user.name });
        return res.json({
            success: true,
            message: "Logged in successfully (Dual-mode)",
            token,
            user: { id: user.id, name: user.name, email: user.email }
        });
    } catch (error) {
        next(error);
    }
});

// GET /api/auth/me - Protected route demonstrating JWT authentication
router.get('/me', verifyToken, async (req, res, next) => {
    try {
        // req.user was decoded and attached by verifyToken middleware
        return res.json({
            success: true,
            message: "Protected user profile accessed successfully",
            user: req.user
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
