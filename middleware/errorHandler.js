// ==============================================================================
// Lecture 38: Centralized Error-Handling Middleware
// File: middleware/errorHandler.js
// 
// PURPOSE FOR VIVA:
//   An Express error-handling middleware has FOUR arguments: (err, req, res, next).
//   Express detects the 4-argument signature and catches any errors passed to next(err)
//   or thrown inside async handlers, ensuring the server never crashes.
// ==============================================================================

function errorHandler(err, req, res, next) {
    console.error("❌ [Centralized Error Caught]:", err.message || err);

    // Determine appropriate HTTP status code (default to 500 Internal Server Error)
    const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

    // Build structured JSON error response
    res.status(statusCode).json({
        success: false,
        error: err.message || "An unexpected server error occurred",
        // Only show full stack trace in development mode for security
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
}

// 404 Route Not Found Middleware
function notFoundHandler(req, res, next) {
    const error = new Error(`Route Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error); // Passes to errorHandler
}

module.exports = {
    errorHandler,
    notFoundHandler
};
