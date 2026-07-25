const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, match: /^\S+@\S+\.\S+$/ },
  passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: ["user", "admin"], default: "user" },
  availableMargin: { type: Number, min: 0, default: 100000 },
  demoSeedVersion: { type: Number, default: 0 },
}, { timestamps: true });

UserSchema.methods.publicProfile = function publicProfile() { return { id: this._id, name: this.name, email: this.email, role: this.role, availableMargin: this.availableMargin }; };
module.exports = model("User", UserSchema);
