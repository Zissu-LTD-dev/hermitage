import cookie from "js-cookie";
const { REACT_APP_BACKEND_URL } = import.meta.env;

/**
 * 
 * @param {*} endpoint 
 * @param {*} method default is GET
 * @param {*} payload default is null
 * @param {*} role default is null
 * @returns {Promise} 
 */
const apiRequestForForm = async (endpoint, method = "GET", payload = null, role = null, ContentType = "application/json") => {
    const token = cookie.get("token");
  
    const options = {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        role: role ? role : null,
        "Content-Type": ContentType,
      },
    };
    
    if (payload) {
      options.body = JSON.stringify(payload);
    }
  
    const url = `${REACT_APP_BACKEND_URL}${endpoint}`;
  
    try {
      const response = await fetch(url, options);
  
      if (!response.ok) {
        return response.ok;
        // throw new Error("API request failed");
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      // throw error;
      return false;
    }
  };
  
  
  export default apiRequestForForm;