import { useState, useEffect } from "react";
import approvalsStatus from "../../assets/css/admin/ApprovalsStatus.module.css";
import { useMainContext } from "../../context/mainContext/MainContext";
import { useAdminContext } from "../../context/adminContext/AdminContext";
import apiRequest from "../../services/api";

import Order from "./approvalsStatus/Order";

function ApprovalsStatus() {
  const { state, dispatch } = useMainContext();
  const { state: stateAdmin, dispatch: dispatchAdmin } = useAdminContext();
  const [loading, setLoading] = useState(false);

  const getOrders = async () => {
    dispatch({ type: "SET_SHOW_LOADER", payload: true })
    const data = await apiRequest("admin/getAllOrders");
    if(!data) {
      dispatch({ type: "SET_SHOW_LOADER", payload: false })
      dispatch({ type: "SET_SHOW_ERROR", payload: { show: true, message: "אירעה שגיאה בעת טעינת ההזמנות" } });
      return;
    }
    let orders = data.orders.filter((order) => order.status != "canceled");
    dispatchAdmin({ type: "SET_CONFIRMATION_ORDERS", payload: orders });
    dispatch({ type: "SET_SHOW_LOADER", payload: false })
    dispatch({ type: "SET_SHOW_SUCCESS", payload: { show: true, message: "ההזמנות נטענו בהצלחה" } });
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
