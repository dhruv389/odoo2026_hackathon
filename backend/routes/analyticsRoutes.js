import express from "express";
import {
  getDashboardStats,
  getAnalytics,
  getVehicleROI,
} from "../controllers/analyticsController.js";

const router = express.Router();

router.get("/dashboard", getDashboardStats);
router.get("/", getAnalytics);
router.get("/vehicle-roi", getVehicleROI);

export default router;
