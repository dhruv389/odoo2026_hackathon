import Vehicle from "../models/Vehicle.js";
import Trip from "../models/Trip.js";
import Expense from "../models/Expense.js";
import Maintenance from "../models/Maintenance.js";
import Driver from "../models/Driver.js";

// GET DASHBOARD STATS
export const getDashboardStats = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    const trips = await Trip.find();
    const drivers = await Driver.find();

    const activeFleet = vehicles.filter((v) => v.status === "On Trip").length;
    const inShop = vehicles.filter((v) => v.status === "In Shop").length;
    const available = vehicles.filter((v) => v.status === "Available").length;
    const utilization = Math.round((activeFleet / vehicles.length) * 100) || 0;

    const pendingCargo = trips.filter((t) => t.status === "Draft").length;
    const dispatchedTrips = trips.filter((t) => t.status === "Dispatched")
      .length;
    const completedTrips = trips.filter((t) => t.status === "Completed").length;

    const onDutyDrivers = drivers.filter((d) => d.status === "On Duty").length;
    const suspendedDrivers = drivers.filter((d) => d.status === "Suspended")
      .length;

    res.status(200).json({
      success: true,
      data: {
        fleet: {
          total: vehicles.length,
          active: activeFleet,
          available,
          inShop,
          utilization,
        },
        trips: {
          pending: pendingCargo,
          dispatched: dispatchedTrips,
          completed: completedTrips,
          total: trips.length,
        },
        drivers: {
          total: drivers.length,
          onDuty: onDutyDrivers,
          suspended: suspendedDrivers,
        },
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ANALYTICS DATA
export const getAnalytics = async (req, res) => {
  try {
    const expenses = await Expense.find();
    const maintenance = await Maintenance.find();
    const vehicles = await Vehicle.find();

    // Calculate totals
    const totalFuelCost = expenses.reduce((sum, exp) => sum + exp.cost, 0);
    const totalMaintenanceCost = maintenance.reduce(
      (sum, m) => sum + m.cost,
      0
    );

    // Fuel efficiency by vehicle
    const fuelEfficiency = vehicles.map((v) => {
      const vehicleExpenses = expenses.filter((e) => e.vehicle === v.name);
      const totalDistance = vehicleExpenses.reduce(
        (sum, e) => sum + e.distance,
        0
      );
      const totalLiters = vehicleExpenses.reduce((sum, e) => sum + e.liters, 0);
      const efficiency = totalLiters > 0 ? totalDistance / totalLiters : 0;

      return {
        vehicle: v.name,
        efficiency: parseFloat(efficiency.toFixed(2)),
      };
    });

    // Monthly data (mock for now - in production, aggregate by month)
    const monthlyData = [
      { month: "Sep", revenue: 820000, fuel: 142000, maintenance: 38000 },
      { month: "Oct", revenue: 940000, fuel: 156000, maintenance: 52000 },
      { month: "Nov", revenue: 880000, fuel: 148000, maintenance: 29000 },
      { month: "Dec", revenue: 1120000, fuel: 198000, maintenance: 63000 },
      { month: "Jan", revenue: 1050000, fuel: 172000, maintenance: 41000 },
      { month: "Feb", revenue: 1340000, fuel: 210000, maintenance: 48000 },
    ];

    res.status(200).json({
      success: true,
      data: {
        summary: {
          totalFuelCost,
          totalMaintenanceCost,
          totalOperationalCost: totalFuelCost + totalMaintenanceCost,
        },
        fuelEfficiency: fuelEfficiency.filter((f) => f.efficiency > 0),
        monthly: monthlyData,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET VEHICLE ROI
export const getVehicleROI = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    const expenses = await Expense.find();
    const maintenance = await Maintenance.find();

    const vehicleROI = await Promise.all(
      vehicles.map(async (v) => {
        const vehicleExpenses = expenses.filter((e) => e.vehicle === v.name);
        const vehicleMaintenance = maintenance.filter(
          (m) => m.vehicle.toString() === v._id.toString()
        );

        const fuelCost = vehicleExpenses.reduce((sum, e) => sum + e.cost, 0);
        const maintenanceCost = vehicleMaintenance.reduce(
          (sum, m) => sum + m.cost,
          0
        );
        const totalCost = fuelCost + maintenanceCost;

        // Mock revenue calculation (in production, calculate from completed trips)
        const revenue = totalCost * 1.5; // Assume 50% profit margin

        const roi =
          v.acquisitionCost > 0
            ? ((revenue - totalCost) / v.acquisitionCost) * 100
            : 0;

        return {
          vehicle: v.name,
          revenue,
          fuelCost,
          maintenanceCost,
          totalCost,
          acquisitionCost: v.acquisitionCost,
          roi: parseFloat(roi.toFixed(2)),
        };
      })
    );

    res.status(200).json({ success: true, data: vehicleROI });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
