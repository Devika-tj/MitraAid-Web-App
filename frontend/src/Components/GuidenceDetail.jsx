import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {Box,Typography,Grid,Card,CardContent,CardMedia,Divider,CircularProgress,} from "@mui/material";
import axios from "axios";

const GuidanceDetail = () => {
  const { id } = useParams();
  const [guide, setGuide] = useState(null);

  useEffect(() => {
    const cached = JSON.parse(localStorage.getItem("guides"));
    const localGuide = cached?.find((g) => g._id === id);
    if (localGuide) {
      setGuide(localGuide);
    } else {
      axios
        .get(`http://localhost:8000/api/guidance/${id}`)
        .then((res) => setGuide(res.data))
        .catch((err) => console.error("Error fetching guide:", err));
    }
  }, [id]);

  if (!guide)
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography sx={{ mt: 2 }}>Loading guide...</Typography>
      </Box>
    );

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, backgroundColor: "#fafafa", minHeight: "100vh" }}>
      {/* Title + Main Image */}

      
      <Typography variant="body1" sx={{ mb: 3 }}>
        {guide.title}
      </Typography>

      <Typography variant="body1" sx={{ mb: 3 }}>
        {guide.description}
      </Typography>

      <Divider sx={{ my: 3 }} />
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Step-by-Step Guide
      </Typography>

      
      <Grid container spacing={3}>
        {guide.steps.map((step, idx) => (
          <Grid item xs={12} key={idx}>
            <Card
              elevation={3}
              sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                borderRadius: 3,
                overflow: "hidden",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                "&:hover": { transform: "scale(1.01)", boxShadow: 6 },
              }}
            >
              {step.image && (
                <CardMedia
                  component="img"
                  image={step.image}
                  alt={`Step ${idx + 1}`}
                  sx={{
                    width: { xs: "100%", md: 350 },
                    height: { xs: 200, md: "auto" },
                    objectFit: "cover",
                  }}
                />
              )}

              <CardContent sx={{ flex: 1 }}>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                  color="error"
                  gutterBottom
                >
                  Step {idx + 1}
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                  {typeof step === "string" ? step : step.text}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default GuidanceDetail;
