import express from "express";
import {
  createMaintenance,
  getMaintenances,
  updateMaintenanceStatus,
  deleteMaintenance,
} from "../controllers/maintenanceController.js";

const router = express.Router();

router.post("/", createMaintenance);
router.get("/", getMaintenances);
router.put("/:id/status", updateMaintenanceStatus);
router.delete("/:id", deleteMaintenance);

export default router;