import { useState, useEffect } from "react";
import pendingOrders from "../../assets/css/manager/PendingOrders.module.css";
import { useMainContext } from "../../context/mainContext/MainContext";
import Provider from "./pendingOrders/Provider";
import apiRequest from "../../services/api";

function PendingOrders() {
  const { state, dispatch } = useMainContext();

  const [branch, setBranch] = useState(state.userInfo.branch.name);
  const [orders, setOrders] = useState([]);

  const getPendingOrders = async () => {
    const data = await apiRequest(`manager/getOrders/${branch}`);
    setOrders(data.orders);
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
