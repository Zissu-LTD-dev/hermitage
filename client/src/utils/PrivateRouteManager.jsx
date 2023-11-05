import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

import cookie from "js-cookie";

function PrivateRouteManager({ children }) {
  if (!cookie.get("token")) return <Navigate to="/login" replace />;

  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);

  // TODO: להכניס את הקריאה ליוז פאטש או אקסיוס
  async function checkAuth() {
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
    } else {
      setLoading(false);
      setRole(null);
      setIsAuthenticated(false);
    }
  }

  useEffect(() => {
    checkAuth();
  }, []);

  if (loading) return <h1>Loading...</h1>;
  if (isAuthenticated && role == "branch manager") return children;
  if (isAuthenticated && role == "admin")
    return <Navigate to="/admin" replace />;
  return <Navigate to="/login" replace />;
}

export default PrivateRouteManager;
