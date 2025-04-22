import { useState, useEffect } from "react";
import { useMainContext } from "../../context/mainContext/MainContext";
import popups from "../../assets/css/popups/popups.module.css";

function SuccessPopup({ isShow, message }) {
  const { state, dispatch } = useMainContext();
  const [show, setShow] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      dispatch({
        type: "SET_SHOW_SUCCESS",
        payload: { show: false, message: "" },
      });
    }, 4000);
  }, []);

  useEffect(() => {
    setShow(isShow);
  }, [isShow]);

  return (
    <>
      {show && (
        <div className={popups.main + " " + popups.success}>
          {/* <div className={popups.title}>Success</div> */}
          <div className={popups.message}>{message}</div>
          <div className={popups.icon}></div>
        </div>
      )}
    </>
  );
}

export default SuccessPopup;
