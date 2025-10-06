import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8000/api/auth/reset-password/${token}`, { password });
      alert("Password reset successful");
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.msg || "Error resetting password");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "400px", margin: "2rem auto" }}>
      <h2>Reset Password</h2>
      <input type="password" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <button type="submit">Reset</button>
    </form>
  );
};

export default ResetPassword;