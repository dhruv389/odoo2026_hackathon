import Expense from "../models/Expense.js";
import Trip from "../models/Trip.js";

// CREATE EXPENSE
export const createExpense = async (req, res) => {
  try {
    const { tripId, driver, vehicle, distance, liters, cost, date } = req.body;

    // Optional: Verify trip exists if tripId is provided
    if (tripId) {
      const trip = await Trip.findOne({ _id: tripId });
      if (trip) {
        req.body.trip = trip._id;
      }
    }

    const expense = await Expense.create(req.body);

    res.status(201).json({ success: true, data: expense });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL EXPENSES
export const getExpenses = async (req, res) => {
  try {
    const { vehicle, driver, startDate, endDate } = req.query;
    let query = {};

    if (vehicle) {
      query.vehicle = { $regex: vehicle, $options: "i" };
    }

    if (driver) {
      query.driver = { $regex: driver, $options: "i" };
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const expenses = await Expense.find(query)
      .populate("trip", "origin destination status")
      .sort({ date: -1 });

    res.status(200).json({ success: true, data: expenses });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SINGLE EXPENSE
export const getExpenseById = async (req, res) => {
  try {
    const expense = await Expense.findById(req.params.id).populate("trip");

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json({ success: true, data: expense });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE EXPENSE
export const updateExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res.status(200).json({ success: true, data: expense });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// DELETE EXPENSE
export const deleteExpense = async (req, res) => {
  try {
    const expense = await Expense.findByIdAndDelete(req.params.id);

    if (!expense) {
      return res.status(404).json({ message: "Expense not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Expense deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET EXPENSE SUMMARY
export const getExpenseSummary = async (req, res) => {
  try {
    const expenses = await Expense.find();

    const summary = {
      totalCost: expenses.reduce((sum, exp) => sum + exp.cost, 0),
      totalLiters: expenses.reduce((sum, exp) => sum + exp.liters, 0),
      totalDistance: expenses.reduce((sum, exp) => sum + exp.distance, 0),
      avgEfficiency:
        expenses.length > 0
          ? expenses.reduce((sum, exp) => sum + exp.distance / exp.liters, 0) /
            expenses.length
          : 0,
      count: expenses.length,
    };

    res.status(200).json({ success: true, data: summary });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET EXPENSES BY VEHICLE
export const getExpensesByVehicle = async (req, res) => {
  try {
    const expenses = await Expense.find();

    // Group by vehicle
    const vehicleExpenses = expenses.reduce((acc, exp) => {
      if (!acc[exp.vehicle]) {
        acc[exp.vehicle] = {
          vehicle: exp.vehicle,
          totalCost: 0,
          totalLiters: 0,
          totalDistance: 0,
          count: 0,
        };
      }
      acc[exp.vehicle].totalCost += exp.cost;
      acc[exp.vehicle].totalLiters += exp.liters;
      acc[exp.vehicle].totalDistance += exp.distance;
      acc[exp.vehicle].count += 1;
      return acc;
    }, {});

    const result = Object.values(vehicleExpenses);

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
