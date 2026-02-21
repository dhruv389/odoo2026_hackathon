import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    trip: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trip",
      required: true,
    },

    driverName: {
      type: String,
      required: true,
    },

    distance: {
      type: Number,
      required: true,
    },

    fuelCost: {
      type: Number,
      default: 0,
    },

    miscExpense: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: ["pending", "done"],
      default: "done",
    },
  },
  { timestamps: true }
);

const Expense = mongoose.model("Expense", expenseSchema);
export default Expense;