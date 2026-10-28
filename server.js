//GUNIT KI DOCUMENTS



// ==============================================================================
// TaskFlow - Backend Express Server
// Student Task Management System
// ==============================================================================

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB, getDatabaseStatus } = require('./config/db');
const { errorHandler } = require('./middleware/errorHandler');

// Route Handlers
const taskRoutes = require('./routes/taskRoutes');
const authRoutes = require('./routes/authRoutes');
const tipRoutes = require('./routes/tipRoutes');
const demoRoutes = require('./routes/demoRoutes');

// Initialize Express Application
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB with graceful JSON fallback
connectDB();

// ===== BUILT-IN & THIRD-PARTY MIDDLEWARE =====

// 1. CORS Middleware (allows React Vite frontend on port 5173 to access API)
app.use(cors());

// 2. Body Parser Middleware for JSON payloads (Lecture 38)
app.use(express.json());

// 3. Body Parser Middleware for URL-encoded form submissions
app.use(express.urlencoded({ extended: true }));

// 4. Static File Middleware: Serves vanilla HTML/CSS/JS frontend from root
app.use(express.static(__dirname));

// 5. Static File Middleware: Serves uploaded task attachments
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 6. Static File Middleware: Serves built React SPA at /app (Lecture 42)
const reactDistPath = path.join(__dirname, 'frontend', 'dist');
app.use('/app', express.static(reactDistPath));
app.get('/app', (req, res, next) => {
    const indexPath = path.join(reactDistPath, 'index.html');
    if (require('fs').existsSync(indexPath)) {
        return res.sendFile(indexPath);
    }
    next();
});


// ===== SYSTEM HEALTH & STATUS ROUTE =====
app.get('/api/status', (req, res) => {
    const dbStatus = getDatabaseStatus();
    res.json({
        success: true,
        project: "TaskFlow - Student Task Management System",
        evaluation: "CHO FA2 Evaluation Ready",
        server: "Node.js & Express 5",
        uptimeSeconds: Math.floor(process.uptime()),
        database: dbStatus
    });
});


// ===== API ROUTES =====
// Lecture 39-40: Authentication endpoints (/api/auth/register, /api/auth/login, /api/auth/me)
app.use('/api/auth', authRoutes);

// Lectures 37-41: Task CRUD & upload endpoints (/api/tasks, /api/tasks/:id, /api/tasks/:id/upload)
app.use('/api/tasks', taskRoutes);

// Lecture 29: Study tips endpoints (/api/tips/daily)
app.use('/api/tips', tipRoutes);

// Lectures 31-36: Node.js fundamental script runner endpoint (/api/demos/node/:topic)
app.use('/api/demos', demoRoutes);


// ===== CENTRALIZED ERROR-HANDLING MIDDLEWARE (Lecture 38) =====
app.use(errorHandler);


// ===== SERVER INITIALIZATION =====
const server = app.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`🚀 TaskFlow Server running at: http://localhost:${PORT}`);
    console.log(`📚 Static Frontend:           http://localhost:${PORT}/index.html`);
    console.log(`🔬 CHO Topics Demo Page:       http://localhost:${PORT}/demo-advanced-js.html`);
    console.log(`📋 API Tasks Endpoint:         http://localhost:${PORT}/api/tasks`);
    console.log(`💡 API Study Tips Endpoint:    http://localhost:${PORT}/api/tips/daily`);
    console.log(`📊 System Status:              http://localhost:${PORT}/api/status`);
    console.log(`==================================================\n`);
});

module.exports = app;