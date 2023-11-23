import { useState, useEffect } from "react";
// cookie
import cookies from "js-cookie";

import axios from "axios";

axios.defaults.baseURL = "http://localhost:5000/api/v1";
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.post["Accept"] = "application/json";


const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      // get token from cookie
      const token = cookies.get('token');
      console.log(token);
      try {
        const response = await fetch("http://localhost:5000/api/v1/auth/verify",{
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });
        const data = await response.json();
        console.log(data.role);
        if (data.role) {
          setIsAuthenticated(true);
          setUser(data.role);
        }
        else {
          setIsAuthenticated(false);
          setUser(null);
        }

      } catch (error) {
        console.log(error);
      }
    };
    checkAuth();
  }, []);

  return { isAuthenticated, user, setIsAuthenticated, setUser };
};

export default useAuth;