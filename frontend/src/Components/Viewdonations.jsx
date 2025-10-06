import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Card, CardContent, Grid } from "@mui/material";

const DonationList = () => {
  const [donations, setDonations] = useState([]);

  useEffect(() => {
    const fetchDonations = async () => {
      const res = await axios.get("http://localhost:8000/api/payment");
      setDonations(res.data);
    };
    fetchDonations();
  }, []);

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4">Donation History</Typography>
      <Grid container spacing={2} sx={{ mt: 2 }}>
        {donations.map((d) => (
          <Grid item xs={12} sm={6} md={4} key={d._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{d.name}</Typography>
                <Typography variant="body2">{d.email}</Typography>
                <Typography variant="body1">₹{d.amount}</Typography>
                <Typography
                  variant="subtitle2"
                  color={
                    d.status === "SUCCESS"
                      ? "green"
                      : d.status === "FAILED"
                      ? "red"
                      : "orange"
                  }
                >
                  {d.status}
                </Typography>
                <Typography variant="caption">
                  {new Date(d.date).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DonationList;
