const Ombor = require("../models/Ombor");

const isValidPayload = (body) => {
  const required = ["product_name", "incoming_kg", "outgoing_kg", "unit_price"];

  for (const key of required) {
    if (body[key] === undefined || body[key] === null || body[key] === "") {
      return `${key} is required`;
    }
  }

  const incoming = Number(body.incoming_kg);
  const outgoing = Number(body.outgoing_kg);
  const unitPrice = Number(body.unit_price);

  if ([incoming, outgoing, unitPrice].some((n) => Number.isNaN(n))) {
    return "Kirim, chiqim va narx son bo'lishi kerak";
  }

  if (incoming < outgoing) {
    return "Kirim miqdori chiqim miqdoridan kichik bo'lmasligi kerak";
  }

  return null;
};

function normalizePayload(body) {
  return {
    stock_date: body.stock_date ? new Date(body.stock_date) : new Date(),
    product_name: String(body.product_name || "").trim(),
    incoming_kg: Number(body.incoming_kg),
    outgoing_kg: Number(body.outgoing_kg),
    balance_kg:
      body.balance_kg === undefined || body.balance_kg === null || body.balance_kg === ""
        ? Math.max(Number(body.incoming_kg) - Number(body.outgoing_kg), 0)
        : Number(body.balance_kg),
    unit_price: Number(body.unit_price),
  };
}

exports.createOmborItem = async (req, res) => {
  try {
    const validationError = isValidPayload(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const item = await Ombor.create(normalizePayload(req.body));
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.getOmborItems = async (req, res) => {
  try {
    const items = await Ombor.find().sort({ stock_date: -1, createdAt: -1 });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getOmborItemById = async (req, res) => {
  try {
    const item = await Ombor.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Ombor item not found" });
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateOmborItem = async (req, res) => {
  try {
    const item = await Ombor.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Ombor item not found" });

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

exports.deleteOmborItem = async (req, res) => {
  try {
    const deleted = await Ombor.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Ombor item not found" });
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
