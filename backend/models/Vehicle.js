import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Vehicle name is required"],
      trim: true,
    },
    plate: {
      type: String,
      required: [true, "License plate is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    type: {
      type: String,
      enum: ["Truck", "Van", "Bike"],
      required: true,
    },
    capacity: {
      type: Number,
      required: [true, "Max capacity is required"],
    },
    odometer: {
      type: Number,
      default: 0,
    },
    fuel: {
      type: String,
      enum: ["Diesel", "Petrol", "CNG", "Electric"],
      default: "Diesel",
    },
    acquisitionCost: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["Available", "On Trip", "In Shop", "Retired"],
      default: "Available",
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
      default: null,
    },
  },
  { timestamps: true }
);

const Vehicle = mongoose.model("Vehicle", vehicleSchema);
export default Vehicle;