import React, { useState } from "react";
import { Box, Button, Typography, Modal, IconButton, Card, CardContent } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";

const EmergencyAlert = () => {
  const [open, setOpen] = useState(false);
  const [location, setLocation] = useState(null);
  const [nearby, setNearby] = useState([]);

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLocation(coords);
        fetchNearbyHospitals(coords);
      },
      (err) => {
        console.error("Location error:", err);
        alert("Please allow location access.");
      }
    );
  };

 
  const fetchNearbyHospitals = async ({ lat, lng }) => {
    try {
      const res = await axios.get("http://localhost:8000/api/places/nearby", { params: { lat, lng, radius: 3000, type: "hospital" } });
      setNearby(res.data.results || []);
    } catch (err) {
      console.error("Places API error:", err);
      setNearby([]);
    }
  };

  // send notification 
  const sendAlert = async (type) => {
    if (!location) return alert("Location required");
    try {
      await axios.post("http://localhost:8000/api/notifications", { type, latitude: location.lat, longitude: location.lng });
      alert(`${type} alert sent to nearby responders`);
      setOpen(false);
    } catch (err) {
      console.error("Error sending alert:", err);
      alert("Failed to send alert");
    }
  };

  const handleOpen = () => { setOpen(true); getLocation(); };
  const handleClose = () => setOpen(false);

  return (
    <Box sx={{ textAlign: "center", mt: 3 }}>
      <Button variant="contained" color="error" onClick={handleOpen}>🚨 Emergency Alert</Button>

      <Modal open={open} onClose={handleClose}>
        <Box sx={{ width: 360, bgcolor: "white", borderRadius: 2, p: 2, mx: "auto", mt: "10vh", position: "relative" }}>
          <IconButton sx={{ position: "absolute", top: 8, right: 8 }} onClick={handleClose}><CloseIcon /></IconButton>

          <Typography variant="h6" gutterBottom>Call for Help</Typography>

          <Box sx={{ height: 200, borderRadius: 1, overflow: "hidden", mb: 2 }}>
            {location ? (
              <iframe
                title="map"
                width="100%"
                height="200"
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.google.com/maps/embed/v1/search?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&q=hospitals+near+${location.lat},${location.lng}&zoom=14`}
              />
            ) : <Typography>Getting location...</Typography>}
          </Box>

          {nearby.slice(0, 3).map((place, i) => (
            <Card key={i} sx={{ mb: 1 }}>
              <CardContent>
                <Typography variant="subtitle1" sx={{ color: "red" }}>🏥 {place.name}</Typography>
                <Typography variant="body2">{place.vicinity}</Typography>
              </CardContent>
            </Card>
          ))}

          <Box>
            <Typography sx={{ mt: 1, fontWeight: "bold" }}>Ambulance: 102</Typography>
            <Typography sx={{ fontWeight: "bold" }}>Police: 100</Typography>
            <Typography sx={{ fontWeight: "bold" }}>Fire: 101</Typography>
          </Box>

          <Button variant="contained" color="error" fullWidth sx={{ mt: 2 }} onClick={() => sendAlert("Medical Emergency")}>Notify Responders</Button>
        </Box>
      </Modal>
    </Box>
  );
};

export default EmergencyAlert;
