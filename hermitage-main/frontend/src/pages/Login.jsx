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
  const [remember, setRemember] = useState(false);

  const [showLoader, setShowLoader] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage("");
    setShowError(false);
    
    setShowLoader(true);
    const data = await apiRequest("auth/login", "POST", { email, password, remember});

    if (!data) {
      setShowLoader(false);
      setErrorMessage("שם משתמש או סיסמה שגויים");
      setShowError(true);
      return;
    }
    
    const { token, user, branch } = data;

    user.branch = branch;

    document.cookie = `token=${token}`;
    await localStorage.setItem("user", JSON.stringify(user));
    await dispatch({ type: "SET_USER_INFO", payload: user });

    if (user.role === "admin" || user.role === "subAdmin" || user.role === "master") {
      navigate("/admin");
    } else {
      navigate("/manager");
    }

    setShowLoader(false);
    setEmail("");
    setPassword("");
  };

  const handleForgotPassword = async (event) => {
    event.preventDefault();
    // setErrorMessage("");
    
    if (!email) {
      setErrorMessage("נא להזין כתובת מייל");
      setShowError(true);
      return;
    }

    setShowLoader(true);
    try {
      const data = await apiRequest("auth/forgotPassword", "POST", { email });
      if (!data) {
        setErrorMessage("לא נמצא משתמש עם כתובת המייל הזו");
        setShowError(true);
        return;
      }

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        setIsForgotPassword(false);
      }, 3000);
    } catch (error) {
      setErrorMessage("אירעה שגיאה, אנא נסה שוב מאוחר יותר");
      setShowError(true);
    } finally {
      setShowLoader(false);
    }
  };

  useEffect(() => {
    dispatch({ type: "CLEAR_STATE" });
    document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    localStorage.setItem("user", null)
  }, []);


  return (
    <div className={login.bgi}>
      {showLoader && <LoaderPopup isShow={showLoader} />}
      {showError && <ErrorPopup isShow={showError} message={errorMessage} />}
      {showSuccess && (
        <div className={login.successPopup}>
          קוד אימות נשלח לכתובת המייל שהזנת
        </div>
      )}
      <div className={login.login}>
        <span className={login.logo}>
          <img src={logo} alt="logo" />
        </span>
        <span className={login.fields}>
          {!isForgotPassword ? (
            <form onSubmit={handleSubmit}>
              <img className={login.enterImg} src={enter} alt="enter" />
              <h2 className={login.title}>כניסה למערכת</h2>
              <div className={login.lineBrack}></div>
              {/* שם משתמש */}
              <input
                className={login.input}
                type="email"
                placeholder="מייל משתמש"
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
                <label htmlFor="remember">זכור אותי</label>
                <input 
                  name="remember" 
                  id="remember" 
                  type="checkbox" 
                  checked={remember} 
                  onChange={() => setRemember(!remember)} 
                />
              </div>
              <div className={login.forgotPassword}>
                <span onClick={() => setIsForgotPassword(true)}>
                  שכחתי סיסמה
                </span>
              </div>
              <button className={login.btn} type="submit">
                כניסה
              </button>
            </form>
          ) : (
            <form onSubmit={handleForgotPassword}>
              <img className={login.enterImg} src={enter} alt="enter" />
              <h2 className={login.title}>שחזור סיסמה</h2>
              <div className={login.lineBrack}></div>
              <input
                className={login.input}
                type="email"
                placeholder="הכנס את כתובת המייל שלך"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
              <button className={login.btn} type="submit">
                שלח קוד אימות
              </button>
              <div className={login.backToLogin}>
                <span onClick={() => setIsForgotPassword(false)}>
                  חזרה להתחברות
                </span>
              </div>
            </form>
          )}
        </span>
      </div>
    </div>
  );
}

export default Login;
