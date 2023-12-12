import { useState, useEffect } from 'react';

import cookie from "js-cookie";
const { REACT_APP_BACKEND_URL } = import.meta.env;

const useFetch = (url, method = "GET", body = null) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    body = body ? JSON.stringify(body) : null;
    const fetchData = async () => {
      try {
        const response = await fetch(`${REACT_APP_BACKEND_URL}${url}`, {
          method,
          headers: {
                Authorization: `Bearer ${cookie.get("token")}`,
            },
            body: body  
            });
        const result = await response.json();
        setData(result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

export default useFetch;