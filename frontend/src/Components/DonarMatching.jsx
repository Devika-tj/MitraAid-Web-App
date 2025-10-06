import React, { useState } from "react";
import {Box,Typography,TextField,Button,Card,CardContent,} from "@mui/material";
import axios from "axios";

const DonorMatching = () => {
  const [group, setGroup] = useState("");
  const [donors, setDonors] = useState([]);

  const handleSearch = async () => {
    try {
      const res = await axios.get(
        `http://localhost:8000/api/donors/match/${group}`
      );
      setDonors(res.data);
    } catch (err) {
      console.error("Error fetching donors:", err);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5">Find Matching Donors</Typography>
      <TextField
        label="Enter Blood Group"
        value={group}
        onChange={(e) => setGroup(e.target.value)}
        sx={{ mt: 2 }}
      />
      <Button variant="contained" color="error" sx={{ mt: 2, ml: 2 }} onClick={handleSearch}>
        Search
      </Button>

      {donors.length === 0 ? (
        <Typography sx={{ mt: 2 }}>No donors found.</Typography>
      ) : (
        donors.map((d) => (
          <Card key={d._id} sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="subtitle1">{d.name}</Typography>
              <Typography>Blood Group: {d.bloodGroup}</Typography>
              <Typography>Contact: {d.contact}</Typography>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
};

export default DonorMatching;
