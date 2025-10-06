const mongoose = require("mongoose");

const stepSchema = new mongoose.Schema({
  text: { type: String, required: true },
  image: { type: String }, 
});

const guidanceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String },
    description: { type: String },
    steps: [stepSchema],
    image: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("guidances", guidanceSchema);
