const mongoose = require("mongoose");

const omborSchema = new mongoose.Schema(
  {
    stock_date: { type: Date, default: Date.now },
    product_name: { type: String, required: true, trim: true },
    incoming_kg: { type: Number, required: true, min: 0 },
    outgoing_kg: { type: Number, required: true, min: 0 },
    balance_kg: { type: Number, default: 0, min: 0 },
    unit_price: { type: Number, required: true, min: 0 },
    total_price: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
);

omborSchema.pre("save", function (next) {
  const incoming = Number(this.incoming_kg || 0);
  const outgoing = Number(this.outgoing_kg || 0);
  const unitPrice = Number(this.unit_price || 0);

  this.balance_kg = Math.max(incoming - outgoing, 0);
  this.total_price = Number((this.balance_kg * unitPrice).toFixed(2));
  next();
});

module.exports = mongoose.model("Ombor", omborSchema);
