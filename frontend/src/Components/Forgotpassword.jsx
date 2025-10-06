import React, { useState } from "react";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/api/auth/forgot-password", { email });
      setMessage(res.data.msg || "Reset link sent to your email.");
    } catch (err) {
      setMessage(err.response?.data?.msg || "Error sending reset link");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, p: 3, boxShadow: 2 }}>
        <Typography variant="h5" gutterBottom>Forgot Password</Typography>
        <form onSubmit={handleSubmit}>
          <TextField label="Enter your registered email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} fullWidth sx={{ mb: 2 }} required />
          <Button type="submit" variant="contained" fullWidth>Send Reset Link</Button>
        </form>
        {message && <Typography sx={{ mt: 2 }}>{message}</Typography>}
      </Box>
    </Container>
  );
};

export default ForgotPassword;