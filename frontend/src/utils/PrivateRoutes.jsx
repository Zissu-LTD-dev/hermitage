import { useState, useEffect } from "react";
import { Navigate, json } from "react-router-dom";
import apiRequest from "../services/api";

const {REACT_APP_BACKEND_URL} = import.meta.env
import cookie from "js-cookie";

function PrivateRoute({ children}) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
//   useState for role 
  const [role, setRole] = useState(null);

  const checkAuth = async () => {
    let user = localStorage.getItem("user") ? localStorage.getItem("user") : null;

    const data = await apiRequest("auth/verify", "GET", null, JSON.parse(user).role);
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
    if (!cookie.get("token") || cookie.get("token") === "undefined") {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }
    checkAuth();
  }, []);

  if (loading && !isAuthenticated) return 
  if (isAuthenticated) {
    if (role == "admin") return <Navigate to="/admin" replace />;
    if (role == "branch manager") return <Navigate to="/manager" replace />;
  }
  if (!isAuthenticated) return  children;
}

export default PrivateRoute;
