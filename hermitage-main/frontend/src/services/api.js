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
const apiRequest = async (endpoint, method = "GET", payload = null, role = null) => {
  const token = cookie.get("token");

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      role: role ? role : null
    },
  };

  if (payload) {
    options.body = JSON.stringify(payload);
  }

  const url = `${REACT_APP_BACKEND_URL}${endpoint}`;

  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      return false;
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


export default apiRequest;