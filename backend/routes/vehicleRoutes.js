import express from "express";
import {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  getAvailableVehicles,
  updateVehicleStatus,
} from "../controllers/vehicleController.js";

const router = express.Router();

// All routes can be public for now, add protect middleware later if needed
router.get("/available", getAvailableVehicles);
router.post("/", createVehicle);
router.get("/", getVehicles);
router.get("/:id", getVehicleById);
router.put("/:id", updateVehicle);
router.put("/:id/status", updateVehicleStatus);
router.delete("/:id", deleteVehicle);

export default router;
