const express = require("express");
const router = express.Router();
const eventController = require("../controller/eventController");
const verifyToken = require("../middleware/authMiddleware"); // JWT middleware
const verifyAdmin = require("../middleware/adminRole"); // Role check

// 🔹 Public Routes
router.get("/events", eventController.getEvents);
router.get("/events/:id", eventController.getEventById);
router.get("/events/:id/seats", eventController.getAvailableSeats);

// 🔹 Admin Routes
router.post("/events", verifyToken, verifyAdmin, eventController.createEvent);
router.put(
  "/events/:id",
  verifyToken,
  verifyAdmin,
  eventController.updateEvent
);
router.delete(
  "/events/:id",
  verifyToken,
  verifyAdmin,
  eventController.deleteEvent
);

module.exports = router;
