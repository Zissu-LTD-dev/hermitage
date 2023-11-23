import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import login from "../assets/css/login.module.css";
import { useOrderContext } from "../context/orderContext/OrderContext";

import logo from "../assets/image/logo/logo.png";
import enter from "../assets/image/logo/enter.svg";

const { REACT_APP_BACKEND_URL } = import.meta.env;

function Login() {
  const { state, dispatch } = useOrderContext();

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch(`${REACT_APP_BACKEND_URL}auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const { token, user } = await response.json();

    document.cookie = `token=${token}`;
    localStorage.setItem("user", JSON.stringify(user));
    dispatch({ type: "SET_USER_INFO", payload: user });

    if (user.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }

    setEmail("");
    setPassword("");
  };

  useEffect(() => {
    dispatch({ type: "CLEAR_STATE" });
    document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    localStorage.clear();
  }, []);


  return (
    <div className={login.bgi}>
      <div className={login.login}>
        <span className={login.logo}>
          <img src={logo} alt="logo" />
        </span>
        <span className={login.fields}>
          <form onSubmit={handleSubmit}>
            <img className={login.enterImg} src={enter} alt="enter" />
            <h2 className={login.title}>כניסה למערכת</h2>
            <div className={login.lineBrack}></div>
            {/* שם משתמש */}
            <input
              className={login.input}
              type="email"
              placeholder="שם משתמש"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />
            {/* סיסמא */}
            <input
              className={login.input}
              type="password"
              placeholder="סיסמא"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            {/* זכור אותי */}
            <div className={login.remember}>
              <label>זכור אותי</label>
              <input type="checkbox" />
            </div>
            {/* כניסה */}
            <button className={login.btn} type="submit">
              כניסה
            </button>
          </form>
        </span>
      </div>
    </div>
  );
}

export default Login;
