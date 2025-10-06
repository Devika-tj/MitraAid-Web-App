import React, { useState } from 'react';
import {Container,TextField,Button,Typography,Box,Grid,Alert,Divider,InputAdornment,IconButton} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReCAPTCHA from "react-google-recaptcha";
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Login = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [recaptchaValue, setRecaptchaValue] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleCaptchaChange = (value) => {
    setRecaptchaValue(value);
  };

  const validate = () => {
    const tempErrors = {};
    if (!form.email) {
      tempErrors.email = "Email is required";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(form.email)) {
        tempErrors.email = "Invalid email format";
      }
    }

    if (!form.password) {
      tempErrors.password = "Password is required";
    } else if (form.password.length < 8) {
      tempErrors.password = "Password must be at least 8 characters";
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
      const res = await axios.post("http://localhost:8000/api/auth/login", {
        email: form.email,
        password: form.password,
        captcha: recaptchaValue,
      });

      setSuccess(res.data.msg);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.user?.role === "Admin") {
        navigate("/admin-dashboard");
      } else if (res.data.user?.role === "Responder") {
        navigate("/volunteer-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);

      if (Array.isArray(err.response?.data?.errors)) {
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
      <Box sx={{ mt: 8, p: 4, boxShadow: 3, borderRadius: 2 , backgroundColor:'whitesmoke'}}>
        <Typography
          variant="h5"
          gutterBottom
          color="error"
          sx={{ textAlign: 'center' }}
        >
          Login
        </Typography>

        {errors.general && <Alert severity="error">{errors.general}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2} sx={{ mt: 1 }}>
           
              <TextField
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                fullWidth
                error={Boolean(errors.email)}
                helperText={errors.email || ""}
              />
          

           
              <TextField
                label="Password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={handleChange}
                fullWidth
                error={Boolean(errors.password)}
                helperText={errors.password || ""}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
           

            <Grid item xs={12} sx={{ mt: 2 }}>
              <ReCAPTCHA
                sitekey={import.meta.env.VITE_RECAPTCHA_SITE_KEY} 
                onChange={handleCaptchaChange}
              />
            </Grid>

           
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ backgroundColor: '#d32f2f', mt: 2 }}
              >
                Login
              </Button>
           

            <Box sx={{ width: "100%", textAlign: "left", fontFamily:"inherit", mt: 1 }}>
              <Link
                to="/forgotpassword"
                style={{
                  color: "#1976d2",
                  textDecoration: "none",
                  
                }}
              >
                Forgot password?
              </Link>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                my: 2,
                width: "100%",
              }}
            >
              <Divider sx={{ flex: 1, borderColor: "gray" }} />
              <Typography
                variant="body2"
                sx={{ color: "gray", fontWeight: "bold", mx: 2 }}
              >
                or
              </Typography>
              <Divider sx={{ flex: 1, borderColor: "gray" }} />
            </Box>

            <Grid item xs={12}>
              <Button
                onClick={() => window.open("http://localhost:8000/auth/google/", "_self")}
                variant="outlined"
                fullWidth
                sx={{
                  borderColor: '#0c0e10ff',
                  color: '#231f1fff',
                  textTransform: 'none',
                  fontWeight: 'bold',
                  boxShadow: 3,
                  mt: 1,
                  ml: 10,
                  mr: 10,
                }}
                startIcon={
                  <img
                    src="src/assets/googlelogo.png"
                    alt="Google logo"
                    style={{ width: 20, height: 20 }}
                  />
                }
              >
                Login with Google
              </Button>
            </Grid>

            <Grid item xs={12} sx={{ textAlign: 'center', mt: 3 }}>
              <Typography variant="body2" gutterBottom>
                Don’t have an account?
              </Typography>
              <Button
                component={Link}
                to="/createaccount"
                variant="outlined"
                sx={{ borderColor: '#d32f2f', color: '#d32f2f', mt: 1 }}
              >
                Create Account
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
    </Box>
  );
};

export default Login;
