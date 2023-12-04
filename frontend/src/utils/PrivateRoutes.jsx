import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

const {REACT_APP_BACKEND_URL} = import.meta.env
import cookie from "js-cookie";

function PrivateRoute({ children}) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
//   useState for role 
  const [role, setRole] = useState(null);

  async function checkAuth() {
    const res = await fetch(`${REACT_APP_BACKEND_URL}auth/verify`, {
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
    if (  !cookie.get("token")) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }
    checkAuth();
  }, []);

  if (loading && !isAuthenticated) return <h1>Loading...</h1>;
  if (isAuthenticated) {
    if (role == "admin") return <Navigate to="/admin" replace />;
    if (role == "branch manager") return <Navigate to="/manager" replace />;
  }
  if (!isAuthenticated) return  children;
}

export default PrivateRoute;
