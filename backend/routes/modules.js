const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { body, validationResult } = require('express-validator');
const Module = require('../models/Module');
const { authenticate, isAdmin } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|mp4|mov|avi/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (extname && mimetype) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF and video files are allowed'));
    }
  }
});

// @route   GET /api/modules
// @desc    Get all modules
// @access  Public
router.get('/', async (req, res) => {
  try {
    const modules = await Module.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    res.json(modules);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   GET /api/modules/:id
// @desc    Get single module
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const module = await Module.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }
    
    res.json(module);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   POST /api/modules
// @desc    Create a new module
// @access  Private (Admin only)
router.post('/', authenticate, isAdmin, upload.single('file'), [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, contentType } = req.body;
    
    let fileUrl = '';
    let finalContentType = contentType || 'text';
    
    if (req.file) {
      fileUrl = `/uploads/${req.file.filename}`;
      const ext = path.extname(req.file.filename).toLowerCase();
      if (ext === '.pdf') {
        finalContentType = 'pdf';
      } else if (['.mp4', '.mov', '.avi'].includes(ext)) {
        finalContentType = 'video';
      }
    }

    const module = new Module({
      title,
      description,
      fileUrl: fileUrl || undefined,
      contentType: finalContentType,
      createdBy: req.user._id
    });

    await module.save();
    await module.populate('createdBy', 'name email');

    res.status(201).json(module);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   PUT /api/modules/:id
// @desc    Update a module
// @access  Private (Admin only)
router.put('/:id', authenticate, isAdmin, upload.single('file'), async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);
    
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    const { title, description, contentType } = req.body;

    if (title) module.title = title;
    if (description) module.description = description;
    if (contentType) module.contentType = contentType;

    if (req.file) {
      // Delete old file if exists
      if (module.fileUrl) {
        const oldFilePath = path.join(__dirname, '..', module.fileUrl);
        if (fs.existsSync(oldFilePath)) {
          fs.unlinkSync(oldFilePath);
        }
      }
      
      module.fileUrl = `/uploads/${req.file.filename}`;
      const ext = path.extname(req.file.filename).toLowerCase();
      if (ext === '.pdf') {
        module.contentType = 'pdf';
      } else if (['.mp4', '.mov', '.avi'].includes(ext)) {
        module.contentType = 'video';
      }
    }

    await module.save();
    await module.populate('createdBy', 'name email');

    res.json(module);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route   DELETE /api/modules/:id
// @desc    Delete a module
// @access  Private (Admin only)
router.delete('/:id', authenticate, isAdmin, async (req, res) => {
  try {
    const module = await Module.findById(req.params.id);
    
    if (!module) {
      return res.status(404).json({ message: 'Module not found' });
    }

    // Delete associated file if exists
    if (module.fileUrl) {
      const filePath = path.join(__dirname, '..', module.fileUrl);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Module.findByIdAndDelete(req.params.id);

    res.json({ message: 'Module deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

