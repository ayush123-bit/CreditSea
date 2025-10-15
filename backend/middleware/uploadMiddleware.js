// backend/middleware/uploadMiddleware.js
const multer = require('multer');
const path = require('path');

// store files in memory (we just need to parse them, no disk required)
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const allowed = ['.xml', '.txt']; // sometimes xml comes as text
  if (allowed.includes(ext) || file.mimetype === 'application/xml' || file.mimetype === 'text/xml') {
    cb(null, true);
  } else {
    cb(new Error('Only XML files are allowed'), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5 MB limit
});

module.exports = upload;
