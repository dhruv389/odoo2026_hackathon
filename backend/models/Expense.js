import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    tripId: {
      type: String,
      required: [true, "Trip ID is required"],
      trim: true,
    },
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
    },
    driver: {
      type: String,
      required: [true, "Driver name is required"],
      trim: true,
    },
    vehicle: {
      type: String,
      required: [true, "Vehicle name is required"],
      trim: true,
    },
    distance: {
      type: Number,
      required: [true, "Distance is required"],
      min: 0,
    },
    liters: {
      type: Number,
      required: [true, "Fuel liters is required"],
      min: 0,
    },
    cost: {
      type: Number,
      required: [true, "Cost is required"],
      min: 0,
    },
    date: {
      type: Date,
      required: [true, "Date is required"],
    },
  },
  { timestamps: true }
);

const Expense = mongoose.model("Expense", expenseSchema);
export default Expense;