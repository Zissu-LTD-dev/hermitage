// creat useAxios hook
import { useState, useEffect } from "react";
import axios from "axios";
// config axios default
axios.defaults.baseURL = "http://localhost:5000/api/v1";
axios.defaults.headers.post["Content-Type"] = "application/json";
axios.defaults.headers.post["Accept"] = "application/json";

const useAxios = (url, method, body = null, headers = null) => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const res = await axios({
        url,
        method,
        data: body,
        headers,
      });
      setResponse(res.data);
    } catch (err) {
      setError(err.response.data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return { response, error, isLoading };
};

export default useAxios;
