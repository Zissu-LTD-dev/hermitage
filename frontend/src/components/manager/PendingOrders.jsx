import { useState, useEffect } from "react";
import pendingOrders from "../../assets/css/manager/PendingOrders.module.css";
import { useMainContext } from "../../context/mainContext/MainContext";
import Provider from "./pendingOrders/Provider";
import apiRequest from "../../services/api";

function PendingOrders() {
  const { state, dispatch } = useMainContext();

  const [branch, setBranch] = useState(state.userInfo.branch.number);
  const [allOrders, setAllOrders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [title, setTitle] = useState("הזמנות ממתינות");

  const getAllOrders = async () => {
    dispatch({ type: "SET_SHOW_LOADER", payload: true });
    const data = await apiRequest(`manager/getOrders/${branch}`);
    dispatch({ type: "SET_SHOW_LOADER", payload: false });
    if(data){
      dispatch({ type: "SET_SHOW_SUCCESS", payload: { show: true, message: "ההזמנות נטענו בהצלחה" } });
      setAllOrders(data.orders);
    }else{
      dispatch({ type: "SET_SHOW_ERROR", payload: { show: true, message: "אירעה שגיאה בטעינת ההזמנות" } });
    }
  };

  useEffect(() => {
    if(title === "הזמנות ממתינות") setOrders(allOrders.filter(order => order.orderStatus === "pending"));
    if(title === "הזמנות שהושלמו") setOrders(allOrders.filter(order => order.orderStatus === "approved"));
    if(title === "הזמנות מבוטלות") setOrders(allOrders.filter(order => order.orderStatus === "canceled"));
    if(title === "החזרות") setOrders(allOrders.filter(order => order.returnStatus));
  }, [title, allOrders]);

  useEffect(() => {
    getAllOrders();
  }, []);

  return (
    <>
      <div className={pendingOrders.main}>
        <div className={pendingOrders.header}>
          <div className={pendingOrders.title}><h3>{title}</h3></div>
          <div className={pendingOrders.buttons}>
            <button className={pendingOrders.button_pending} onClick={()=> setTitle('הזמנות ממתינות')}>הזמנות ממתינות</button>
            <button className={pendingOrders.button_approved} onClick={()=> setTitle('הזמנות שהושלמו')}>הזמנות שהושלמו</button>
            <button className={pendingOrders.button_canceled} onClick={()=> setTitle('הזמנות מבוטלות')}>הזמנות מבוטלות</button>
            <button className={pendingOrders.button_returens} onClick={()=> setTitle('החזרות')}>החזרות</button>
          </div>
        </div>
        <div className={pendingOrders.content}>
          {title === "החזרות" && orders.filter(order => order.returnLines.quantity > 0).map((order, i) => (
            <Provider key={i} order={order} status={title} />
          ))}
          {title !== "החזרות" && orders.filter(order => order.orderLines.quantity > 0).map((order, i) => (
            <Provider key={i} order={order} status={title} />
          ))}
        </div>
      </div>
    </>
  );
}

export default PendingOrders;
