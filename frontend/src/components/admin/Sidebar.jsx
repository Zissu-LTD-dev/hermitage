import { useState, useEffect } from "react";
import sidebar from "../../assets/css/admin/Sidebar.module.css";
import { useMainContext } from "../../context/mainContext/MainContext";
import { useAdminContext } from "../../context/adminContext/AdminContext";

import store from "../../assets/image/admin/store.svg";
import branchManagement from "../../assets/image/admin/shop.svg";
import approvalsStatus from "../../assets/image/admin/clock.svg";
import blockManagement from "../../assets/image/admin/block.svg";
import documents from "../../assets/image/admin/document.svg";
import addingProducts from "../../assets/image/admin/Iconfeather-plus-circle.svg";
import chat from "../../assets/image/admin/chat.svg";
import generalManagement from "../../assets/image/admin/manage.svg";

import connectedBy from "../../assets/image/manager/Layer3.svg";

function Sidebar() {
  const { state, dispatch } = useMainContext();
  const { state: stateAdmin, dispatch: dispatchAdmin } = useAdminContext();

  const [branchName, setBranchName] = useState("");
  const [isMaster, setIsMaster] = useState(false);

  const logoutHandler = () => {
    dispatch({ type: "CLEAR_STATE" });
    document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    localStorage.clear();
    window.location.href = "/";
  };

  const changeStatus = (status) => {
    dispatchAdmin({ type: "SET_STATUS_ADMIN", payload: status });
  };

  useEffect(() => {
    if (state.userInfo.role === "master" || state.userInfo.role === "admin") {
      setIsMaster(true);
    }
    if (state.userInfo.role === "subAdmin") {
      setBranchName("מנהל תפעול");
    }
    if (state.userInfo.role === "admin") {
      setBranchName("מנהל אדמין");
    }
    if (state.userInfo.role === "master") {
      setBranchName("מאסטר");
    }
  }, [state.userInfo.role]);

  return (
    <>
      <div className={sidebar.sidebar}>
        <div className={sidebar.logo}></div>
        <div className={sidebar.menu}>
          {isMaster && (
            <>
              <div onClick={() => changeStatus("order execution")}>
                <div className={sidebar.icon}>
                  <img src={store} alt="order execution" />
                </div>
                <span> ביצוע הזמנה לסניף</span>
              </div>
              <div onClick={() => changeStatus("approvals status")}>
                <div className={sidebar.icon}>
                  <img src={approvalsStatus} alt="approvals status" />
                </div>
                <span>ניהול אישורי הזמנה</span>
              </div>
              <div onClick={() => changeStatus("branch management")}>
                <div className={sidebar.icon}>
                  <img src={branchManagement} alt="branch management" />
                </div>
                <span>ניהול והגבלת סניפים</span>
              </div>
              <div onClick={() => changeStatus("adding products")}>
                <div className={sidebar.icon}>
                  <img src={addingProducts} alt="adding products" />
                </div>
                <span>ניהול מוצרים</span>
              </div>
              <div onClick={() => changeStatus("block management")}>
                <div className={sidebar.icon}>
                  <img src={blockManagement} alt="block management" />
                </div>
                <span>ניהול מוצרים חסומים</span>
              </div>
              <div onClick={() => changeStatus("documents")}>
                <div className={sidebar.icon}>
                  <img src={documents} alt="documents" />
                </div>
                <span>מסמכים</span>
              </div>
              <div onClick={() => changeStatus("message")}>
                <div className={sidebar.icon}>
                  <img src={chat} alt="message" />
                </div>
                <span>הודעות</span>
              </div>
              <div onClick={() => changeStatus("general management")}>
                <div className={sidebar.icon}>
                  <img src={generalManagement} alt="general management" />
                </div>
                <span>ניהול כללי</span>
              </div>
            </>
          )}
          {!isMaster && (
            <>
              <div onClick={() => changeStatus("order execution")}>
                <div className={sidebar.icon}>
                  <img src={store} alt="order execution" />
                </div>
                <span> ביצוע הזמנה לסניף</span>
              </div>
              <div onClick={() => changeStatus("approvals status")}>
                <div className={sidebar.icon}>
                  <img src={approvalsStatus} alt="approvals status" />
                </div>
                <span>ניהול אישורי הזמנה</span>
              </div>
              <div onClick={() => changeStatus("branch management")}>
                <div className={sidebar.icon}>
                  <img src={branchManagement} alt="branch management" />
                </div>
                <span>ניהול והגבלת סניפים</span>
              </div>
              <div onClick={() => changeStatus("message")}>
                <div className={sidebar.icon}>
                  <img src={chat} alt="message" />
                </div>
                <span>הודעות</span>
              </div>
              <div onClick={() => changeStatus("documents")}>
                <div className={sidebar.icon}>
                  <img src={documents} alt="documents" />
                </div>
                <span>מסמכים</span>
              </div>
            </>
          )}
        </div>
        <div className={sidebar.connectedBy}>
          <div className={sidebar.icon}>
            <img src={connectedBy} alt="connected by" />
          </div>
          <div>
            <p>
              מחובר: <span className={sidebar.branch_name}> {branchName} </span>{" "}
            </p>
            <a onClick={logoutHandler} className={sidebar.logout}>
              יציאה מהמערכת
            </a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
