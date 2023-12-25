import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import apiRequest from "../services/api";

import cookie from "js-cookie";

function PrivateRouteAdmin({ children }) {
  if (!cookie.get("token")) return <Navigate to="/" replace />;

  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);

  const checkAuth = async () => {
    const data = await apiRequest("auth/verify", "GET", null, "admin");
    if (data.success) {
      setRole(data.role);
      setIsAuthenticated(true);
      setLoading(false);
    }else{
      setRole(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  }

  useEffect(() => {
    checkAuth();
  }, []);

  if (loading) return <h1>Loading...</h1>;
  if (isAuthenticated && role == "admin") return children;
  return <Navigate to="/" replace />;
}

export default PrivateRouteAdmin;
