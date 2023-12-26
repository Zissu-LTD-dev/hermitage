import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import apiRequest from "../services/api";

import cookie from "js-cookie";

function PrivateRouteManager({ children }) {
  if (!cookie.get("token") || !cookie.get("token") == "undefined") return <Navigate to="/" replace />;

  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);

  const checkAuth = async () => {
    const data = await apiRequest("auth/verify", "GET", null, "branch manager");
    if (data.success) {
      setRole(data.role);
      setIsAuthenticated(true);
      setLoading(false);
    } else {
      setLoading(false);
      setRole(null);
      setIsAuthenticated(false);
    }
  }

  useEffect(() => {
    checkAuth();
  }, []);

  if (loading) return
  if (isAuthenticated && role == "branch manager") return children;
  if (isAuthenticated && role == "admin") return <Navigate to="/admin" replace />;
  return <Navigate to="/" replace />;
}

export default PrivateRouteManager;
