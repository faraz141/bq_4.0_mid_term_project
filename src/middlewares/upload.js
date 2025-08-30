const multer = require('multer');
const path = require('path');

// Configure storage for different file types
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Determine destination based on file type or route
    let uploadPath = 'uploads/';
    
    if (req.route && req.route.path.includes('profile')) {
      uploadPath += 'profiles/';
    } else if (req.route && req.route.path.includes('event')) {
      uploadPath += 'events/';
    } else {
      uploadPath += 'misc/';
    }
    
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  // Check file type
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
    files: 1 // Only allow 1 file per request
  },
  fileFilter: fileFilter
});

// Specific upload configurations
const uploadProfilePicture = upload.single('profileImage');
const uploadEventBanner = upload.single('bannerImage');

// Error handling wrapper
const handleUpload = (uploadMiddleware) => {
  return (req, res, next) => {
    uploadMiddleware(req, res, (err) => {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            status: 'error',
            message: 'File too large. Maximum size is 5MB.'
          });
        }
        if (err.code === 'LIMIT_UNEXPECTED_FILE') {
          return res.status(400).json({
            status: 'error',
            message: 'Unexpected file field.'
          });
        }
      } else if (err) {
        return res.status(400).json({
          status: 'error',
          message: err.message
        });
      }
      next();
    });
  };
};

module.exports = {
  upload,
  uploadProfilePicture: handleUpload(uploadProfilePicture),
  uploadEventBanner: handleUpload(uploadEventBanner)
};
