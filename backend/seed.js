import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "./models/User.js";
import Vehicle from "./models/Vehicle.js";
import Driver from "./models/Driver.js";
import Trip from "./models/Trip.js";
import Maintenance from "./models/Maintenance.js";
import Expense from "./models/Expense.js";
import connectDB from "./config/db.js";

dotenv.config();

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    console.log("🗑️  Clearing existing data...");
    await User.deleteMany();
    await Vehicle.deleteMany();
    await Driver.deleteMany();
    await Trip.deleteMany();
    await Maintenance.deleteMany();
    await Expense.deleteMany();

    // Create Users
    console.log("👤 Creating users...");
    const users = await User.create([
      {
        name: "Admin User",
        email: "admin@fleetflow.io",
        password: "fleet2024",
        role: "admin",
      },
      {
        name: "Fleet Manager",
        email: "manager@fleetflow.io",
        password: "fleet2024",
        role: "fleet_manager",
      },
      {
        name: "Dispatcher",
        email: "dispatcher@fleetflow.io",
        password: "fleet2024",
        role: "dispatcher",
      },
    ]);
    console.log(`✅ Created ${users.length} users`);

    // Create Vehicles
    console.log("🚛 Creating vehicles...");
    const vehicles = await Vehicle.create([
      {
        name: "Titan Hauler Pro",
        plate: "MH-01-2024",
        type: "Truck",
        capacity: 8000,
        odometer: 84320,
        fuel: "Diesel",
        status: "Available",
        acquisitionCost: 2500000,
      },
      {
        name: "Swift Van Elite",
        plate: "MH-02-2031",
        type: "Van",
        capacity: 1500,
        odometer: 42100,
        fuel: "Petrol",
        status: "Available",
        acquisitionCost: 800000,
      },
      {
        name: "Atlas Freight X",
        plate: "MH-03-1998",
        type: "Truck",
        capacity: 12000,
        odometer: 120450,
        fuel: "Diesel",
        status: "Available",
        acquisitionCost: 3200000,
      },
      {
        name: "Echo Cargo Van",
        plate: "GJ-01-5544",
        type: "Van",
        capacity: 2000,
        odometer: 31200,
        fuel: "CNG",
        status: "Available",
        acquisitionCost: 900000,
      },
      {
        name: "Nova Express",
        plate: "GJ-02-7721",
        type: "Truck",
        capacity: 6000,
        odometer: 55800,
        fuel: "Diesel",
        status: "Available",
        acquisitionCost: 2200000,
      },
      {
        name: "Blaze Bike Courier",
        plate: "MH-05-3310",
        type: "Bike",
        capacity: 50,
        odometer: 18900,
        fuel: "Petrol",
        status: "Available",
        acquisitionCost: 150000,
      },
    ]);
    console.log(`✅ Created ${vehicles.length} vehicles`);

    // Create Drivers
    console.log("👨‍✈️ Creating drivers...");
    const drivers = await Driver.create([
      {
        name: "John Mercer",
        license: "MH20230045",
        expiry: new Date("2026-04-10"),
        category: "HMV",
        trips: 142,
        completed: 138,
        safety: 94,
        status: "Off Duty",
      },
      {
        name: "Sarah Chen",
        license: "GJ20210078",
        expiry: new Date("2025-11-22"),
        category: "HMV",
        trips: 98,
        completed: 96,
        safety: 98,
        status: "Off Duty",
      },
      {
        name: "Marcus Webb",
        license: "MH20190031",
        expiry: new Date("2024-08-15"),
        category: "LMV",
        trips: 67,
        completed: 60,
        safety: 78,
        status: "Suspended",
      },
      {
        name: "Priya Nair",
        license: "KA20220099",
        expiry: new Date("2027-01-30"),
        category: "LMV",
        trips: 201,
        completed: 199,
        safety: 99,
        status: "Off Duty",
      },
      {
        name: "Dev Kapoor",
        license: "MH20230112",
        expiry: new Date("2026-07-19"),
        category: "HMV",
        trips: 55,
        completed: 53,
        safety: 91,
        status: "Off Duty",
      },
    ]);
    console.log(`✅ Created ${drivers.length} drivers`);

    // Create some completed trips
    console.log("🚚 Creating trips...");
    const trips = await Trip.create([
      {
        vehicle: vehicles[3]._id,
        driver: drivers[3]._id,
        cargo: 1800,
        origin: "Delhi Hub",
        destination: "Gurgaon Zone B",
        distance: "42 km",
        fuel: "₹980",
        status: "Completed",
        date: new Date("2024-02-20"),
      },
      {
        vehicle: vehicles[1]._id,
        driver: drivers[4]._id,
        cargo: 1200,
        origin: "Pune Hub",
        destination: "Nashik Center",
        distance: "210 km",
        fuel: "₹1,600",
        status: "Completed",
        date: new Date("2024-02-19"),
      },
    ]);
    console.log(`✅ Created ${trips.length} trips`);

    // Create Maintenance Logs
    console.log("🔧 Creating maintenance logs...");
    const maintenance = await Maintenance.create([
      {
        vehicle: vehicles[0]._id,
        type: "Tyre Replacement",
        date: new Date("2024-02-10"),
        cost: 12000,
        tech: "QuickFix Motors",
        status: "Completed",
      },
      {
        vehicle: vehicles[4]._id,
        type: "Oil Change + Filter",
        date: new Date("2024-02-05"),
        cost: 3500,
        tech: "FastLane Service",
        status: "Completed",
      },
      {
        vehicle: vehicles[3]._id,
        type: "Brake Pad Replacement",
        date: new Date("2024-01-28"),
        cost: 8200,
        tech: "PitStop Garage",
        status: "Completed",
      },
    ]);
    console.log(`✅ Created ${maintenance.length} maintenance logs`);

    // Create Expenses
    console.log("💰 Creating expenses...");
    const expenses = await Expense.create([
      {
        tripId: "TR-2400",
        trip: trips[0]._id,
        driver: "Priya Nair",
        vehicle: "Echo Cargo Van",
        distance: 42,
        liters: 8,
        cost: 980,
        date: new Date("2024-02-20"),
      },
      {
        tripId: "TR-2399",
        trip: trips[1]._id,
        driver: "Dev Kapoor",
        vehicle: "Swift Van Elite",
        distance: 210,
        liters: 18,
        cost: 1600,
        date: new Date("2024-02-19"),
      },
    ]);
    console.log(`✅ Created ${expenses.length} expenses`);

    console.log("\n🎉 Database seeded successfully!");
    console.log("\n📝 Login Credentials:");
    console.log("   Admin: admin@fleetflow.io / fleet2024");
    console.log("   Manager: manager@fleetflow.io / fleet2024");
    console.log("   Dispatcher: dispatcher@fleetflow.io / fleet2024");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

seedData();
