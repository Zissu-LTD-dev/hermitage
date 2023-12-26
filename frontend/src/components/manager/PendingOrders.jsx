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
    dispatch({ type: "SET_SHOW_LOADER", payload: true });
    const data = await apiRequest(`manager/getOrders/${branch}`);
    dispatch({ type: "SET_SHOW_LOADER", payload: false });
    if(data){
      dispatch({ type: "SET_SHOW_SUCCESS", payload: { show: true, message: "ההזמנות נטענו בהצלחה" } });
      setOrders(data.orders);
    }else{
      dispatch({ type: "SET_SHOW_ERROR", payload: { show: true, message: "אירעה שגיאה בטעינת ההזמנות" } });
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
