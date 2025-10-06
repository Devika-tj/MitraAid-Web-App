import React, { useState } from "react";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/700.css";
import { AppBar, Box, Toolbar, IconButton, Typography, Menu, MenuItem, Container, Button, Avatar, Tooltip, ListItemIcon, Divider, TextField, InputAdornment,} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AccountCircle from "@mui/icons-material/AccountCircle";
import EditIcon from "@mui/icons-material/Edit";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const isDashboard =
    location.pathname.includes("dashboard") ||
    location.pathname.includes("volunteer-dashboard") ||
    location.pathname.includes("admin-dashboard");

  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);
  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);

  const handleEditProfile = () => {
    handleCloseUserMenu();
    navigate("/edit-profile");
  };

  const handleSettings = () => {
    handleCloseUserMenu();
    navigate("/settings");
  };

  const handleLogout = () => {
    localStorage.clear();
    handleCloseUserMenu();
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
  };

  const homePages = [
    { name: "Home", id: "hero" },
    { name: "About Us", id: "about" },
    { name: "Contact Us", id: "contact" },
    { name: "Trainings & Guidance", id: "trainings" },
  ];

  const dashboardLinks = {
    Admin: [
      { name: "Messages", path: "/admin-dashboard" },
      { name: "Add Guidance", path: "/guidance" },
      { name: "UserDashboard", path: "/dashboard" },
      { name: "VolunteerDashboard", path: "/volunteer-dashboard" },
      { name: "ViewDonations", path: "/view-donations" },
    ],
    Responder: [
      { name: "Blood Requests", path: "/blood-requests" },
      { name: "Nearby Hospitals", path: "/volunteer-dashboard#map" },
      { name: "Donor Registration", path: "/donor-registration" },
    ],
    User: [
      { name: "Donor Info", path: "/view-donations" },
      { name: "Profile", path: "/dashboard" },
      { name: "Donor Registration", path: "/donor-registration" },
    ],
  };

  const pages = isDashboard && user.role ? dashboardLinks[user.role] : homePages;


  const handleNavClick = (item) => {
    handleCloseNavMenu();

    if (item.path) {
      
      navigate(item.path);
    } else {
     
      if (location.pathname !== "/") {
      
        navigate(`/?scrollTo=${item.id}`);
      } else {
       
        const section = document.getElementById(item.id);
        if (section) section.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <AppBar position="sticky" sx={{ backgroundColor: "white", color: "#174385" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          
          <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
            <Box
              component="img"
              sx={{ height: 60, width: 60, mr: 1 }}
              src="public/logo__Icon.png"
              alt="MitraAid"
            />
            <Typography variant="h5" sx={{ fontWeight: "bold" }}>
              <span style={{ color: "#174385" }}>Mitra</span>
              <span style={{ color: "#4ea446" }}>Aid</span>
            </Typography>
          </Box>

         
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton onClick={handleOpenNavMenu} color="inherit">
              <MenuIcon />
            </IconButton>
            <Menu
              anchorEl={anchorElNav}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
            >
              {pages.map((item) => (
                <MenuItem key={item.name} onClick={() => handleNavClick(item)}>
                  <Typography>{item.name}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>

          
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "center",
            }}
          >
            {pages.map((item) => (
              <Button
                key={item.name}
                onClick={() => handleNavClick(item)}
                sx={{ color: "#191970", mx: 1 }}
              >
                {item.name}
              </Button>
            ))}
          </Box>

         
          <Box component="form" onSubmit={handleSearch} sx={{ mr: 2 }}>
            <TextField
              size="small"
              placeholder="Search..."
              variant="outlined"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                backgroundColor: "#f8f9fa",
                borderRadius: 1,
                width: { xs: 120, sm: 180, md: 220 },
                "& .MuiOutlinedInput-root": { borderRadius: 3 },
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton type="submit" edge="end" size="small">
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

        
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            {!isDashboard && (
              <>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => navigate("/emergency-Alert")}
                >
                  EMERGENCY - GET HELP NOW
                </Button>
                <Button
                  variant="contained"
                  onClick={() => navigate("/fund-donation")}
                  startIcon={<FavoriteIcon />}
                  sx={{
                    backgroundColor: "#f32020ff",
                    color: "white",
                    fontWeight: "bold",
                    "&:hover": { backgroundColor: "#c62828" },
                  }}
                >
                  Donate
                </Button>
              </>
            )}

           
            {user?.name ? (
              <>
                <Tooltip title="Profile">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    {user.avatar ? (
                      <Avatar src={user.avatar} alt={user.name} />
                    ) : (
                      <AccountCircle sx={{ fontSize: 35, color: "#174385" }} />
                    )}
                  </IconButton>
                </Tooltip>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: "#174385",
                    fontWeight: "600",
                    display: { xs: "none", sm: "block" },
                    cursor: "pointer",
                  }}
                  onClick={handleOpenUserMenu}
                >
                  {user.name}
                </Typography>
                <Menu
                  anchorEl={anchorElUser}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem onClick={handleEditProfile}>
                    <ListItemIcon>
                      <EditIcon fontSize="small" />
                    </ListItemIcon>
                    Edit Profile
                  </MenuItem>
                  <MenuItem onClick={handleSettings}>
                    <ListItemIcon></ListItemIcon>
                    Settings
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                variant="outlined"
                onClick={() => navigate("/login")}
                sx={{ borderColor: "#174385", color: "#174385" }}
              >
                Login
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
