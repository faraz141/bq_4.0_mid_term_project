// routes/eventRoutes.js
const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const authMiddleware = require("../middlewares/authMiddleware");
const isAdmin = require("../middlewares/adminRole");

// Public Routes
router.get("/api/events", eventController.getEvents);
router.get("/api/events/:id", eventController.getEventById);
router.get("/api/events/:id/seats", eventController.getAvailableSeats);

// Admin Routes
router.post(
  "/api/events",
  authMiddleware,
  isAdmin,
  eventController.createEvent
);
router.put(
  "/api/events/:id",
  authMiddleware,
  isAdmin,
  eventController.updateEvent
);
router.delete(
  "/api/events/:id",
  authMiddleware,
  isAdmin,
  eventController.deleteEvent
);

module.exports = router;
