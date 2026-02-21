import mongoose from "mongoose";

const maintenanceSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: [true, "Vehicle is required"],
    },
    type: {
      type: String,
      required: [true, "Service type is required"],
      trim: true,
    },
    date: {
      type: Date,
      required: [true, "Service date is required"],
    },
    cost: {
      type: Number,
      required: [true, "Cost is required"],
      min: 0,
    },
    tech: {
      type: String,
      required: [true, "Technician/Workshop is required"],
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ["In Progress", "Completed"],
      default: "In Progress",
    },
  },
  { timestamps: true }
);

const Maintenance = mongoose.model("Maintenance", maintenanceSchema);
export default Maintenance;