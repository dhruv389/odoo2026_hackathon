import Trip from "../models/Trip.js";
import Vehicle from "../models/Vehicle.js";
import Driver from "../models/Driver.js";

// CREATE & DISPATCH TRIP
export const createTrip = async (req, res) => {
  try {
    const { vehicle, driver, cargo, origin, destination, fuel } = req.body;

    // Find vehicle and driver
    const vehicleData = await Vehicle.findById(vehicle);
    const driverData = await Driver.findById(driver);

    if (!vehicleData) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    if (!driverData) {
      return res.status(404).json({ message: "Driver not found" });
    }

    // RULE 1: Vehicle must be available
    if (vehicleData.status !== "Available") {
      return res.status(400).json({
        message: `Vehicle is currently ${vehicleData.status}. Please select an available vehicle.`,
      });
    }

    // RULE 2: Driver must be available (Off Duty or Available)
    if (driverData.status === "On Duty") {
      return res.status(400).json({
        message: "Driver is already on duty. Please select another driver.",
      });
    }

    if (driverData.status === "Suspended") {
      return res.status(400).json({
        message: "Driver is suspended and cannot be assigned to trips.",
      });
    }

    // RULE 3: Check license expiry
    if (driverData.isLicenseExpired()) {
      return res.status(400).json({
        message: `Driver's license has expired. Cannot assign to trip.`,
      });
    }

    // RULE 4: Cargo weight must not exceed vehicle capacity
    if (cargo > vehicleData.capacity) {
      return res.status(400).json({
        message: `Cargo weight (${cargo} kg) exceeds vehicle capacity (${vehicleData.capacity} kg). Please reduce load or choose a larger vehicle.`,
      });
    }

    // Create trip
    const trip = await Trip.create({
      vehicle,
      driver,
      cargo,
      origin,
      destination,
      fuel: fuel || "—",
      status: "Dispatched",
    });

    // AUTO: Update vehicle status to "On Trip"
    vehicleData.status = "On Trip";
    vehicleData.driver = driver;
    await vehicleData.save();

    // AUTO: Update driver status to "On Duty"
    driverData.status = "On Duty";
    driverData.vehicle = vehicle;
    driverData.trips += 1;
    await driverData.save();

    // Populate and return
    const populatedTrip = await Trip.findById(trip._id)
      .populate("vehicle", "name plate type")
      .populate("driver", "name license");

    res.status(201).json({ success: true, data: populatedTrip });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL TRIPS
export const getTrips = async (req, res) => {
  try {
    const { status } = req.query;
    let query = {};

    if (status && status !== "All") {
      query.status = status;
    }

    const trips = await Trip.find(query)
      .populate("vehicle", "name plate type")
      .populate("driver", "name license")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: trips });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE TRIP
export const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate("vehicle")
      .populate("driver");

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    res.status(200).json({ success: true, data: trip });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE TRIP STATUS
export const updateTripStatus = async (req, res) => {
  try {
    const { status, distance, fuel } = req.body;

    const trip = await Trip.findById(req.params.id);
    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    const oldStatus = trip.status;
    trip.status = status;

    if (distance) trip.distance = distance;
    if (fuel) trip.fuel = fuel;

    await trip.save();

    // If trip completed or cancelled → free up vehicle and driver
    if (
      (status === "Completed" || status === "Cancelled") &&
      oldStatus !== status
    ) {
      const vehicle = await Vehicle.findById(trip.vehicle);
      const driver = await Driver.findById(trip.driver);

      if (vehicle) {
        vehicle.status = "Available";
        vehicle.driver = null;
        await vehicle.save();
      }

      if (driver) {
        driver.status = "Off Duty";
        driver.vehicle = null;
        if (status === "Completed") {
          driver.completed += 1;
        }
        await driver.save();
      }
    }

    const populatedTrip = await Trip.findById(trip._id)
      .populate("vehicle", "name plate")
      .populate("driver", "name");

    res.status(200).json({ success: true, data: populatedTrip });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE TRIP
export const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // If trip is dispatched, free up resources
    if (trip.status === "Dispatched") {
      const vehicle = await Vehicle.findById(trip.vehicle);
      const driver = await Driver.findById(trip.driver);

      if (vehicle) {
        vehicle.status = "Available";
        vehicle.driver = null;
        await vehicle.save();
      }

      if (driver) {
        driver.status = "Off Duty";
        driver.vehicle = null;
        driver.trips = Math.max(0, driver.trips - 1);
        await driver.save();
      }
    }

    await trip.deleteOne();

    res
      .status(200)
      .json({ success: true, message: "Trip deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};