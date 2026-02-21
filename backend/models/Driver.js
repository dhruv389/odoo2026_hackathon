import mongoose from "mongoose";

const driverSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Driver name is required"],
      trim: true,
    },
    license: {
      type: String,
      required: [true, "License number is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    expiry: {
      type: Date,
      required: [true, "License expiry date is required"],
    },
    category: {
      type: String,
      enum: ["LMV", "HMV", "HPMV", "TRANS"],
      required: true,
    },
    trips: {
      type: Number,
      default: 0,
    },
    completed: {
      type: Number,
      default: 0,
    },
    safety: {
      type: Number,
      default: 95,
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      enum: ["On Duty", "Off Duty", "Suspended"],
      default: "Off Duty",
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      default: null,
    },
  },
  { timestamps: true }
);

// Check if license is expired
driverSchema.methods.isLicenseExpired = function () {
  return new Date(this.expiry) < new Date();
};

// Check if license is expiring soon (within 30 days)
driverSchema.methods.isLicenseExpiringSoon = function () {
  const daysUntilExpiry = Math.ceil(
    (new Date(this.expiry) - new Date()) / (1000 * 60 * 60 * 24)
  );
  return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
};

const Driver = mongoose.model("Driver", driverSchema);
export default Driver;
