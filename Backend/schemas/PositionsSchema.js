const { Schema } = require("mongoose");
const PositionsSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  product: { type: String, enum: ["CNC", "MIS"], default: "CNC" },
  name: { type: String, required: true, trim: true, uppercase: true },
  qty: { type: Number, required: true }, avg: { type: Number, required: true, min: 0 }, price: { type: Number, required: true, min: 0 },
  net: { type: String, default: "0.00%" }, day: { type: String, default: "0.00%" }, isLoss: { type: Boolean, default: false },
}, { timestamps: true });
module.exports = { PositionsSchema };
