import Vehicle from "../models/Vehicle.js";
import Driver from "../models/Driver.js";

// CREATE VEHICLE
export const createVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.create(req.body);
    res.status(201).json({ success: true, data: vehicle });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "License plate already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

// GET ALL VEHICLES
export const getVehicles = async (req, res) => {
  try {
    const { type, status, search } = req.query;
    let query = {};

    if (type && type !== "All") {
      query.type = type;
    }

    if (status && status !== "All") {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { plate: { $regex: search, $options: "i" } },
      ];
    }

    const vehicles = await Vehicle.find(query).populate("driver", "name");
    res.status(200).json({ success: true, data: vehicles });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE VEHICLE
export const getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id).populate(
      "driver",
      "name license"
    );

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.status(200).json({ success: true, data: vehicle });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE VEHICLE
export const updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    res.status(200).json({ success: true, data: vehicle });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "License plate already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

// DELETE VEHICLE
export const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    // Check if vehicle is currently on a trip
    if (vehicle.status === "On Trip") {
      return res.status(400).json({
        message: "Cannot delete vehicle that is currently on a trip",
      });
    }

    // If vehicle has a driver assigned, unassign
    if (vehicle.driver) {
      await Driver.findByIdAndUpdate(vehicle.driver, {
        vehicle: null,
        status: "Off Duty",
      });
    }

    await vehicle.deleteOne();

    res
      .status(200)
      .json({ success: true, message: "Vehicle deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET AVAILABLE VEHICLES (for trip dispatcher)
export const getAvailableVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ status: "Available" });
    res.status(200).json({ success: true, data: vehicles });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE VEHICLE STATUS
export const updateVehicleStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const vehicle = await Vehicle.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    vehicle.status = status;
    await vehicle.save();

    res.status(200).json({ success: true, data: vehicle });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};