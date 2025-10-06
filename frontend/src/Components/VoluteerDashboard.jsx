import React, { useEffect, useState } from "react";
import { Box, Typography, Card, CardContent, Button, Divider } from "@mui/material";
import axios from "axios";

const VolunteerDashboard = () => {
  const [notifications, setNotifications] = useState([]);
  const [bloodRequests, setBloodRequests] = useState([]);
  const [donorProfile, setDonorProfile] = useState(null);
  const token = localStorage.getItem("token");

  const fetchNotifications = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/notifications");
      setNotifications(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchBloodRequests = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/blood-requests");
      setBloodRequests(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchDonorProfile = async () => {
    if (!token) return;
    try {
      const res = await axios.get("http://localhost:8000/api/donors/me", { headers: { Authorization: `Bearer ${token}` }});
      setDonorProfile(res.data || null);
    } catch (err) {
      // not registered as donor
      setDonorProfile(null);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchBloodRequests();
    fetchDonorProfile();

    const interval = setInterval(() => {
      fetchNotifications();
      fetchBloodRequests();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const handleMarkRead = async (id) => {
    try {
      await axios.patch(`http://localhost:8000/api/notifications/${id}`, { read: true });
      fetchNotifications();
    } catch (err) { console.error(err); }
  };

  return (
    <Box sx={{ p: 3 }}>
     <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#e53935", color: "white", borderRadius: 2, py: 2, px: 3, mb: 3, boxShadow: 2 }}>
            <Typography variant="h5" fontWeight="bold">Welcome !</Typography>
    
            
          </Box>

      <Typography variant="h6" sx={{ mt: 2 }} fontWeight={'bold'}>Notifications</Typography>
      {notifications.length === 0 ? <Typography>No notifications</Typography> : notifications.map((n) => (
        <Card key={n._id} sx={{ mt: 1 }}>
          <CardContent>
            <Typography fontWeight="bold">{n.message}</Typography>
            <Typography variant="caption">{new Date(n.createdAt).toLocaleString()}</Typography>
            <Box sx={{ mt: 1 }}>
              {!n.read && <Button onClick={() => handleMarkRead(n._id)} variant="outlined" size="small">Mark read</Button>}
            </Box>
          </CardContent>
        </Card>
      ))}

      <Divider sx={{ my: 4 }} />

    
      <Typography variant="h6" fontWeight={'bold'}>Active Blood Requests</Typography>
      {bloodRequests.length === 0 ? <Typography>No blood requests</Typography> : bloodRequests.map((r) => (
        <Card key={r._id} sx={{ mt: 1 }}>
          <CardContent>
            <Typography variant="h6">{r.patientName}</Typography>
            <Typography>Blood Group: {r.bloodGroup}</Typography>
            <Typography>Hospital: {r.hospital}</Typography>
            <Typography>Contact: {r.contact}</Typography>
          </CardContent>
        </Card>
      ))}

      <Divider sx={{ my: 4 }} />

    
      <Typography variant="h6" fontWeight={'bold'} >Donor Profile</Typography>
      {!donorProfile ? (
        <>
          <Typography sx={{ mt: 1 }}>You are not registered as a donor.</Typography>
          <Button sx={{ mt: 1 }} variant="contained" onClick={() => (window.location.href = "/donor-registration")}>Register as Donor</Button>
        </>
      ) : (
        <Card sx={{ mt: 1 }}>
          <CardContent>
            <Typography fontWeight="bold">{donorProfile.name} • {donorProfile.bloodGroup}</Typography>
            <Typography>Contact: {donorProfile.contact}</Typography>
            <Typography sx={{ mt: 1, fontWeight: "bold" }}>Donation History</Typography>
            {donorProfile.history && donorProfile.history.length ? (
              donorProfile.history.map((h, i) => (
                <Box key={i} sx={{ mt: 1 }}>
                  <Typography>{new Date(h.date).toLocaleDateString()} • {h.hospital || h.cause} • {h.amount ? `${h.amount}` : "blood donation"}</Typography>
                </Box>
              ))
            ) : <Typography>No recorded donations</Typography>}

           
            <Typography sx={{ mt: 2 }}>Next eligible to donate: {donorProfile.lastDonationDate ? (() => {
              const last = new Date(donorProfile.lastDonationDate);
              const next = new Date(last.setMonth(last.getMonth() + 3));
              return next.toLocaleDateString();
            })() : "No donation recorded"}</Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default VolunteerDashboard;
