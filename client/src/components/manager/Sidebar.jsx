import sidebar from "../../assets/css/manager/sidebar.module.css";
import newOrder from "../../assets/image/manager/Layer68.svg";
import waitingOrders from "../../assets/image/manager/clock.svg";
import documents from "../../assets/image/manager/document.svg";
import branchLayout from "../../assets/image/manager/Iconfeather-eye-1.svg";
import connectedBy from "../../assets/image/manager/Layer3.svg";

function Sidebar({ branchName }) {
  return (
    <>
      <div className={sidebar.sidebar}>
        <div className={sidebar.logo}></div>
        <div className={sidebar.menu}>
          <div>
            <div className={sidebar.icon}>
              <img src={newOrder} alt="new order" />
            </div>
            <span>הזמנה חדשה</span>
          </div>
          <div>
            <div className={sidebar.icon}>
              <img src={waitingOrders} alt="waiting orders" />
            </div>
            <span>הזמנות ממתינות</span>
          </div>
          <div>
            <div className={sidebar.icon}>
              <img src={documents} alt="documents" />
            </div>
            <span>מסמכים</span>
          </div>
          <div>
            <div className={sidebar.icon}>
              <img src={branchLayout} alt="branchLayout" />
            </div>
            <span>פריסת הסניף</span>
          </div>
        </div>
        <div className={sidebar.connectedBy}>
          <div className={sidebar.icon}>
            <img src={connectedBy} alt="connected by" />
          </div>
          <div>
            <p>מחובר: <span className={sidebar.branch_name} > {branchName} </span> </p>
            <a href="/login" className={sidebar.logout}>יציאה מהמערכת</a>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
