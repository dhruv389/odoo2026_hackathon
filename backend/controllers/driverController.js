import Driver from "../models/Driver.js";
import Vehicle from "../models/Vehicle.js";

// CREATE DRIVER
export const createDriver = async (req, res) => {
  try {
    const driver = await Driver.create(req.body);
    res.status(201).json({ success: true, data: driver });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "License number already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

// GET ALL DRIVERS
export const getDrivers = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status && status !== "All") {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { license: { $regex: search, $options: "i" } },
      ];
    }

    const drivers = await Driver.find(query).populate("vehicle", "name plate");
    res.status(200).json({ success: true, data: drivers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE DRIVER
export const getDriverById = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id).populate(
      "vehicle",
      "name plate type"
    );

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.status(200).json({ success: true, data: driver });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE DRIVER
export const updateDriver = async (req, res) => {
  try {
    const driver = await Driver.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    res.status(200).json({ success: true, data: driver });
  } catch (error) {
    if (error.code === 11000) {
      return res
        .status(400)
        .json({ message: "License number already exists" });
    }
    res.status(500).json({ message: error.message });
  }
};

// DELETE DRIVER
export const deleteDriver = async (req, res) => {
  try {
    const driver = await Driver.findById(req.params.id);

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    // Check if driver is currently on duty
    if (driver.status === "On Duty") {
      return res.status(400).json({
        message: "Cannot delete driver who is currently on duty",
      });
    }

    // If driver has a vehicle assigned, unassign
    if (driver.vehicle) {
      await Vehicle.findByIdAndUpdate(driver.vehicle, { driver: null });
    }

    await driver.deleteOne();

    res
      .status(200)
      .json({ success: true, message: "Driver deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET AVAILABLE DRIVERS (for trip dispatcher)
export const getAvailableDrivers = async (req, res) => {
  try {
    const drivers = await Driver.find({
      status: { $in: ["Off Duty", "Available"] },
    });

    // Filter out drivers with expired licenses
    const validDrivers = drivers.filter((d) => !d.isLicenseExpired());

    res.status(200).json({ success: true, data: validDrivers });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE DRIVER STATUS
export const updateDriverStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const driver = await Driver.findById(req.params.id);

    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    // If changing from On Duty to Off Duty, clear vehicle assignment
    if (driver.status === "On Duty" && status === "Off Duty") {
      if (driver.vehicle) {
        await Vehicle.findByIdAndUpdate(driver.vehicle, {
          driver: null,
          status: "Available",
        });
        driver.vehicle = null;
      }
    }

    driver.status = status;
    await driver.save();

    res.status(200).json({ success: true, data: driver });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET DRIVERS WITH LICENSE ALERTS
export const getDriversWithLicenseAlerts = async (req, res) => {
  try {
    const drivers = await Driver.find();

    const alerts = drivers.filter(
      (d) => d.isLicenseExpired() || d.isLicenseExpiringSoon()
    );

    res.status(200).json({ success: true, data: alerts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
