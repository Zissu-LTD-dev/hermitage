import { useState, useEffect } from "react";
import pendingOrders from "../../assets/css/manager/PendingOrders.module.css";
import { useOrderContext } from "../../context/orderContext/OrderContext";
import Provider from "./pendingOrders/Provider";

import cookie from "js-cookie";
const { REACT_APP_BACKEND_URL } = import.meta.env;

function PendingOrders() {
  const { state, dispatch } = useOrderContext();

  const [branch, setBranch] = useState(state.userInfo.branch.name);
  const [orders, setOrders] = useState([]);

  const getPendingOrders = async () => {
    try {
      const res = await fetch(
        `${REACT_APP_BACKEND_URL}manager/getOrders/${branch}`,
        {
          headers: {
            authorization: `Bearer ${cookie.get("token")}`,
          },
        }
      );
      const data = await res.json();
      console.log(data);
      setOrders(data.orders);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPendingOrders();
  }, []);

  return (
    <>
      <div className={pendingOrders.main}>
        <div className={pendingOrders.header}>
          <div className={pendingOrders.title}>
            <h1>הזמנות ממתינות</h1>
          </div>
        </div>
        <div className={pendingOrders.content}>
          {orders.map((order) => (
            <Provider order={order} />
          ))}
        </div>
      </div>
    </>
  );
}

export default PendingOrders;
