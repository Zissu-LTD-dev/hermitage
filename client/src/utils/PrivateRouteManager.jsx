import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

import cookie from "js-cookie";

function PrivateRouteManager({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);

  async function checkAuth() {
    if (!cookie.get("token")) return setIsAuthenticated(false);
    const res = await fetch("http://localhost:5000/api/v1/auth/verify", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie.get("token")}`,
        role: `branch manager`,
      },
    });
    const data = await res.json();
    console.log(data);
    if (data.success) {
      setRole(data.role);
      setIsAuthenticated(true);
      setLoading(false);
    }
    if (!data.success) {
      setRole(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  }

  useEffect(() => {
    checkAuth();
  }, []);

  if (loading) return <h1>Loading...</h1>;
  if (isAuthenticated && role == 'branch manager' ) return children;
  return <Navigate to="/login" replace />;
}

export default PrivateRouteManager;
