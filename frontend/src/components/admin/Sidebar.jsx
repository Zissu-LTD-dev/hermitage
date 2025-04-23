import { useState, useEffect } from "react";
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
    localStorage.setItem("user", null);
    window.location.href = "/";
  };

  const changeStatus = (status) => {
    localStorage.setItem("statusSidebar", status);
    if (status == "order execution") dispatch({ type: "CLEAR_ORDER" });
    if (status === "adding products" || status === "general management") {
      window.location.reload();
    } else {
      dispatchAdmin({ type: "SET_STATUS_ADMIN", payload: status });
    }
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

  useEffect(() => {
    let status = localStorage.getItem("statusSidebar");
    if (status) {
      dispatchAdmin({ type: "SET_STATUS_ADMIN", payload: status });
    }
  }, []);

  return (
    <div className="sidebar flex flex-column align-center" style={{
      width: '20%',
      height: '100vh',
      position: 'fixed',
      top: 0,
      right: 0,
      background: '#082a3a',
      padding: '1rem'
    }}>
      <div className="logo" style={{
        width: '100%',
        height: '85px',
        backgroundImage: 'url(../../image/logo/logo.png)',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: '174px 31px',
        borderBottom: '1px solid #25607e9a'
      }}></div>
      
      <div className="menu flex flex-column align-center" style={{ width: '100%' }}>
        {isMaster && (
          <>
            <div onClick={() => changeStatus("order execution")} className="flex flex-row-reverse align-center" style={{
              width: '100%',
              height: '61px',
              borderBottom: '1px solid #25607e9a',
              cursor: 'pointer'
            }}>
              <div className="icon flex justify-center align-center" style={{ width: '65px', height: '100%' }}>
                <img src={store} alt="order execution" style={{ width: '30px', height: '30px' }} />
              </div>
              <span style={{
                fontFamily: 'IBM Plex Sans Hebrew',
                fontSize: '18px',
                color: '#ffffff'
              }}>ביצוע הזמנה לסניף</span>
            </div>
            <div onClick={() => changeStatus("approvals status")} className="flex flex-row-reverse align-center" style={{
              width: '100%',
              height: '61px',
              borderBottom: '1px solid #25607e9a',
              cursor: 'pointer'
            }}>
              <div className="icon flex justify-center align-center" style={{ width: '65px', height: '100%' }}>
                <img src={approvalsStatus} alt="approvals status" style={{ width: '30px', height: '30px' }} />
              </div>
              <span style={{
                fontFamily: 'IBM Plex Sans Hebrew',
                fontSize: '18px',
                color: '#ffffff'
              }}>ניהול אישורי הזמנה</span>
            </div>
            <div onClick={() => changeStatus("branch management")} className="flex flex-row-reverse align-center" style={{
              width: '100%',
              height: '61px',
              borderBottom: '1px solid #25607e9a',
              cursor: 'pointer'
            }}>
              <div className="icon flex justify-center align-center" style={{ width: '65px', height: '100%' }}>
                <img src={branchManagement} alt="branch management" style={{ width: '30px', height: '30px' }} />
              </div>
              <span style={{
                fontFamily: 'IBM Plex Sans Hebrew',
                fontSize: '18px',
                color: '#ffffff'
              }}>ניהול והגבלת סניפים</span>
            </div>
            <div onClick={() => changeStatus("adding products")} className="flex flex-row-reverse align-center" style={{
              width: '100%',
              height: '61px',
              borderBottom: '1px solid #25607e9a',
              cursor: 'pointer'
            }}>
              <div className="icon flex justify-center align-center" style={{ width: '65px', height: '100%' }}>
                <img src={addingProducts} alt="adding products" style={{ width: '30px', height: '30px' }} />
              </div>
              <span style={{
                fontFamily: 'IBM Plex Sans Hebrew',
                fontSize: '18px',
                color: '#ffffff'
              }}>ניהול מוצרים</span>
            </div>
            <div onClick={() => changeStatus("block management")} className="flex flex-row-reverse align-center" style={{
              width: '100%',
              height: '61px',
              borderBottom: '1px solid #25607e9a',
              cursor: 'pointer'
            }}>
              <div className="icon flex justify-center align-center" style={{ width: '65px', height: '100%' }}>
                <img src={blockManagement} alt="block management" style={{ width: '30px', height: '30px' }} />
              </div>
              <span style={{
                fontFamily: 'IBM Plex Sans Hebrew',
                fontSize: '18px',
                color: '#ffffff'
              }}>ניהול מוצרים חסומים</span>
            </div>
            <div onClick={() => changeStatus("documents")} className="flex flex-row-reverse align-center" style={{
              width: '100%',
              height: '61px',
              borderBottom: '1px solid #25607e9a',
              cursor: 'pointer'
            }}>
              <div className="icon flex justify-center align-center" style={{ width: '65px', height: '100%' }}>
                <img src={documents} alt="documents" style={{ width: '30px', height: '30px' }} />
              </div>
              <span style={{
                fontFamily: 'IBM Plex Sans Hebrew',
                fontSize: '18px',
                color: '#ffffff'
              }}>מסמכים</span>
            </div>
            <div onClick={() => changeStatus("message")} className="flex flex-row-reverse align-center" style={{
              width: '100%',
              height: '61px',
              borderBottom: '1px solid #25607e9a',
              cursor: 'pointer'
            }}>
              <div className="icon flex justify-center align-center" style={{ width: '65px', height: '100%' }}>
                <img src={chat} alt="message" style={{ width: '30px', height: '30px' }} />
              </div>
              <span style={{
                fontFamily: 'IBM Plex Sans Hebrew',
                fontSize: '18px',
                color: '#ffffff'
              }}>הודעות</span>
            </div>
            <div onClick={() => changeStatus("general management")} className="flex flex-row-reverse align-center" style={{
              width: '100%',
              height: '61px',
              borderBottom: '1px solid #25607e9a',
              cursor: 'pointer'
            }}>
              <div className="icon flex justify-center align-center" style={{ width: '65px', height: '100%' }}>
                <img src={generalManagement} alt="general management" style={{ width: '30px', height: '30px' }} />
              </div>
              <span style={{
                fontFamily: 'IBM Plex Sans Hebrew',
                fontSize: '18px',
                color: '#ffffff'
              }}>ניהול כללי</span>
            </div>
          </>
        )}
        {!isMaster && (
          <>
            <div onClick={() => changeStatus("order execution")} className="flex flex-row-reverse align-center" style={{
              width: '100%',
              height: '61px',
              borderBottom: '1px solid #25607e9a',
              cursor: 'pointer'
            }}>
              <div className="icon flex justify-center align-center" style={{ width: '65px', height: '100%' }}>
                <img src={store} alt="order execution" style={{ width: '30px', height: '30px' }} />
              </div>
              <span style={{
                fontFamily: 'IBM Plex Sans Hebrew',
                fontSize: '18px',
                color: '#ffffff'
              }}>ביצוע הזמנה לסניף</span>
            </div>
            <div onClick={() => changeStatus("approvals status")} className="flex flex-row-reverse align-center" style={{
              width: '100%',
              height: '61px',
              borderBottom: '1px solid #25607e9a',
              cursor: 'pointer'
            }}>
              <div className="icon flex justify-center align-center" style={{ width: '65px', height: '100%' }}>
                <img src={approvalsStatus} alt="approvals status" style={{ width: '30px', height: '30px' }} />
              </div>
              <span style={{
                fontFamily: 'IBM Plex Sans Hebrew',
                fontSize: '18px',
                color: '#ffffff'
              }}>ניהול אישורי הזמנה</span>
            </div>
            <div onClick={() => changeStatus("branch management")} className="flex flex-row-reverse align-center" style={{
              width: '100%',
              height: '61px',
              borderBottom: '1px solid #25607e9a',
              cursor: 'pointer'
            }}>
              <div className="icon flex justify-center align-center" style={{ width: '65px', height: '100%' }}>
                <img src={branchManagement} alt="branch management" style={{ width: '30px', height: '30px' }} />
              </div>
              <span style={{
                fontFamily: 'IBM Plex Sans Hebrew',
                fontSize: '18px',
                color: '#ffffff'
              }}>ניהול והגבלת סניפים</span>
            </div>
            <div onClick={() => changeStatus("message")} className="flex flex-row-reverse align-center" style={{
              width: '100%',
              height: '61px',
              borderBottom: '1px solid #25607e9a',
              cursor: 'pointer'
            }}>
              <div className="icon flex justify-center align-center" style={{ width: '65px', height: '100%' }}>
                <img src={chat} alt="message" style={{ width: '30px', height: '30px' }} />
              </div>
              <span style={{
                fontFamily: 'IBM Plex Sans Hebrew',
                fontSize: '18px',
                color: '#ffffff'
              }}>הודעות</span>
            </div>
            <div onClick={() => changeStatus("documents")} className="flex flex-row-reverse align-center" style={{
              width: '100%',
              height: '61px',
              borderBottom: '1px solid #25607e9a',
              cursor: 'pointer'
            }}>
              <div className="icon flex justify-center align-center" style={{ width: '65px', height: '100%' }}>
                <img src={documents} alt="documents" style={{ width: '30px', height: '30px' }} />
              </div>
              <span style={{
                fontFamily: 'IBM Plex Sans Hebrew',
                fontSize: '18px',
                color: '#ffffff'
              }}>מסמכים</span>
            </div>
          </>
        )}
      </div>

      <div className="connectedBy flex flex-row-reverse align-center" style={{
        width: '100%',
        height: '85px',
        position: 'fixed',
        bottom: 0,
        borderTop: '1px solid #25607e9a',
        padding: '0 1rem'
      }}>
        <div className="icon flex justify-center align-center" style={{ width: '65px', height: '100%' }}>
          <img src={connectedBy} alt="connected by" style={{ width: '30px', height: '30px' }} />
        </div>
        <div className="flex flex-column justify-center align-end" style={{ width: '70%' }}>
          <p style={{
            fontFamily: 'IBM Plex Sans Hebrew',
            fontSize: '15px',
            color: '#ffffff',
            margin: 0
          }}>
            מחובר: <span style={{ fontWeight: 'bold' }}>{branchName}</span>
          </p>
          <a onClick={logoutHandler} style={{
            color: '#ffffff',
            cursor: 'pointer',
            textDecoration: 'underline'
          }}>
            יציאה מהמערכת
          </a>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
