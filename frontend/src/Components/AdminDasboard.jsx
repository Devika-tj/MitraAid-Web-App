import React, { useEffect, useState } from "react";
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";

const AdminDashboard = () => {
  const [messages, setMessages] = useState([]);
  const [guides, setGuides] = useState([]);
  const [requests, setRequests] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState({
    title: "",
    category: "",
    description: "",
    steps: [],
    image: "",
  });

  useEffect(() => {
    fetchMessages();
    fetchGuides();
    fetchRequests();
  }, []);

  
  const fetchMessages = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/contact");
      setMessages(res.data);
    } catch (err) {
      console.error("Error fetching messages", err);
    }
  };

  const fetchGuides = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/guidance");
      setGuides(res.data);
    } catch (err) {
      console.error("Error fetching guidance", err);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/blood-requests");
      setRequests(res.data.filter((r) => r.status === "Active"));
    } catch (err) {
      console.error("Error fetching blood requests:", err);
    }
  };


  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleImageUpload = (e) => {
    const reader = new FileReader();
    reader.onloadend = () => setForm({ ...form, image: reader.result });
    reader.readAsDataURL(e.target.files[0]);
  };

  const addStep = () => {
    setForm({
      ...form,
      steps: [...form.steps, { text: "", image: "" }],
    });
  };

  const handleStepChange = (index, field, value) => {
    const updatedSteps = [...form.steps];
    updatedSteps[index][field] = value;
    setForm({ ...form, steps: updatedSteps });
  };

  const handleStepImage = (index, file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedSteps = [...form.steps];
      updatedSteps[index].image = reader.result;
      setForm({ ...form, steps: updatedSteps });
    };
    reader.readAsDataURL(file);
  };

  
  const handleSubmit = async () => {
    try {
      if (editingId) {
        // Update existing guidance
        await axios.put(`http://localhost:8000/api/guidance/${editingId}`, form);
        alert("Guidance updated successfully!");
      } else {
        // Create new guidance
        await axios.post("http://localhost:8000/api/guidance", form);
        alert("Guidance added successfully!");
      }

      // Reset form after submit
      setForm({
        title: "",
        category: "",
        description: "",
        steps: [],
        image: "",
      });
      setEditingId(null);
      fetchGuides();
    } catch (err) {
      console.error("Error saving guidance:", err);
      alert("Failed to save guidance.");
    }
  };

  
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this guidance?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/guidance/${id}`);
      alert("Deleted successfully");
      fetchGuides();
    } catch {
      alert("Error deleting");
    }
  };

  
  const handleEdit = (guide) => {
    setEditingId(guide._id);
    setForm({
      title: guide.title,
      category: guide.category,
      description: guide.description,
      steps: guide.steps || [],
      image: guide.image || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm({
      title: "",
      category: "",
      description: "",
      steps: [],
      image: "",
    });
  };

  
  const handleDeleteContact = async (id) => {
    if (!window.confirm("Delete this contact message?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/contact/${id}`);
      alert("Contact message deleted");
      fetchMessages();
    } catch (err) {
      alert("Error deleting contact message");
    }
  };

  const isFormValid =
    form.title.trim() &&
    form.category.trim() &&
    form.description.trim() &&
    form.steps.length > 0 &&
    form.image.trim();


  return (
    <Box sx={{ p: 4 }}>

      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#191277ff", color: "white", borderRadius: 2, py: 2, px: 3, mb: 3, boxShadow: 2 }}>
                  <Typography variant="h5" fontWeight="bold">Welcome,SuperAdmin !</Typography>
        </Box>

      <Typography variant="h4" gutterBottom fontWeight={'bold'}>
        Contact Messages
      </Typography>
      <Grid container spacing={3}>
        {messages.length === 0 ? (
          <Typography>No contact messages found</Typography>
        ) : (
          messages.map((msg) => (
            <Grid item xs={12} sm={6} md={4} key={msg._id}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6">{msg.name}</Typography>
                  <Typography variant="body2">{msg.email}</Typography>
                  <Typography variant="subtitle2">{msg.subject}</Typography>
                  <Typography variant="body1" sx={{ mt: 1 }}>
                    {msg.message}
                  </Typography>
                  <Button
                    variant="outlined"
                    color="error"
                    sx={{ mt: 1 }}
                    onClick={() => handleDeleteContact(msg._id)}
                  >
                    Delete
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>

  {/* Blood Requests */}
      <Typography variant="h4" sx={{ mt: 5 }} gutterBottom fontWeight={'bold'}>
        Active Blood Requests
      </Typography>
      <Grid container spacing={3}>
        {requests.length === 0 ? (
          <Typography>No active requests</Typography>
        ) : (
          requests.map((r) => (
            <Grid item xs={12} sm={6} md={4} key={r._id}>
              <Card elevation={3}>
                <CardContent>
                  <Typography variant="h6">{r.patientName}</Typography>
                  <Typography>Blood Group: {r.bloodGroup}</Typography>
                  <Typography>Hospital: {r.hospital}</Typography>
                  <Typography>Contact: {r.contact}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>


      <Box
        sx={{
          p: 3,
          background: editingId ? "#fff3e0" : "#f8f8f8",
          borderRadius: 2,
          mb: 4,
          mt: 5,
        }}
      >
        <Typography
          variant="h5"
          gutterBottom
          color={editingId ? "warning.main" : "text.primary"}
        >
          {editingId ? "Edit Guidance" : "Add New Guidance"}
        </Typography>

        <TextField
          name="title"
          label="Title *"
          fullWidth
          value={form.title}
          onChange={handleChange}
          sx={{ mt: 1 }}
        />
        <TextField
          name="category"
          label="Category *"
          fullWidth
          value={form.category}
          onChange={handleChange}
          sx={{ mt: 1 }}
        />
        <TextField
          name="description"
          label="Description *"
          fullWidth
          multiline
          rows={2}
          value={form.description}
          onChange={handleChange}
          sx={{ mt: 1 }}
        />

        {/* Steps */}
        <Typography variant="h6" sx={{ mt: 3 }}>
          Steps (with demonstration image)
        </Typography>
        {form.steps.map((step, index) => (
          <Box
            key={index}
            sx={{ mb: 2, background: "#fff", p: 2, borderRadius: 2 }}
          >
            <TextField
              label={`Step ${index + 1} Description`}
              fullWidth
              value={step.text}
              onChange={(e) => handleStepChange(index, "text", e.target.value)}
              sx={{ mb: 1 }}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleStepImage(index, e.target.files[0])}
            />
            {step.image && (
              <Box
                component="img"
                src={step.image}
                alt={`Step ${index + 1}`}
                sx={{
                  width: 200,
                  height: 120,
                  mt: 1,
                  borderRadius: 1,
                  objectFit: "cover",
                  boxShadow: 1,
                }}
              />
            )}
          </Box>
        ))}
        <Button
          variant="outlined"
          sx={{ mt: 1 }}
          onClick={addStep}
          startIcon={<AddIcon />}
        >
          Add Step
        </Button>

        <Typography variant="subtitle1" sx={{ mt: 2 }}>
          Upload Cover Image *
        </Typography>
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        {form.image && (
          <Box
            component="img"
            src={form.image}
            alt="Preview"
            sx={{
              width: 200,
              height: 120,
              mt: 2,
              borderRadius: 2,
              objectFit: "cover",
              boxShadow: 2,
            }}
          />
        )}

        
        <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!isFormValid}
          >
            {editingId ? "Update Guidance" : "Add Guidance"}
          </Button>

          {editingId && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleCancelEdit}
            >
              Cancel Edit
            </Button>
          )}
        </Box>
      </Box>

    {/* Guiddence List */}
      <Typography variant="h4" sx={{ mb: 2 }}>
        Existing Guidance
      </Typography>
      <Grid container spacing={3}>
        {guides.length === 0 ? (
          <Typography>No guidance added yet.</Typography>
        ) : (
          guides.map((g) => (
            <Grid item xs={12} sm={6} md={4} key={g._id}>
              <Card
                elevation={editingId === g._id ? 6 : 2}
                sx={{
                  border:
                    editingId === g._id
                      ? "2px solid #ffa726"
                      : "1px solid #eee",
                  transition: "0.3s",
                }}
              >
                <CardContent>
                  <Typography variant="h6">{g.title}</Typography>
                  <Typography variant="subtitle2">{g.category}</Typography>
                  <Typography variant="body2">{g.description}</Typography>
                  {g.image && (
                    <img
                      src={g.image}
                      alt={g.title}
                      style={{
                        width: "10%",
                        marginTop: 8,
                        borderRadius: 6,
                        height: '20%',
                        objectFit: "cover",
                      }}
                    />
                  )}
                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant="outlined"
                      color="primary"
                      sx={{ mr: 1 }}
                      onClick={() => handleEdit(g)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={() => handleDelete(g._id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        )}
      </Grid>
    </Box>
  );
};

export default AdminDashboard;
