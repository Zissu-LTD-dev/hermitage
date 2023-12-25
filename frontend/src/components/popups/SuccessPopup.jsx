import { useState, useEffect } from "react";
import popups from "../../assets/css/popups/popups.module.css";

function SuccessPopup({ isShow, message = "עבר בהצלחה" }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShow(false);
    }, 7000);
  }, []);

  useEffect(() => {
    setShow(isShow);
  }, [isShow]);

  return (
    <>
      {show && (
        <div className={popups.main + " " + popups.success}>
          {/* <div className={popups.content}> */}
            <div className={popups.title}>Success</div>
            <div className={popups.message}>{message}</div>
          {/* </div> */}
          <div className={popups.icon}></div>
        </div>
      )}
    </>
  );
}

export default SuccessPopup;
