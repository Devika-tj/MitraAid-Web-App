const express = require("express");
const router = express.Router();
const axios = require("axios");

router.get("/nearby", async (req, res) => {
  try {
    const { lat, lng, radius = 3000, type = "hospital" } = req.query;
    const key = process.env.GOOGLE_MAPS_API_KEY; 
    if (!key) return res.status(500).json({ msg: "Google API key not configured on server" });

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${key}`;
    const resp = await axios.get(url);
    return res.json(resp.data);
  } catch (err) {
    console.error("Places proxy error:", err?.response?.data || err.message);
    return res.status(500).json({ msg: "Places API error", error: err.message });
  }
});

module.exports = router;
