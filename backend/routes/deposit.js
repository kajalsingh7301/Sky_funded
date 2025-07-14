// depositRoutes.js (simplified)
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body, validationResult } = require('express-validator');

const { authenticateToken } = require('../middleware/authMiddleware');
const depositController = require('../controllers/depositController');

const uploadDir = path.join(__dirname, '../uploads/deposits');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const mimetype = allowedTypes.test(file.mimetype);
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) return cb(null, true);
    cb(new Error('Only image files (jpeg, jpg, png, gif) are allowed!'));
  },
});

const deleteFile = (filePath) => {
  fs.unlink(filePath, (err) => {
    if (err) console.error('Failed to delete file:', err);
  });
};

router.post(
  '/save',
  authenticateToken,
  upload.single('screenshot'),
  [
    body('amount').isFloat({ min: 10 }).withMessage('Minimum deposit amount is $10'),
    body('paymentMethod').notEmpty().withMessage('Payment method is required'),
  ],
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      if (req.file) deleteFile(req.file.path);
      return res.status(400).json({ success: false, msg: errors.array()[0].msg });
    }
    if (!req.file) {
      return res.status(400).json({ success: false, msg: 'Payment screenshot is required' });
    }
    next();
  },
  depositController.createDeposit
);


router.get('/', authenticateToken, async (req, res) => {
  try {
    // Return all deposits (assuming only admin accesses this route)
    return depositController.getAllDeposits(req, res);
  } catch (error) {
    console.error('Error in GET /api/deposit:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

router.delete('/:id', authenticateToken, async (req, res, next) => {
  try {
    const deposit = await depositController.findDepositById(req.params.id);
    if (!deposit) {
      return res.status(404).json({ msg: 'Deposit not found' });
    }

    // Allow deletion without role check (assumed only admin can delete)
    next();
  } catch (err) {
    console.error('Delete deposit error:', err.message);
    return res.status(500).json({ msg: 'Server error' });
  }
}, depositController.deleteDeposit);

module.exports = router;
