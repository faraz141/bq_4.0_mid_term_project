const express = require('express');
const { body } = require('express-validator');
const { protect, isAdmin } = require('../middlewares/auth');
const { uploadEventBanner } = require('../middlewares/upload');
const {
  createEvent,
  getAllEvents,
  getEvent,
  updateEvent,
  deleteEvent,
  getEventsByCategory
} = require('../controllers/eventController');

const router = express.Router();

// Validation middleware
const validateEvent = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('date')
    .isISO8601()
    .withMessage('Please provide a valid date'),
  body('venue')
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Venue must be between 3 and 200 characters'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('totalSeats')
    .isInt({ min: 1 })
    .withMessage('Total seats must be a positive integer'),
  body('category')
    .isIn(['concert', 'conference', 'workshop', 'sports', 'theater', 'other'])
    .withMessage('Invalid category')
];

const validateEventUpdate = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date'),
  body('venue')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Venue must be between 3 and 200 characters'),
  body('price')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),
  body('totalSeats')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Total seats must be a positive integer'),
  body('category')
    .optional()
    .isIn(['concert', 'conference', 'workshop', 'sports', 'theater', 'other'])
    .withMessage('Invalid category'),
  body('status')
    .optional()
    .isIn(['active', 'cancelled', 'completed'])
    .withMessage('Invalid status')
];

// Public routes
router.get('/', getAllEvents);
router.get('/category/:category', getEventsByCategory);
router.get('/:id', getEvent);

// Protected routes (Admin only)
router.post('/', protect, isAdmin, validateEvent, uploadEventBanner, createEvent);
router.put('/:id', protect, isAdmin, validateEventUpdate, uploadEventBanner, updateEvent);
router.delete('/:id', protect, isAdmin, deleteEvent);

module.exports = router;
