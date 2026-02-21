import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: true,
    },

    driver: {
      type: String, // we simplify for now
      required: true,
    },

    cargoWeight: {
      type: Number,
      required: true,
    },

    origin: {
      type: String,
      required: true,
    },

    destination: {
      type: String,
      required: true,
    },

    estimatedFuelCost: {
      type: Number,
      required: true,
    },

    distance: {
      type: Number, // used later in expense calculation
    },

    status: {
      type: String,
      enum: ["draft", "dispatched", "on_way", "completed", "cancelled"],
      default: "draft",
    },
  },
  { timestamps: true }
);

const Trip = mongoose.model("Trip", tripSchema);
export default Trip;