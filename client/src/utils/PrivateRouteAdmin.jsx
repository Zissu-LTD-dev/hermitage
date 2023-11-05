import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
const {REACT_APP_BACKEND_URL} = import.meta.env

import cookie from "js-cookie";

function PrivateRouteAdmin({ children }) {
  if (!cookie.get("token")) return <Navigate to="/login" replace />;

  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);

  async function checkAuth() {
      const res = await fetch(`${REACT_APP_BACKEND_URL}auth/verify`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie.get("token")}`,
        role: `admin`,
      },
    });
    const data = await res.json();

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
  return <Navigate to="/login" replace />;
}

export default PrivateRouteAdmin;
