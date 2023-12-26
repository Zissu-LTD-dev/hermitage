import { useState, useEffect } from 'react';
import { useMainContext } from '../context/mainContext/MainContext';

import cookie from "js-cookie";
const { REACT_APP_BACKEND_URL } = import.meta.env;

const useFetch = (url, method = "GET", body = null) => {
  const { state, dispatch } = useMainContext();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    dispatch({ type: "SET_SHOW_LOADER", payload: true });
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
        dispatch({ type: "SET_SHOW_LOADER", payload: false });
        dispatch({ type: "SET_SHOW_SUCCESS", payload: { show: true, message: "הנתונים ירדו בהצלחה" } });
        setData(result);
        setLoading(false);
      } catch (error) {
        dispatch({ type: "SET_SHOW_LOADER", payload: false });
        dispatch({ type: "SET_SHOW_ERROR", payload: { show: true, message: "אירעה שגיאה בהורדת הנתונים" } });
        setError(error);
        setLoading(false);
      } 
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};

export default useFetch;