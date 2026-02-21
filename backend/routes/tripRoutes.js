import express from "express";
import {
  createTrip,
  getTrips,
  updateTripStatus,
} from "../controllers/tripController.js";

const router = express.Router();

router.post("/", createTrip);
router.get("/", getTrips);
router.put("/:id/status", updateTripStatus);

export default router;