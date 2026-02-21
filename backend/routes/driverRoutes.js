import express from "express";
import {
  createDriver,
  getDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
  getAvailableDrivers,
  updateDriverStatus,
  getDriversWithLicenseAlerts,
} from "../controllers/driverController.js";

const router = express.Router();

router.get("/available", getAvailableDrivers);
router.get("/license-alerts", getDriversWithLicenseAlerts);
router.post("/", createDriver);
router.get("/", getDrivers);
router.get("/:id", getDriverById);
router.put("/:id", updateDriver);
router.put("/:id/status", updateDriverStatus);
router.delete("/:id", deleteDriver);

export default router;
