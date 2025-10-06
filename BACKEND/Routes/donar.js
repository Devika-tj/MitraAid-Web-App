const express = require("express");
const router = express.Router();
const Donor = require("../Models/donar");
const jwt = require("jsonwebtoken");


const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ msg: "Invalid token" });
  }
};

router.post("/", verifyToken, async (req, res) => {
  try {
    const existing = await Donor.findOne({ user: req.user.id });
    if (existing) {
      return res.status(400).json({ msg: "You are already registered as a donor" });
    }

    const donor = new Donor({
      user: req.user.id,
      name: req.body.name,
      bloodGroup: req.body.bloodGroup,
      contact: req.body.contact,
      availability: req.body.availability ?? true,
    });

    await donor.save();
    res.status(201).json({ msg: "Registered as donor successfully", donor });
  } catch (err) {
    res.status(500).json({ msg: "Error registering donor", error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const donors = await Donor.find({ availability: true }).sort({ createdAt: -1 });
    res.json(donors);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching donors" });
  }
});


router.get("/match/:group", async (req, res) => {
  try {
    const donors = await Donor.find({ bloodGroup: req.params.group, availability: true });
    res.json(donors);
  } catch (err) {
    res.status(500).json({ msg: "Error matching donors" });
  }
});


router.get("/me", verifyToken, async (req, res) => {
  try {
    const donor = await Donor.findOne({ user: req.user.id });
    res.json(donor);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching donor", error: err.message });
  }
});


router.patch("/:id/availability", verifyToken, async (req, res) => {
  try {
    const donor = await Donor.findById(req.params.id);
    if (!donor) return res.status(404).json({ msg: "Donor not found" });
    if (donor.user.toString() !== req.user.id && req.user.role !== "Admin")
      return res.status(403).json({ msg: "Not authorized" });

    donor.availability = typeof req.body.availability === "boolean" ? req.body.availability : !donor.availability;
    await donor.save();
    res.json({ msg: "Availability updated", donor });
  } catch (err) {
    res.status(500).json({ msg: "Error updating availability", error: err.message });
  }
});

router.get("/me", verifyToken, async (req, res) => {
  try {
    const donor = await Donor.findOne({ user: req.user.id }).lean();
    if (!donor) return res.status(404).json({ msg: "Donor profile not found" });


    const Donation = require("../Models/Donation");
    const history = await Donation.find({ user: req.user.id, type: "blood" }).sort({ date: -1 }).lean();


    const lastDonationDate = history.length ? history[0].date : null;

    res.json({ ...donor, history, lastDonationDate });
  } catch (err) {
    res.status(500).json({ msg: "Error fetching donor profile", error: err.message });
  }
});

module.exports = router;
