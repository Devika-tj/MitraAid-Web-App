import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuth = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (!token) {
        navigate("/login");
        return;
      }

      localStorage.setItem("token", token);

      try {
        const res = await axios.get("http://localhost:8000/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          localStorage.setItem("user", JSON.stringify(res.data.user));

          if (res.data.user.role === "Admin") {
            navigate("/admin-dashboard");
          } else if (res.data.user.role === "Responder") {
            navigate("/volunteer-dashboard");
          } else {
            navigate("/dashboard");
          }
        } else {
          navigate("/login");
        }
      } catch (error) {
        navigate("/login");
      }
    };

    handleAuth();
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Logging you in...</h2>
      <p>Please wait while we redirect you to the dashboard.</p>
    </div>
  );
};

export default AuthSuccess;
