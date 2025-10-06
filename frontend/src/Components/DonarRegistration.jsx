import React, { useState, useEffect } from "react";
import { Container, TextField, Button, Box, Typography, Switch, FormControlLabel } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const DonorRegister = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", bloodGroup: "", contact: "", availability: true });
  const token = localStorage.getItem("token");

  useEffect(() => {

    if (!token) return;
    axios.get("http://localhost:8000/api/donors/me", { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        if (res.data) setForm({ name: res.data.name || "", bloodGroup: res.data.bloodGroup || "", contact: res.data.contact || "", availability: res.data.availability ?? true });
      }).catch(() => { });
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/donors", form, { headers: { Authorization: `Bearer ${token}` } });
      alert("Registered as donor!");
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.msg || "Error registering as donor");
    }
  };

  return (
    <Box
      sx={{
        backgroundImage: "url('src/assets/backgroundimage.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="sm">
        <Box sx={{ mt: 4, p: 3, boxShadow: 2,backgroundColor:'whitesmoke' }}>
          <Typography variant="h6" gutterBottom fontWeight={'bold'}>Register as Donor</Typography>
          <form onSubmit={handleSubmit}>
            <TextField label="Full name" name="name" value={form.name} onChange={handleChange} fullWidth sx={{ mb: 2 }} required />
            <TextField label="Blood group (e.g. A+)" name="bloodGroup" value={form.bloodGroup} onChange={handleChange} fullWidth sx={{ mb: 2 }} required />
            <TextField label="Contact (E.164 or local number)" name="contact" value={form.contact} onChange={handleChange} fullWidth sx={{ mb: 2 }} required />
            <FormControlLabel control={<Switch checked={form.availability} onChange={(e) => setForm({ ...form, availability: e.target.checked })} />} label="Available to donate" />
            <Button type="submit" variant="contained" sx={{ mt: 2 }}>Save</Button>
          </form>
        </Box>
      </Container>
    </Box>
  );
};

export default DonorRegister;
