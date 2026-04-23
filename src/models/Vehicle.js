const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema(
  {
    vehicle_date: { type: Date, default: Date.now },
    owner_name: { type: String, required: true, trim: true },
    owner_phone: { type: String, required: true, trim: true },
    truck_number: { type: String, required: true, trim: true, uppercase: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vehicle", vehicleSchema);
