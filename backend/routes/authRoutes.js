import express from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  getAllUsers,
} from "../controllers/authController.js";
import { protect, authorize } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/register", registerUser);
router.post("/signup", registerUser);
router.post("/login", loginUser);

// Protected routes
router.get("/me", protect, getCurrentUser);
router.get("/users", protect, authorize("admin", "fleet_manager"), getAllUsers);

export default router;
