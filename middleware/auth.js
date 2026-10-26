// ==============================================================================
// Lecture 39-40: JWT (JSON Web Token) Authentication Middleware
// File: middleware/auth.js
// 
// PURPOSE FOR VIVA:
//   - Verifies the cryptographic signature of incoming JWT tokens in req.headers.authorization.
//   - If token is valid, attaches decoded user payload to req.user.
//   - Protects sensitive endpoints (e.g., creating tasks under student profile).
// ==============================================================================

const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'taskflow_cho_fa2_student_evaluation_secret_key_2026';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * generateToken(payload)
 * Generates a signed JWT with expiration
 */
function generateToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * verifyToken(req, res, next)
 * Strict authentication middleware: Rejects request if valid Bearer token is missing.
 */
function verifyToken(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            error: "Access denied. No authorization token provided. Format: Bearer <token>"
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded; // Attach user info { id, email, role } to request
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            error: "Invalid or expired authorization token: " + error.message
        });
    }
}

/**
 * optionalAuth(req, res, next)
 * Permissive authentication: Attaches user if token exists, but doesn't block unauthenticated guests.
 */
function optionalAuth(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.split(' ')[1];
        try {
            req.user = jwt.verify(token, JWT_SECRET);
        } catch {
            // Ignore error for optional auth
        }
    }
    next();
}

module.exports = {
    generateToken,
    verifyToken,
    optionalAuth
};
