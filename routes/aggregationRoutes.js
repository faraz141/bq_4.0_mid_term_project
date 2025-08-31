const express = require("express");
const router = express.Router();
const bookingController = require("../utils/aggregationPipline"); // ✅ Path corrected
const authMiddleware = require("../middleware/authMiddleware");

// 🔍 Aggregation route for top booked + filters
router.get("/top-events", authMiddleware, bookingController.searchTopBookedEvents); // ✅ Use the correct import object

module.exports = router;