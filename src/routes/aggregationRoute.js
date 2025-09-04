// routes/aggregationRoutes.js
const express = require("express");
const router = express.Router();
const aggregationController = require("../utils/aggregationPipeline");
const authMiddleware = require("../middlewares/authMiddleware");
const isAdmin = require("../middlewares/adminRole");

router.get(
  "/api/admin/analytics/popular-events",
  authMiddleware,
  isAdmin,
  aggregationController.getPopularEvents
);
router.get(
  "/api/admin/analytics/revenue",
  authMiddleware,
  isAdmin,
  aggregationController.getRevenue
);
router.get(
  "/api/admin/analytics/top-users",
  authMiddleware,
  isAdmin,
  aggregationController.getTopUsers
);

module.exports = router;
