const mongoose = require("mongoose");

const bloodRequestSchema = new mongoose.Schema({
  requester: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  patientName: { type: String, required: true },
  bloodGroup: { type: String, required: true },
  hospital: { type: String, required: true },
  contact: { type: String, required: true },
  status: { type: String, enum: ["Active", "Fulfilled"], default: "Active" }
}, { timestamps: true });

module.exports = mongoose.model("BloodRequests", bloodRequestSchema);