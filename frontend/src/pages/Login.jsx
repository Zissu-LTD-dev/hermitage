import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import login from "../assets/css/login.module.css";
import { useMainContext } from "../context/mainContext/MainContext.jsx";
import apiRequest from "../services/api";

import { ErrorPopup, LoaderPopup } from "../components/popups";

import logo from "../assets/image/logo/logo.png";
import enter from "../assets/image/logo/enter.svg";

function Login() {
  const { state, dispatch } = useMainContext();

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showLoader, setShowLoader] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    setShowLoader(true);
    const data = await apiRequest("auth/login", "POST", { email, password });

    if (!data) {
      setShowLoader(false);
      setShowError(true);
      return;
    }

    const { token, user } = data;

    document.cookie = `token=${token}`;
    localStorage.setItem("user", JSON.stringify(user));
    dispatch({ type: "SET_USER_INFO", payload: user });

    if (user.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/manager");
    }

    setShowLoader(false);
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
      {showLoader && <LoaderPopup isShow={showLoader} />}
      {showError && <ErrorPopup isShow={showError} />}
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
              <label htmlFor="remember" >זכור אותי</label>
              <input name="remember" id="remember" type="checkbox" />
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
