const { Schema } = require("mongoose");
const OrdersSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  name: { type: String, required: true, trim: true, uppercase: true },
  qty: { type: Number, required: true, min: 1 },
  price: { type: Number, required: true, min: 0 },
  mode: { type: String, required: true, enum: ["BUY", "SELL"] },
  product: { type: String, enum: ["CNC", "MIS"], default: "CNC" },
  status: { type: String, enum: ["OPEN", "COMPLETE", "CANCELLED", "REJECTED"], default: "COMPLETE" },
}, { timestamps: true });
module.exports = { OrdersSchema };
