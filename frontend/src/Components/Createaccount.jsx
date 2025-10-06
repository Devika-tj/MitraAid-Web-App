import React, { useState } from 'react';
import {Container, TextField, Button, Typography, Box, Grid,IconButton, InputAdornment, Divider} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import ReCAPTCHA from "react-google-recaptcha";

const Createaccount = ({ role }) => {  
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    place: ""     
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [recaptchaValue, setRecaptchaValue] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const getRecaptchaValue = (value) => {
    setRecaptchaValue(value);
  };

  const validate = () => {
    const tempErrors = {};
    if (!form.name) tempErrors.name = "Name is required";
    if (!form.phone) tempErrors.phone = "Phone is required";
    else if (form.phone.length !== 10) tempErrors.phone = "Phone must be 10 digits";

    if (!form.email) tempErrors.email = "Email is required";
    else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) tempErrors.email = "Invalid email format";
    }

    if (!form.password) tempErrors.password = "Password is required";
    else if (form.password.length < 8)
      tempErrors.password = "Password must be at least 8 characters";

    if (!form.confirmPassword) tempErrors.confirmPassword = "Confirm password is required";
    else if (form.password !== form.confirmPassword)
      tempErrors.confirmPassword = "Passwords do not match";

    if (role === "Responder" && !form.place) {
      tempErrors.place = "Place is required for volunteers";
    }

    return tempErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccess("");

    if (!recaptchaValue) {
      return setErrors({ general: "Please complete the reCAPTCHA" });
    }

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      return setErrors(validationErrors);
    }

    try {
      const res = await axios.post("http://localhost:8000/api/auth/signup", {
        name: form.name,
        phone: form.phone,
        email: form.email,
        password: form.password,
        role: role,             
        place: form.place || "",
        captcha: recaptchaValue,
      });

      setSuccess(res.data.msg);

      // Save token & user in localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (role === "Responder") {
        navigate("/volunteer-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      if (err.response?.data?.errors) {
        const backendErrors = {};
        err.response.data.errors.forEach((e) => {
          backendErrors[e.field] = e.message;
        });
        setErrors(backendErrors);
      } else {
        setErrors({ general: err.response?.data?.msg || "Something went wrong" });
      }
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
      <Box sx={{ mt: 8, p: 4, boxShadow: 3, borderRadius: 2 ,backgroundColor:'whitesmoke'}}>
        <Typography variant="h5" gutterBottom color="error" sx={{ textAlign: 'center' }}>
          {role === "Responder" ? "Volunteer Registration" : "Create Account"}
        </Typography>

        {errors.general && <Typography color="error" sx={{ mb: 2 }}>{errors.general}</Typography>}
        {success && <Typography color="green" sx={{ mb: 2 }}>{success}</Typography>}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12}>
              <TextField
                label="Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                fullWidth
                error={!!errors.name}
                helperText={errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                fullWidth
                error={!!errors.phone}
                helperText={errors.phone && <span style={{ color: 'red' }}>{errors.phone}</span>}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                value={form.email}
                onChange={handleChange}
                fullWidth
                error={!!errors.email}
                helperText={errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
              />
            </Grid>

            {/* Volunteer only field */}
            {role === "Responder" && (
              <Grid item xs={12}>
                <TextField
                  label="Place"
                  name="place"
                  value={form.place}
                  onChange={handleChange}
                  fullWidth
                  error={!!errors.place}
                  helperText={errors.place && <span style={{ color: 'red' }}>{errors.place}</span>}
                />
              </Grid>
            )}

            <Grid item xs={12}>
              <TextField
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                fullWidth
                error={!!errors.password}
                helperText={errors.password && <span style={{ color: 'red' }}>{errors.password}</span>}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Confirm Password"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={form.confirmPassword}
                onChange={handleChange}
                fullWidth
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword && <span style={{ color: 'red' }}>{errors.confirmPassword}</span>}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  )
                }}
              />
            </Grid>

            {/* recaptcha */}
            <ReCAPTCHA
              sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} 
              onChange={getRecaptchaValue}
            />

            {/* Create Account Button */}
            <Button type="submit" variant="contained" fullWidth sx={{ backgroundColor: '#d32f2f', mt: 2 }}>
              {role === "Responder" ? "Register as Volunteer" : "Create Account"}
            </Button>

            {/* Already have account */}
            <Grid item xs={12} >
              <Typography variant="body2" align="center" sx={{ mt: 1 }}>
                Already have an account?{" "}
                <Link to="/login" style={{ color: "#1976d2", textDecoration: "none" }}>
                  Go to Login
                </Link>
              </Typography>
            </Grid>

            {/* OR Separator */}
            <Box sx={{ display: "flex", alignItems: "center", my: 2, width: "100%" }}>
              <Divider sx={{ flex: 1, borderColor: "gray" }} />
              <Typography variant="body2" sx={{ color: "gray", fontWeight: "bold", mx: 2 }}>
                OR
              </Typography>
              <Divider sx={{ flex: 1, borderColor: "gray" }} />
            </Box>

            {/* Continue with Google */}
            <Button
              onClick={() => window.open("http://localhost:8000/auth/google", "_self")}
              variant="outlined"
              fullWidth
              sx={{
                borderColor: 'rgba(5, 5, 5, 1)',
                boxShadow: 3,
                color: '#0e0f12ff',
                textTransform: 'none',
                fontWeight: 'bold',
                mt: 0,
              }}
              startIcon={
                <img
                  src="src/assets/googlelogo.png"
                  alt="Google logo"
                  style={{ width: 20, height: 20 }}
                />
              }
            >
              Continue with Google
            </Button>
          </Grid>
          <Grid item xs={12} sx={{ textAlign: 'center', mt: 3 }}>
                        <Button
                          component={Link}
                          to="/donor-registration"
                          variant="outlined"
                          sx={{ borderColor: '#d0cacaff', color: '#f6eeeeff', mt: 1,backgroundColor:"#174385" }}
                        >
                          Register as Donar
                        </Button>
                      </Grid>
        </form>
      </Box>
    </Container>
    </Box>
  );
};

export default Createaccount;
