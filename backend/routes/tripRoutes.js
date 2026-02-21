import express from "express";
import {
  createTrip,
  getTrips,
  getTripById,
  updateTripStatus,
  deleteTrip,
} from "../controllers/tripController.js";

const router = express.Router();

router.post("/", createTrip);
router.get("/", getTrips);
router.get("/:id", getTripById);
router.put("/:id/status", updateTripStatus);
router.delete("/:id", deleteTrip);

export default router;
