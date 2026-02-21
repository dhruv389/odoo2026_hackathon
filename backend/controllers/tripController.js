import Trip from "../models/Trip.js";
import Vehicle from "../models/Vehicle.js";

// CREATE & DISPATCH TRIP
export const createTrip = async (req, res) => {
  try {
    const {
      vehicle,
      driver,
      cargoWeight,
      origin,
      destination,
      estimatedFuelCost,
      distance,
    } = req.body;

    const vehicleData = await Vehicle.findById(vehicle);

    if (!vehicleData) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    // 🔥 RULE 1: Vehicle must be available
    if (vehicleData.status !== "available") {
      return res.status(400).json({ message: "Vehicle not available" });
    }

    // 🔥 RULE 2: Cargo weight must not exceed capacity
    if (cargoWeight > vehicleData.maxCapacity) {
      return res.status(400).json({ message: "Cargo exceeds vehicle capacity" });
    }

    const trip = await Trip.create({
      vehicle,
      driver,
      cargoWeight,
      origin,
      destination,
      estimatedFuelCost,
      distance,
      status: "dispatched",
    });

    // 🔥 AUTO: Mark vehicle as on_trip
    vehicleData.status = "on_trip";
    await vehicleData.save();

    res.status(201).json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL TRIPS
export const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find().populate("vehicle");
    res.status(200).json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE TRIP STATUS
export const updateTripStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    trip.status = status;
    await trip.save();

    // 🔥 If trip completed → vehicle becomes available
    if (status === "completed") {
      const vehicle = await Vehicle.findById(trip.vehicle);
      vehicle.status = "available";
      await vehicle.save();
    }

    res.status(200).json(trip);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};