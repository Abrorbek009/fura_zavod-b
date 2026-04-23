const Vehicle = require("../models/Vehicle");

const isValidPayload = (body) => {
  const required = ["owner_name", "owner_phone", "truck_number"];

  for (const key of required) {
    if (body[key] === undefined || body[key] === null || body[key] === "") {
      return `${key} is required`;
    }
  }

  return null;
};

function normalizePayload(body) {
  return {
    vehicle_date: body.vehicle_date ? new Date(body.vehicle_date) : new Date(),
    owner_name: String(body.owner_name || "").trim(),
    owner_phone: String(body.owner_phone || "").trim(),
    truck_number: String(body.truck_number || "").trim(),
  };
}

exports.createVehicle = async (req, res) => {
  try {
    const validationError = isValidPayload(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const item = await Vehicle.create(normalizePayload(req.body));
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getVehicles = async (req, res) => {
  try {
    const items = await Vehicle.find().sort({ vehicle_date: -1, createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getVehicleById = async (req, res) => {
  try {
    const item = await Vehicle.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Vehicle not found" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateVehicle = async (req, res) => {
  try {
    const item = await Vehicle.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Vehicle not found" });

    const merged = { ...item.toObject(), ...req.body };
    const validationError = isValidPayload(merged);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    Object.assign(item, normalizePayload(merged));
    await item.save();
    res.json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.deleteVehicle = async (req, res) => {
  try {
    const deleted = await Vehicle.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Vehicle not found" });
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
