// ==============================================================================
// Lecture 39-40: JWT (JSON Web Token) Authentication Middleware
// File: middleware/auth.js
// 
// PURPOSE FOR VIVA:
//   - Verifies the cryptographic signature of incoming JWT tokens in req.headers.authorization.
//   - If token is valid, attaches decoded user payload to req.user.
//   - Protects sensitive endpoints (e.g., student profile, task management).
//   - Never uses hardcoded fallback secrets: requires JWT_SECRET from environment.
// ==============================================================================

const jwt = require('jsonwebtoken');

// Require JWT_SECRET from environment variables (no hardcoded fallback)
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Fail safely: In production, immediately halt with an error if secret is missing
if (process.env.NODE_ENV === 'production' && !JWT_SECRET) {
    throw new Error('FATAL SECURITY ERROR: JWT_SECRET environment variable is missing in production mode!');
}

/**
 * getSecret()
 * Retrieves JWT_SECRET or throws an error if it is not configured
 */
function getSecret() {
    if (!JWT_SECRET) {
        throw new Error('JWT_SECRET environment variable is required but not set.');
    }
    return JWT_SECRET;
}

/**
 * generateToken(payload)
 * Generates a signed JWT with expiration
 */
function generateToken(payload) {
    const secret = getSecret();
    return jwt.sign(payload, secret, { expiresIn: JWT_EXPIRES_IN });
}

/**
 * verifyToken(req, res, next)
 * Strict authentication middleware: Rejects request if valid Bearer token is missing.
 */
function verifyToken(req, res, next) {
    let secret;
    try {
        secret = getSecret();
    } catch (err) {
        return res.status(500).json({
            success: false,
            error: "Authentication service misconfigured: JWT_SECRET environment variable is missing."
        });
    }

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({
            success: false,
            error: "Access denied. No authorization token provided. Format: Bearer <token>"
        });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, secret);
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
    if (authHeader && authHeader.startsWith('Bearer ') && JWT_SECRET) {
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
