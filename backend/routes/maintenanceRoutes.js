import express from "express";
import {
  createMaintenance,
  getMaintenanceLogs,
  getMaintenanceById,
  updateMaintenance,
  completeMaintenance,
  deleteMaintenance,
  getMaintenanceSummary,
} from "../controllers/maintenanceController.js";

const router = express.Router();

router.get("/summary", getMaintenanceSummary);
router.post("/", createMaintenance);
router.get("/", getMaintenanceLogs);
router.get("/:id", getMaintenanceById);
router.put("/:id", updateMaintenance);
router.put("/:id/complete", completeMaintenance);
router.delete("/:id", deleteMaintenance);

export default router;
