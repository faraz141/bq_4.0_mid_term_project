// routes/bookingRoutes.js
const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const authMiddleware = require("../middlewares/authMiddleware");
const isAdmin = require("../middlewares/adminRole");

router.post("/api/bookings", authMiddleware, bookingController.bookSeats); // Updated to accept seatNumbers
router.get(
  "/api/bookings/me",
  authMiddleware,
  bookingController.getUserBookings
);
router.get(
  "/api/bookings/event/:eventId",
  authMiddleware,
  isAdmin,
  bookingController.getEventBookings
);
router.delete(
  "/api/bookings/:bookingId",
  authMiddleware,
  bookingController.cancelBooking
);
router.put(
  "/api/bookings/:bookingId/status",
  authMiddleware,
  isAdmin,
  bookingController.updateBookingStatus
);

module.exports = router;
