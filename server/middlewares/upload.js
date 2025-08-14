const multer = require("multer");
const { imageStorage, resumeStorage } = require("../config/cloudinary");

// Upload middleware for images (company logos)
const uploadImage = multer({
    storage: imageStorage,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only image files (JPEG, PNG, GIF, WebP) are allowed"), false);
        }
    }
});

// Upload middleware for resumes (PDFs)
const uploadResume = multer({
    storage: resumeStorage,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit for PDFs
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === "application/pdf") {
            cb(null, true);
        } else {
            cb(new Error("Only PDF files are allowed for resumes"), false);
        }
    }
});

// Generic upload for mixed files (backward compatibility)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB limit
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["application/pdf", "image/jpeg", "image/png", "image/gif", "image/webp"];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Invalid file type"), false);
        }
    }
});

module.exports = {
    upload,
    uploadImage,
    uploadResume
};