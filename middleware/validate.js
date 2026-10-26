// ==============================================================================
// Lecture 38: Request Body Input Validation Middleware
// File: middleware/validate.js
// 
// PURPOSE FOR VIVA:
//   Validates incoming request payload BEFORE controller executes.
//   Sanitizes and prevents malicious or malformed data from reaching the database.
// ==============================================================================

function validateTaskInput(req, res, next) {
    const { title, priority } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({
            success: false,
            error: "Task title is required and cannot be empty"
        });
    }

    if (title.trim().length < 2) {
        return res.status(400).json({
            success: false,
            error: "Task title must be at least 2 characters long"
        });
    }

    if (priority && !['low', 'medium', 'high'].includes(priority.toLowerCase())) {
        return res.status(400).json({
            success: false,
            error: "Invalid priority level. Allowed values: 'low', 'medium', 'high'"
        });
    }

    // Normalization
    req.body.title = title.trim();
    if (req.body.description) req.body.description = req.body.description.trim();
    if (priority) req.body.priority = priority.toLowerCase();

    next(); // All checks passed! Proceed to next middleware or route handler
}

function validateAuthInput(req, res, next) {
    const { email, password } = req.body;

    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({
            success: false,
            error: "A valid email address is required"
        });
    }

    if (!password || password.length < 6) {
        return res.status(400).json({
            success: false,
            error: "Password must be at least 6 characters long"
        });
    }

    next();
}

module.exports = {
    validateTaskInput,
    validateAuthInput
};
