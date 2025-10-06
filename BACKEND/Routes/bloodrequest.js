const express = require("express");
const router = express.Router();
const BloodRequest = require("../Models/bloodrequest");
const Donor = require("../Models/donar");
const Notification = require("../Models/notification");
const jwt = require("jsonwebtoken");
const twilioSid = process.env.TWILIO_SID;
const twilioToken = process.env.TWILIO_TOKEN;
const twilioFrom = process.env.TWILIO_FROM;

//  verifyToken 
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

// Create new request (User or Responder)
router.post("/", verifyToken, async (req, res) => {
  try {
    const payload = {
      patientName: req.body.patientName,
      bloodGroup: req.body.bloodGroup,
      hospital: req.body.hospital,
      contact: req.body.contact,
      requester: req.user.id,
    };

    const request = new BloodRequest(payload);
    await request.save();

    // Find matching donors (availability true)
    const matchedDonors = await Donor.find({
      bloodGroup: payload.bloodGroup,
      availability: true,
    });

    // Create notifications 
    const twilioClient = (twilioSid && twilioToken)
      ? require("twilio")(twilioSid, twilioToken)
      : null;

    const notifyPromises = matchedDonors.map(async (donor) => {
      const msg = `Blood request: ${payload.bloodGroup} needed for ${payload.patientName} at ${payload.hospital}. Contact: ${payload.contact}`;

      // Save notification to DB
      const n = new Notification({
        user: donor.user,
        message: msg,
        data: {
          requestId: request._id,
          bloodGroup: payload.bloodGroup,
          patientName: payload.patientName,
          hospital: payload.hospital,
        },
      });
      await n.save();

     
      try {
        if (twilioClient && donor.contact) {
          await twilioClient.messages.create({
            body: msg,
            from: twilioFrom,
            to: donor.contact, 
          });
        }
      } catch (smsErr) {
        console.error("Failed to send SMS to", donor.contact, smsErr.message);
      }
    });

    await Promise.all(notifyPromises);

    res.status(201).json({
      message: "Request created",
      request,
      matchedCount: matchedDonors.length,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error creating request", error: err.message });
  }
});


router.get("/", async (req, res) => {
  try {
    const requests = await BloodRequest.find()
      .populate("requester", "name email phone role")
      .sort({ createdAt: -1 });
    res.json(requests);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching requests" });
  }
});


router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const request = await BloodRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ msg: "Request not found" });

    if (request.requester.toString() !== req.user.id && req.user.role !== "Admin") {
      return res.status(403).json({ msg: "Not authorized" });
    }

    await request.deleteOne();
    res.json({ msg: "Request deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting request" });
  }
});

module.exports = router;