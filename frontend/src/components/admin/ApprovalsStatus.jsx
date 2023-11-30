import { useState, useEffect } from "react";
import approvalsStatus from "../../assets/css/admin/ApprovalsStatus.module.css";
import { useOrderContext } from "../../context/orderContext/OrderContext";
import cookie from "js-cookie";
const { REACT_APP_BACKEND_URL } = import.meta.env;

import Order from "./approvalsStatus/Order";

function ApprovalsStatus() {
  const { state, dispatch } = useOrderContext();
  const [loading, setLoading] = useState(false);

  const getOrders = async () => {
    try {
      const res = await fetch(`${REACT_APP_BACKEND_URL}admin/getAllOrders`, {
        headers: {
          authorization: `Bearer ${cookie.get("token")}`,
        },
      });
      const data = await res.json();
      let orders = data.orders.filter((order) => order.status != "canceled");
      dispatch({ type: "SET_CONFIRMATION_ORDERS", payload: orders });
      setLoading(true);
    } catch (error) {
      console.log(error);
    }
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
            state.admin.confirmationOrders.map((order) => (
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
