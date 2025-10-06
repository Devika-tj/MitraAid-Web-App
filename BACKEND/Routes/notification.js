const express = require("express");
const router = express.Router();
const Notification = require("../Models/notification");
const User = require("../Models/User");
const axios = require("axios");

// Twilio optional integration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioFrom = process.env.TWILIO_FROM;
let twilioClient = null;
if (accountSid && authToken) {
  const twilio = require("twilio");
  twilioClient = twilio(accountSid, authToken);
}

// create notification: expects { type, latitude, longitude, message? }
router.post("/", async (req, res) => {
  try {
    const { type, latitude, longitude, message } = req.body;

    // find volunteers near location — this is example logic. Replace with spatial query if you store lat/lng.
    const volunteers = await User.find({ role: "Responder" }).limit(50); // naive

    // create notifications for some volunteers (you can filter by distance, availability etc)
    const created = [];
    for (const v of volunteers) {
      const n = new Notification({ user: v._id, message: message || `${type} at ${latitude},${longitude}`, data: { type, latitude, longitude } });
      await n.save();
      created.push(n);

      // send SMS if phone exists and Twilio configured
      if (v.phone && twilioClient) {
        try {
          await twilioClient.messages.create({
            body: `Emergency: ${type} near your area. Location: https://maps.google.com/?q=${latitude},${longitude}`,
            from: twilioFrom,
            to: v.phone // ensure E.164 format
          });
        } catch (err) {
          console.error("Twilio send error:", err?.message);
        }
      }
    }

    // Optionally notify donors who match blood requirements (not implemented here)
    res.json({ msg: "Notifications sent", count: created.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error creating notifications", error: err.message });
  }
});

// get all notifications (admin) or /user/:id to get user-specific
router.get("/", async (req, res) => {
  try {
    const notifs = await Notification.find().populate("user", "name email phone role").sort({ createdAt: -1 });
    res.json(notifs);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching notifications" });
  }
});

// mark notification read
router.patch("/:id", async (req, res) => {
  try {
    const update = await Notification.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(update);
  } catch (err) {
    res.status(500).json({ msg: "Error updating notification" });
  }
});

module.exports = router;
