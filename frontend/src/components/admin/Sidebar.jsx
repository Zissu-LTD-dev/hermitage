import sidebar from "../../assets/css/admin/Sidebar.module.css";
import { useOrderContext } from "../../context/orderContext/OrderContext";
import { useAdminContext } from "../../context/adminContext/AdminContext";

import branchManagement from "../../assets/image/admin/shop.svg";
import approvalsStatus from "../../assets/image/admin/clock.svg";
import blockManagement from "../../assets/image/admin/block.svg";
import documents from "../../assets/image/admin/document.svg";
import addingProducts from "../../assets/image/admin/Iconfeather-plus-circle.svg";

import connectedBy from "../../assets/image/manager/Layer3.svg";

function Sidebar({ branchName }) {
  const { state, dispatch } = useOrderContext();
  const { state: stateAdmin, dispatch: dispatchAdmin } = useAdminContext();

  const logoutHandler = () => {
    dispatch({ type: "CLEAR_STATE" });
    document.cookie = `token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    localStorage.clear();
    window.location.href = "/";
  };

  const changeStatus = (status) => {
    dispatchAdmin({ type: "SET_STATUS_ADMIN", payload: status });
  };

  return (
    <>
      <div className={sidebar.sidebar}>
        <div className={sidebar.logo}></div>
        <div className={sidebar.menu}>
          <div onClick={() => changeStatus("branch management")}>
            <div className={sidebar.icon}>
              <img src={branchManagement} alt="branch management" />
            </div>
            <span>ניהול סניפים</span>
          </div>
          <div onClick={() => changeStatus("approvals status")}>
            <div className={sidebar.icon}>
              <img src={approvalsStatus} alt="approvals status" />
            </div>
            <span>סטטוס אישורים</span>
          </div>
          <div onClick={() => changeStatus("block management")}>
            <div className={sidebar.icon}>
              <img src={blockManagement} alt="block management" />
            </div>
            <span>ניהול חסומים</span>
          </div>
          <div onClick={() => changeStatus("documents")}>
            <div className={sidebar.icon}>
              <img src={documents} alt="documents" />
            </div>
            <span>מסמכים</span>
          </div>
          <div onClick={() => changeStatus("adding products")}>
            <div className={sidebar.icon}>
              <img src={addingProducts} alt="adding products" />
            </div>
            <span>הוספת מוצרים</span>
          </div>
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
