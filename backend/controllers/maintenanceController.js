import Maintenance from "../models/Maintenance.js";
import Vehicle from "../models/Vehicle.js";

// CREATE MAINTENANCE LOG
export const createMaintenance = async (req, res) => {
  try {
    const { vehicle, type, date, cost, tech, notes } = req.body;

    // Find vehicle
    const vehicleData = await Vehicle.findById(vehicle);

    if (!vehicleData) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    // Create maintenance log
    const maintenance = await Maintenance.create({
      vehicle,
      type,
      date,
      cost,
      tech,
      notes,
      status: "In Progress",
    });

    // AUTO: Update vehicle status to "In Shop"
    vehicleData.status = "In Shop";
    await vehicleData.save();

    const populated = await Maintenance.findById(maintenance._id).populate(
      "vehicle",
      "name plate type"
    );

    res.status(201).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL MAINTENANCE LOGS
export const getMaintenanceLogs = async (req, res) => {
  try {
    const { status, vehicleId } = req.query;
    let query = {};

    if (status && status !== "All") {
      query.status = status;
    }

    if (vehicleId) {
      query.vehicle = vehicleId;
    }

    const logs = await Maintenance.find(query)
      .populate("vehicle", "name plate type")
      .sort({ date: -1 });

    res.status(200).json({ success: true, data: logs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE MAINTENANCE LOG
export const getMaintenanceById = async (req, res) => {
  try {
    const maintenance = await Maintenance.findById(req.params.id).populate(
      "vehicle"
    );

    if (!maintenance) {
      return res.status(404).json({ message: "Maintenance log not found" });
    }

    res.status(200).json({ success: true, data: maintenance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE MAINTENANCE LOG
export const updateMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate("vehicle", "name plate");

    if (!maintenance) {
      return res.status(404).json({ message: "Maintenance log not found" });
    }

    res.status(200).json({ success: true, data: maintenance });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// MARK MAINTENANCE AS COMPLETED
export const completeMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.findById(req.params.id);

    if (!maintenance) {
      return res.status(404).json({ message: "Maintenance log not found" });
    }

    const oldStatus = maintenance.status;
    maintenance.status = "Completed";
    await maintenance.save();

    // AUTO: If maintenance completed, return vehicle to "Available" status
    if (oldStatus !== "Completed") {
      const vehicle = await Vehicle.findById(maintenance.vehicle);
      if (vehicle && vehicle.status === "In Shop") {
        vehicle.status = "Available";
        await vehicle.save();
      }
    }

    const populated = await Maintenance.findById(maintenance._id).populate(
      "vehicle",
      "name plate"
    );

    res.status(200).json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE MAINTENANCE LOG
export const deleteMaintenance = async (req, res) => {
  try {
    const maintenance = await Maintenance.findById(req.params.id);

    if (!maintenance) {
      return res.status(404).json({ message: "Maintenance log not found" });
    }

    // If maintenance was in progress, return vehicle to available
    if (maintenance.status === "In Progress") {
      const vehicle = await Vehicle.findById(maintenance.vehicle);
      if (vehicle && vehicle.status === "In Shop") {
        vehicle.status = "Available";
        await vehicle.save();
      }
    }

    await maintenance.deleteOne();

    res
      .status(200)
      .json({ success: true, message: "Maintenance log deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET MAINTENANCE SUMMARY
export const getMaintenanceSummary = async (req, res) => {
  try {
    const logs = await Maintenance.find();

    const summary = {
      totalCost: logs.reduce((sum, log) => sum + log.cost, 0),
      inProgress: logs.filter((log) => log.status === "In Progress").length,
      completed: logs.filter((log) => log.status === "Completed").length,
      total: logs.length,
    };

    res.status(200).json({ success: true, data: summary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
