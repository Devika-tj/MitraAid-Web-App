import React, { useState, useEffect } from "react";
import { Box, TextField, Button, Typography, Divider, Container } from "@mui/material";
import axios from "axios";

const EditProfile = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", place: "", additional: "" });
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        place: user.place || "",
        additional: user.additional || "",
      });
    }
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      await axios.put(`http://localhost:8000/api/users/${user._id}`, form);
      alert("Profile updated successfully!");
      localStorage.setItem("user", JSON.stringify({ ...user, ...form }));
    } catch (err) {
      alert("Error updating profile");
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Box sx={{ p: 3, boxShadow: 3, borderRadius: 2, backgroundColor: "white" }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>Edit Profile</Typography>
        <Divider sx={{ mb: 2 }} />

        <TextField label="Name" name="name" value={form.name} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
        <TextField label="Email" name="email" value={form.email} disabled fullWidth sx={{ mb: 2 }} />
        <TextField label="Phone" name="phone" value={form.phone} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
        <TextField label="Place" name="place" value={form.place} onChange={handleChange} fullWidth sx={{ mb: 2 }} />
        <TextField
          label="Additional Details"
          name="additional"
          value={form.additional}
          onChange={handleChange}
          fullWidth
          multiline
          rows={3}
          sx={{ mb: 2 }}
        />
        <Button variant="contained" onClick={handleSubmit} fullWidth>Save Changes</Button>

       
      </Box>
    </Container>
  );
};

export default EditProfile;
