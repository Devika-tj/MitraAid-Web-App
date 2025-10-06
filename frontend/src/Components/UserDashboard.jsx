import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, Card, CardContent, Button, Chip, Divider, IconButton, Avatar, Tooltip, Menu, MenuItem, ListItemIcon } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
import EditIcon from "@mui/icons-material/Edit";
import LogoutIcon from "@mui/icons-material/Logout";
import NotificationsIcon from "@mui/icons-material/Notifications";

const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [location, setLocation] = useState({ lat: 8.5241, lng: 76.9366 });
  const [hospitals, setHospitals] = useState([]);
  const [guides, setGuides] = useState([]);
  const [requests, setRequests] = useState([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const open = Boolean(anchorEl);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) setUser(JSON.parse(savedUser));


    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setLocation(coords);
          fetchNearbyHospitals(coords);
        },
        () => fetchNearbyHospitals(location)
      );
    } else {
      fetchNearbyHospitals(location);
    }

    fetchGuides();
    fetchRequests();
  }, []);

  const fetchNearbyHospitals = async ({ lat, lng }) => {
    try {
      const res = await axios.get("http://localhost:8000/api/places/nearby", {
        params: { lat, lng, radius: 3000, type: "hospital" },
      });
      setHospitals(res.data.results || []);
    } catch (err) {
      console.error("Error fetching hospitals:", err);
    }
  };

  const fetchGuides = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/guidance");
      setGuides(res.data);
    } catch (err) {
      console.error("Failed to fetch guidance:", err);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/blood-requests");
      setRequests(res.data.filter((r) => r.status === "Active"));
    } catch (err) {
      console.error("Error fetching blood requests:", err);
    }
  };

  const handleMenuClose = () => setAnchorEl(null);
  const handleEditProfile = () => { navigate("/edit-profile"); handleMenuClose(); };
  const handleLogout = () => { localStorage.removeItem("token"); localStorage.removeItem("user"); navigate("/login"); handleMenuClose(); };

  return (
    <Box sx={{ p: { xs: 2, sm: 4 }, backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#e53935", color: "white", borderRadius: 2, py: 2, px: 3, mb: 3, boxShadow: 2 }}>
        <Typography variant="h5" fontWeight="bold">Welcome, {user?.name ?? "User"}!</Typography>

        
      </Box>

      {/* Nearby Hospitals  */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom fontWeight="bold">Nearby Responders & Hospitals</Typography>

          <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
            <GoogleMap mapContainerStyle={{ height: "300px", width: "100%" }} center={location} zoom={13}>
              <Marker position={location} label="You" />
              {hospitals.map((h, i) => {
                const lat = h.geometry?.location?.lat ?? h.geometry?.location?.lat;
                const lng = h.geometry?.location?.lng ?? h.geometry?.location?.lng;
                return <Marker key={i} position={{ lat, lng }} label={h.name} />;
              })}
            </GoogleMap>
          </LoadScript>

          <Box sx={{ mt: 2, maxHeight: 150, overflowY: "auto" }}>
            {hospitals.length === 0 ? (
              <Typography color="text.secondary">No hospitals found nearby.</Typography>
            ) : (
              hospitals.slice(0, 6).map((h, i) => (
                <Box key={i} sx={{ mb: 1.5 }}>
                  <Typography variant="subtitle1">{h.name}</Typography>
                  <Typography variant="body2" color="text.secondary">{h.vicinity ?? h.formatted_address}</Typography>
                  {i < hospitals.length - 1 && <Divider sx={{ my: 1 }} />}
                </Box>
              ))
            )}
          </Box>
        </CardContent>
      </Card>

    
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Quick Access to First Aid Guides
          </Typography>

          <Grid container spacing={2}>
            {guides.length === 0 ? (
              <Typography color="text.secondary">No guides available</Typography>
            ) : (
              guides.map((g) => (
                <Grid item xs={6} sm={4} md={3} key={g._id}>
                  <Card
                    onClick={() => navigate(`/guidance/${g._id}`)}
                    sx={{
                      cursor: "pointer",
                      textAlign: "center",
                      borderRadius: 3,
                      transition: "0.3s",
                      "&:hover": { boxShadow: 4, transform: "scale(1.03)" },
                    }}
                  >
                    <CardContent>
                      <Box
                        component="img"
                        src={g.image || "/placeholder.jpg"} 
                        alt={g.category}
                        sx={{
                          width: 80,
                          height: 80,
                          borderRadius: "50%",
                          objectFit: "cover",
                          mb: 1,
                          backgroundColor: "#fff5f5",
                          border: "2px solid #ef9a9a",
                          p: 1,
                        }}
                      />
                      <Typography
                        variant="subtitle1"
                        fontWeight="bold"
                        sx={{ color: "#d32f2f" }}
                      >
                        {g.category}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </CardContent>
      </Card>

      {/* Blood Donation Requests */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold">Blood Donation Requests</Typography>
          <Box sx={{ mt: 1 }}>
            <Button variant="contained" sx={{ mr: 2 }} onClick={() => navigate("/blood-requests")}>View Requests</Button>
            <Button variant="outlined" onClick={() => navigate("/donor-registration")}>Register as Donor</Button>
          </Box>

          <Box sx={{ mt: 2 }}>
            {requests.length === 0 ? <Typography>No active blood requests</Typography> : requests.slice(0, 2).map((r) => (
              <Card key={r._id} sx={{ mt: 1, p: 1, backgroundColor: "#fff5f5", border: "1px solid #ffcdd2" }}>
                <Typography fontWeight="bold">Urgent: {r.bloodGroup} needed at {r.hospital}</Typography>
                <Typography variant="body2">{r.patientName}</Typography>
                <Typography variant="body2">{r.contact}</Typography>
              </Card>
            ))}
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserDashboard;
