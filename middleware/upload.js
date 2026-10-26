// ==============================================================================
// Lecture 40: Multer File Upload Middleware
// File: middleware/upload.js
// 
// PURPOSE FOR VIVA:
//   - Multer handles multipart/form-data for file uploads.
//   - Demonstrates strict file type filtering (whitelist), unique filenames, and 2MB limit.
// ==============================================================================

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '..', 'uploads');

// Ensure upload directory exists safely
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure disk storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        // Sanitize and append timestamp + random suffix to prevent file collisions
        const safeName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_');
        const uniqueSuffix = `${Date.now()}_${Math.round(Math.random() * 1E6)}`;
        cb(null, `${uniqueSuffix}_${safeName}`);
    }
});

// File filter: Only accept safe document and image formats
const fileFilter = (req, file, cb) => {
    const allowedExtensions = ['.pdf', '.png', '.jpg', '.jpeg', '.docx', '.txt'];
    const ext = path.extname(file.originalname).toLowerCase();

    if (allowedExtensions.includes(ext)) {
        cb(null, true);
    } else {
        cb(new Error(`Invalid file type (${ext}). Only PDF, PNG, JPG, DOCX, and TXT files are permitted.`));
    }
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 2 * 1024 * 1024 // 2 Megabytes limit
    },
    fileFilter: fileFilter
});

module.exports = upload;
