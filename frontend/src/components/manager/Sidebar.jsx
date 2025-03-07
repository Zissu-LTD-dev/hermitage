import { useState, useEffect } from "react";
import sidebar from "../../assets/css/manager/Sidebar.module.css";
import { useMainContext } from "../../context/mainContext/MainContext";

import massage from "../../assets/image/manager/chat1.svg";
import newOrder from "../../assets/image/manager/Layer68.svg";
import waitingOrders from "../../assets/image/manager/clock.svg";
import documents from "../../assets/image/manager/document.svg";
import branchLayout from "../../assets/image/manager/Iconfeather-eye-1.svg";
import connectedBy from "../../assets/image/manager/Layer3.svg";

function Sidebar() {
  const { state, dispatch } = useMainContext();
  const [branchName, setBranchName] = useState("");

  const logoutHandler = () => {
    dispatch({ type: "CLEAR_STATE" });
    document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    localStorage.setItem("user", null);
    window.location.href = "/";
  };

  const changeStatus = (status) => {
    if(status == "new order") dispatch({ type: "CLEAR_ORDER" });
    dispatch({ type: "SET_STATUS", payload: status });
  };

  useEffect(() => {
    if (state.userInfo.branch) {
      setBranchName(state.userInfo.branch.name);
    }
  } , [state.userInfo]);

  return (
    <>
      <div className={sidebar.sidebar}>
        <div className={sidebar.logo}></div>
        <div className={sidebar.menu}>
        <div onClick={() => changeStatus("messages")}>
            <div className={sidebar.icon}>
              <img src={massage} alt="massage" />
            </div>
            <span>הודעות</span>
            {state.unreadMessages > 0 &&
              <span className={sidebar.unread}>{state.unreadMessages}</span>
            }
          </div>
          <div onClick={() => changeStatus("new order")}>
            <div className={sidebar.icon}>
              <img src={newOrder} alt="new order" />
            </div>
            <span>הזמנה חדשה</span>
          </div>
          <div onClick={() => changeStatus("pending orders")}>
            <div className={sidebar.icon}>
              <img src={waitingOrders} alt="waiting orders" />
            </div>
            <span>סטטוס הזמנות</span>
          </div>
          <div onClick={() => changeStatus("documents")}>
            <div className={sidebar.icon}>
              <img src={documents} alt="documents" />
            </div>
            <span>מסמכים</span>
          </div>
          {/* <div>
            <div className={sidebar.icon}>
              <img src={branchLayout} alt="branchLayout" />
            </div>
            <span>פריסת הסניף</span>
          </div> */}
        </div>
        <div className={sidebar.connectedBy}>
          <div className={sidebar.icon}>
            <img src={connectedBy} alt="connected by" />
          </div>
          <div>
            <p>מחובר: <span className={sidebar.branch_name}> {branchName} </span> </p>
            <a onClick={logoutHandler} className={sidebar.logout}>יציאה מהמערכת</a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
