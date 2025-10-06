const express = require("express");
const router = express.Router();
const Guidance = require("../Models/guidence");


router.post("/", async (req, res) => {
  try {
    const { title, category, description, image, steps } = req.body;

    const guide = new Guidance({
      title,
      category,
      description,
      image,
      steps: steps.map((s) => ({
        text: s.text || "",
        image: s.image || "",
      })),
    });

    await guide.save();
    res.status(201).json({ msg: "Guidance added", guide });
  } catch (err) {
    res.status(500).json({ msg: "Error adding guidance", error: err.message });
  }
});


router.get("/", async (req, res) => {
  try {
    const guides = await Guidance.find().sort({ createdAt: -1 });
    res.json(guides);
  } catch (err) {
    res.status(500).json({ msg: "Error", error: err.message });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const guide = await Guidance.findById(req.params.id);
    res.json(guide);
  } catch (err) {
    res.status(500).json({ msg: "Error", error: err.message });
  }
});

module.exports = router;



router.put("/:id", async (req, res) => {
  try {
    const updated = await Guidance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ msg: "Guidance updated", updated });
  } catch (err) {
    res.status(500).json({ msg: "Error updating", error: err.message });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    await Guidance.findByIdAndDelete(req.params.id);
    res.json({ msg: "Guidance deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting", error: err.message });
  }
});

