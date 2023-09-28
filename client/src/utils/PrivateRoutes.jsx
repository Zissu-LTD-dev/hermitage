import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

import cookie from "js-cookie";

function PrivateRoute() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
//   useState for role 
  const [role, setRole] = useState(null);

  async function checkAuth() {
    if (!cookie.get("token")) return setIsAuthenticated(false);
    const res = await fetch("http://localhost:5000/api/v1/auth/verify", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${cookie.get("token")}`,
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
  // if (isAuthenticated && role == "admin") return <Navigate to="/admin" replace />;
  // if (isAuthenticated && role == "manager") return <Navigate to="/manager" replace />;
  if (isAuthenticated) {
    if (role == "admin") return <Navigate to="/admin" replace />;
    if (role == "manager") return <Navigate to="/manager" replace />;
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;
}

export default PrivateRoute;
