const express = require("express");
const router = express.Router();
const bookingController = require("../controller/bookingController");
const auth = require("../middleware/authMiddleware");
const verifyAdmin = require("../middleware/adminRole");

router.post("/event/:eventId/book", auth, bookingController.bookSeats);
router.get("/bookings", auth, verifyAdmin, bookingController.getUserBookings);

router.delete("/bookings/:bookingId", auth, bookingController.cancelBooking);

router.put(
  "/bookings/:bookingId/status",
  auth,
  verifyAdmin,
  bookingController.updateBookingStatus
);

router.get('/my-bookings', auth, bookingController.getBookings);

module.exports = router;
