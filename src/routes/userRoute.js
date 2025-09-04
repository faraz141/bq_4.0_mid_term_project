// routes/userRoutes.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

router.post("/api/auth/signup", userController.signUp);
router.post("/api/auth/login", userController.login);
router.get("/api/users/me", authMiddleware, userController.getProfile);
router.put("/api/users/me", authMiddleware, userController.updateProfile);
router.get("/api/users", authMiddleware, userController.getAllUsers); // Admin manage users (view)

module.exports = router;
