import Maintenance from "../models/Maintenance.js";
import Vehicle from "../models/Vehicle.js";

// CREATE MAINTENANCE LOG
export const createMaintenance = async (req, res) => {
  try {
    const { vehicle, issue, date, cost } = req.body;

    const vehicleExists = await Vehicle.findById(vehicle);
    if (!vehicleExists) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    // Create maintenance record
    const maintenance = await Maintenance.create({
      vehicle,
      issue,
      date,
      cost,
    });

    // 🔥 AUTO RULE: Mark vehicle as in_shop
    vehicleExists.status = "in_shop";
    await vehicleExists.save();

    res.status(201).json(maintenance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL MAINTENANCE
export const getMaintenances = async (req, res) => {
  try {
    const logs = await Maintenance.find().populate("vehicle");
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE STATUS (when repair completed)
export const updateMaintenanceStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const maintenance = await Maintenance.findById(req.params.id);

    if (!maintenance) {
      return res.status(404).json({ message: "Log not found" });
    }

    maintenance.status = status;
    await maintenance.save();

    // If completed → vehicle becomes available again
    if (status === "completed") {
      const vehicle = await Vehicle.findById(maintenance.vehicle);
      vehicle.status = "available";
      await vehicle.save();
    }

    res.status(200).json(maintenance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE LOG
export const deleteMaintenance = async (req, res) => {
  try {
    await Maintenance.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Maintenance deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};