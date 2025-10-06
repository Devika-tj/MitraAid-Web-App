import React, { useState } from "react";
import {Box,Typography,Grid,Card,TextField,Button,Checkbox,FormControlLabel, Divider,} from "@mui/material";
import axios from "axios";
import Footer from '../Components/Footer';

const Donation = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    amount: "",
    customAmount: "",
    keepInformed: true,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckbox = (e) => {
    setForm({ ...form, [e.target.name]: e.target.checked });
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleDonate = async () => {
    const amount = form.amount || form.customAmount;
    if (!amount) return alert("Please select or enter an amount.");

    const loaded = await loadRazorpay();
    if (!loaded) {
      alert("Razorpay SDK failed to load.");
      return;
    }

    try {
      const { data: order } = await axios.post(
        "http://localhost:8000/api/payment/order",
        { amount }
      );
     

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "MitraAid",
        description: "Donation",
        order_id: order.id,
        handler: async function (response) {
          await axios.post("http://localhost:8000/api/payment/verify", {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          alert("Thank you for your donation!");
        },
        prefill: { name: form.name, email: form.email },
        theme: { color: "#0B3954" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error(err);
      alert("Payment failed. Try again.");
    }
  };

  const presetAmounts = [10, 50, 100];

  return (
    <Box
      sx={{
        backgroundColor: "#f5f6fa",
        minHeight: "100vh",
        overflowX: "hidden",
        py: { xs: 3, md: 0 },
      }}
    >
      <Grid container>
       
        <Grid
          item
          xs={12}
          md={7}
          sx={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1584515933487-779824d29309')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            position: "relative",
            height: { xs: "400px", md: "100vh" },
            display: "flex",
            alignItems: "center",
            color: "white",
          }}
        >
          <Box
            sx={{
              background: "rgba(0, 0, 0, 0.5)",
              p: { xs: 3, md: 6 },
              borderRadius: 2,
              maxWidth: "80%",
              ml: { md: 6 },
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: "#FFEB3B", fontWeight: 600, mb: 1 }}
            >
              DONATE NOW
            </Typography>

            <Typography
              variant="h3"
              fontWeight="bold"
              sx={{ mb: 2, lineHeight: 1.2 }}
            >
              Help Families Affected by Emergencies
            </Typography>

            <Typography variant="body1" sx={{ mb: 3 }}>
              Families in poverty have no safety net in times of crisis.
              Help provide food, medical care, and support during tough times.
            </Typography>

            <Button
              variant="contained"
              sx={{
                backgroundColor: "#FFB300",
                color: "#000",
                fontWeight: "bold",
                px: 4,
                py: 1,
                "&:hover": { backgroundColor: "#FFA000" },
              }}
              onClick={() =>
                document.getElementById("donate-form")?.scrollIntoView({
                  behavior: "smooth",
                })
              }
            >
              DONATE NOW
            </Button>
          </Box>
        </Grid>

      
        <Grid
          item
          xs={12}
          md={5}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            py: { xs: 4, md: 6 },
          }}
        >
          <Card
            id="donate-form"
            sx={{
              p: 3,
              borderRadius: 3,
              boxShadow: 3,
              width: "90%",
              maxWidth: 400,
            }}
          >
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Choose Amount
            </Typography>

            <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
              {presetAmounts.map((amt) => (
                <Button
                  key={amt}
                  variant={form.amount == amt ? "contained" : "outlined"}
                  onClick={() =>
                    setForm({ ...form, amount: amt, customAmount: "" })
                  }
                  sx={{
                    flex: 1,
                    py: 1,
                    fontWeight: "bold",
                    backgroundColor:
                      form.amount == amt ? "#0B3954" : "transparent",
                    color: form.amount == amt ? "white" : "#0B3954",
                    borderColor: "#0B3954",
                  }}
                >
                  ₹{amt}
                </Button>
              ))}
            </Box>

            <TextField
              label="Custom Amount (₹)"
              name="customAmount"
              type="number"
              fullWidth
              value={form.customAmount}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />

            <TextField
              label="Full Name"
              name="name"
              fullWidth
              value={form.name}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />

            <TextField
              label="Email Address"
              name="email"
              type="email"
              fullWidth
              value={form.email}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={form.keepInformed}
                  onChange={handleCheckbox}
                  name="keepInformed"
                />
              }
              label="Keep me informed on updates and impact"
            />

            <Divider sx={{ my: 2 }} />

            <Button
              variant="contained"
              fullWidth
              size="large"
              sx={{
                backgroundColor: "#0B3954",
                py: 1.5,
                fontWeight: "bold",
                borderRadius: 2,
                "&:hover": { backgroundColor: "#082c40" },
              }}
              onClick={handleDonate}
            >
              Donate Now
            </Button>

            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ display: "block", mt: 2, textAlign: "center" }}
            >
              100% of your donation goes directly to support our mission.
            </Typography>
          </Card>
        </Grid>
      </Grid>
        <Footer />
    </Box>
  
  );
};

export default Donation;
