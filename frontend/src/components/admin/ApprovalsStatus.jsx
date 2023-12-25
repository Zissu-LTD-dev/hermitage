import { useState, useEffect } from "react";
import approvalsStatus from "../../assets/css/admin/ApprovalsStatus.module.css";
import { useAdminContext } from "../../context/adminContext/AdminContext";
import apiRequest from "../../services/api";

import Order from "./approvalsStatus/Order";

function ApprovalsStatus() {
  const { state: stateAdmin, dispatch: dispatchAdmin } = useAdminContext();
  const [loading, setLoading] = useState(false);

  const getOrders = async () => {
    const data = await apiRequest("admin/getAllOrders");
    let orders = data.orders.filter((order) => order.status != "canceled");
    dispatchAdmin({ type: "SET_CONFIRMATION_ORDERS", payload: orders });
    setLoading(true);

  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <>
      <div className={approvalsStatus.main}>
        <div className={approvalsStatus.header}>
          <div className={approvalsStatus.title}>סטטוס אישורים להזמנות</div>
        </div>
        <div className={approvalsStatus.body}>
          {loading ? (
            stateAdmin.confirmationOrders.map((order) => (
              <Order key={order._id} orderData={order} />
            ))
          ) : (
            <div>טוען...</div>
          )}
        </div>
      </div>
    </>
  );
}

export default ApprovalsStatus;
