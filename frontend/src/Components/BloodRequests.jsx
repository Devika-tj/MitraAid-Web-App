import React, { useEffect, useState } from "react";
import { Box, Container, Typography, TextField, Button, Grid, Card, CardContent } from "@mui/material";
import axios from "axios";

const BloodRequests = () => {
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({ patientName: "", bloodGroup: "", hospital: "", contact: "" });
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchRequests = async () => {
    const res = await axios.get("http://localhost:8000/api/blood-requests");
    setRequests(res.data);
  };

  useEffect(()=>{ fetchRequests(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:8000/api/blood-requests", form, { headers: { Authorization: `Bearer ${token}` }});
      alert("Request created. Matched donors: " + (res.data.matchedCount ?? 0));
      setForm({ patientName: "", bloodGroup: "", hospital: "", contact: "" });
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.msg || "Error creating request");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this request?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/blood-requests/${id}`, { headers: { Authorization: `Bearer ${token}` }});
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.msg || "Error deleting");
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
    <Container sx={{ py: 3 }}>
      <Typography variant="h5" gutterBottom>Request for Blood</Typography>

      {/* Create form */}
      <Box component="form" onSubmit={handleCreate} sx={{ mb: 3, mr:30 }}>
        <Grid container spacing={2}>
          <TextField label="Patient name" name="patientName" value={form.patientName} onChange={(e)=>setForm({...form, patientName: e.target.value})} fullWidth required />
         <TextField label="Blood group" name="bloodGroup" value={form.bloodGroup} onChange={(e)=>setForm({...form, bloodGroup: e.target.value})} fullWidth required />
          <TextField label="Hospital" name="hospital" value={form.hospital} onChange={(e)=>setForm({...form, hospital: e.target.value})} fullWidth required />
          <TextField label="Contact" name="contact" value={form.contact} onChange={(e)=>setForm({...form, contact: e.target.value})} fullWidth required />
        </Grid>
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>Create Request</Button>
      </Box>

      {/* List of requests */}
      <Grid container spacing={2}>
        {requests.map((r)=>(
          <Grid item xs={12} md={6} key={r._id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{r.patientName} • {r.bloodGroup}</Typography>
                <Typography>Hospital: {r.hospital}</Typography>
                <Typography>Contact: {r.contact}</Typography>
                <Typography>Requested by: {r.requester?.name || "Unknown"}</Typography>
                <Typography variant="caption">{new Date(r.createdAt).toLocaleString()}</Typography>
                <Box sx={{ mt: 1 }}>
                  {/* Show delete if owner or admin */}
                  { (r.requester && r.requester._id === user.id) || user.role === "Admin" ? (
                    <Button variant="outlined" color="error" onClick={()=>handleDelete(r._id)} sx={{ mt: 1 }}>Delete</Button>
                  ) : null }
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
    </Box>
  );
};

export default BloodRequests;
