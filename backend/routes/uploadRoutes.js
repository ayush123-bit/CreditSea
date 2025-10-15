// backend/routes/uploadRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { uploadAndParse } = require('../controllers/uploadController');

// single file under field name "file". e.g. formData.append('file', file)
router.post('/', upload.single('file'), uploadAndParse);

module.exports = router;
