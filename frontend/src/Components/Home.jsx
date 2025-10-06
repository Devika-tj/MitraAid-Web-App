import React, { useState } from 'react';
import { Box, Typography, Button, Stack, Container, Paper, TextField, MenuItem, Grid } from '@mui/material';
import NotificationImportantIcon from '@mui/icons-material/NotificationImportant';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import EmailIcon from "@mui/icons-material/Email";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PersonIcon from '@mui/icons-material/Person';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useNavigate } from 'react-router-dom';
import Slider from "react-slick";
import Footer from '../Components/Footer';
import axios from 'axios';

const images = [
  'src/assets/man-talking-mobile-phone-paramedics-examining-injured-boy-background.jpg',
  'src/assets/emergency-call-urgent-accidental-hotline-paramedic-concept.jpg',
  'src/assets/patient-getting-chemotherapy-treatment.jpg',
];

const Home = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const subjects = ['General Inquiry', 'Emergency', 'Feedback', 'History/archives', 'Patnerships and donations', 'Other'];
  
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 2500,
    slidesToShow: 1,
    slidesToScroll: 1,
    fade: false,
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/api/contact', form);
      alert('Message sent successfully!');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      alert('Error sending message');
    }
  };

  return (
    <Box id='hero'>
      {/* Hero Section */}
      <Slider {...sliderSettings}>
        {images.map((img, idx) => (
          <Box
            key={idx}
            sx={{
              minHeight: '100vh',
              backgroundImage: `url(${img})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              position: 'relative',
            }}
          >
            <Paper
              elevation={6}
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                color: '#fff',
                p: 4,
                borderRadius: 3,
                textAlign: 'center',
                maxWidth: 600,
                width: '90%',
              }}
            >
              <Typography variant="h4" fontWeight="bold" gutterBottom>
                Community First Aid Platform
              </Typography>
              <Typography variant="h6" gutterBottom>
                Rapid Response & Lifesaving Support
              </Typography>

              <Box textAlign="left" mt={3} mb={4}>
                <ul style={{ paddingLeft: '1rem', lineHeight: '1.8' }}>
                  <li>Connect with certified community responders</li>
                  <li>Rapid hospital matching & ambulance dispatch</li>
                  <li>Immediate first guidance & protocols</li>
                  <li>Support us: Blood & Fund Donations</li>
                </ul>
              </Box>

              <Stack
                direction={{ xs: 'column', sm: 'row' }}
                spacing={2}
                justifyContent="center"
              >
                <Button
                  variant="contained"
                  startIcon={<NotificationImportantIcon />}
                  onClick={() => navigate('/emergency-Alert')}
                  sx={{ backgroundColor: '#d32f2f', '&:hover': { backgroundColor: '#b71c1c' } }}
                >
                  TRIGGER EMERGENCY RESPONSE
                </Button>

                <Button
                  variant="contained"
                  onClick={() => navigate('/createvolunteer')}
                  startIcon={<BloodtypeIcon />}
                  sx={{ backgroundColor: '#c2185b', '&:hover': { backgroundColor: '#ad1457' } }}
                >
                  REGISTER AS A VOLUNTEER 
                </Button>

                <Button
                  onClick={() => navigate('/createaccount')}
                  variant="contained"
                  startIcon={<PersonIcon />}
                  sx={{ backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#1565c0' } }}
                >
                  LOGIN / CREATE ACCOUNT
                </Button>
              </Stack>
            </Paper>
          </Box>
        ))}
      </Slider>

      {/* Trainings Section */}
      <Box id="trainings" sx={{ py: 8, backgroundColor: "#fff" }}>
      <Container maxWidth="lg">
        {/* Top Title Section */}
        <Typography
          variant="h3"
          fontWeight="bold"
          textAlign="center"
          sx={{ color: "#111", mb: 2 }}
        >
          Emergency Guidance & Response
        </Typography>
        <Typography
          variant="subtitle1"
          textAlign="center"
          sx={{ color: "text.secondary", maxWidth: "700px", mx: "auto", mb: 5 }}
        >
          Learn essential first aid techniques, emergency preparedness, and quick
          response steps to save lives during critical moments.
        </Typography>

        {/* Info Cards Section */}
        <Grid container spacing={3} sx={{ mb: 6 }}>
          {[
            {
              title: "Steps to Take During a Medical Emergency",
              desc: "Be ready to act in an emergency. Learn how to remain calm and respond fast.",
              img: "src/assets/emergency 2.jpeg",
            },
            {
              title: "How to Prepare for Emergencies",
              desc: "Discover preventive measures and essential kits to keep your family safe.",
              img: "src/assets/emergency1.jpeg",
            },
            {
              title: "Ensure Fast Emergency Response",
              desc: "Find out how our volunteers and hospitals coordinate to respond quickly.",
              img: "src/assets/emergency3.jpeg",
            },
          ].map((item, i) => (
            <Grid item xs={12} md={4} key={i}>
              <Box
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: 3,
                  transition: "transform 0.3s ease",
                  "&:hover": { transform: "translateY(-6px)" },
                }}
              >
                <Box
                  component="img"
                  src={item.img}
                  alt={item.title}
                  sx={{ width: "100%", height: 200, objectFit: "cover" }}
                />
                <Box sx={{ p: 2 }}>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.desc}
                  </Typography>
                  <Button
                    sx={{ mt: 1, color: "#e53935", textTransform: "none" }}
                    onClick={() => alert("Coming soon")}
                  >
                    Read more →
                  </Button>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Red Contact Section */}
        <Box
          sx={{
            backgroundColor: "#e53935",
            color: "white",
            borderRadius: 3,
            p: { xs: 3, md: 5 },
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexDirection: { xs: "column", md: "row" },
            gap: 3,
          }}
        >
         
          <Box>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
              Have an emergency?
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
              Call <span style={{ textDecoration: "underline" }}>+91 98765 43210</span> now!
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.9 }}>
              Our team is available 24/7 to connect you to nearby responders and hospitals.
              In case of severe emergencies, stay calm and follow our first aid guidance.
            </Typography>
          </Box>

         
          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: 10,
              display: "flex",
              alignItems: "center",
              px: 2,
              py: 1,
              minWidth: 300,
              flex: "0 0 auto",
            }}
          >
            <TextField
              variant="standard"
              placeholder="Your phone number"
              InputProps={{
                disableUnderline: true,
              }}
              sx={{ flex: 1, mr: 1 }}
            />
            <Button
              variant="contained"
              sx={{
                backgroundColor: "#e53935",
                "&:hover": { backgroundColor: "#c62828" },
                borderRadius: 10,
                px: 3,
              }}
            >
              Call Back
            </Button>
          </Box>
        </Box>

       
        <Box sx={{ mt: 6, textAlign: "center" }}>
          <Typography variant="body1" color="text.secondary">
            <EmailIcon sx={{ verticalAlign: "middle", mr: 1, color: "#e53935" }} />
            support@mitraaid.org
          </Typography>
          <Typography variant="body1" color="text.secondary">
            <LocalPhoneIcon sx={{ verticalAlign: "middle", mr: 1, color: "#e53935" }} />
            +91 98765 43210
          </Typography>
          <Typography variant="body1" color="text.secondary">
            <AccessTimeIcon sx={{ verticalAlign: "middle", mr: 1, color: "#e53935" }} />
            We’re here 24/7 for any emergency response or guidance.
          </Typography>
        </Box>
      </Container>
    </Box>

      {/* About Section */}
      <Box id="about" sx={{ py: 8, backgroundColor: '#f9f9f9' }}>
        <Container>
          <Typography variant="h4" gutterBottom>
            About MitraAid
          </Typography>
          <Typography paragraph>
            MitraAid is a community-first aid response and donation platform designed to strengthen local resilience through rapid support, knowledge sharing, and volunteer mobilization. We connect certified responders, donors, and citizens to ensure timely help during emergencies.
          </Typography>
          <Typography paragraph>
            Our integrated approach brings together health professionals, youth volunteers, and organizational partners to build safer communities. We promote collaboration across sectors—emergency response, blood donation, disaster preparedness, and humanitarian outreach.
          </Typography>
          <Typography paragraph>
            MitraAid is supported by regional partners and inspired by global resilience frameworks. We welcome feedback, partnerships, and contributions to expand our impact.
          </Typography>
          <Typography sx={{ mt: 2 }}>
            📩 Contact us at <strong>support@mitraaid.org</strong> to learn more or get involved.
          </Typography>
        </Container>
      </Box>


      {/* Contact Section with Form */}
      <Box id="contact" sx={{ py: 8 }}>
        <Container maxWidth="sm">
          <Typography variant="h4" gutterBottom>
            Contact Us
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{ mt: 2 }}
          >
            <TextField
              label="Name"
              name="name"
              value={form.name}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              select
              label="Subject"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              fullWidth
              margin="normal"
              required
            >
              {subjects.map((option) => (
                <MenuItem key={option} value={option}>{option}</MenuItem>
              ))}
            </TextField>
            <TextField
              label="Message"
              name="message"
              value={form.message}
              onChange={handleChange}
              fullWidth
              multiline
              rows={4}
              margin="normal"
              required
            />
            <Button
              type="submit"
              variant="contained"
              backgroundColor="#174385"
              fullWidth
              sx={{ mt: 2 }}
            >
              Submit
            </Button>
          </Box>
        </Container>
      </Box>



      <Footer />
    </Box>
  );
};

export default Home;
