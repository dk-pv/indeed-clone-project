// src/components/ProtectedPublic.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProtectedPublic = ({ children }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      // Already logged in, redirect to home
      navigate("/", { replace: true }); // ⚠️ prevent back navigation
    }
  }, [navigate]);

  return children;
};

export default ProtectedPublic;
