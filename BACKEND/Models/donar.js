const mongoose = require("mongoose");

const donorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  contact: { type: String, required: true },
  availability: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("donors", donorSchema);
