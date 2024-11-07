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
  const [orders, setOrders] = useState([]);
  const [orderBy, setOrderBy] = useState("pending");


  const handleOrderBy = () => {
    let newOrders = stateAdmin.confirmationOrders.filter((order) => order.orderLines.quantity > 0);
    let newReturnOrders = stateAdmin.confirmationOrders.filter((order) => order.returnLines.quantity > 0);
    switch (orderBy) {
      case "pending":
        newOrders = newOrders.filter((order) => order.orderStatus == "pending");
        break;
      case "canceled":
        newOrders = newOrders.filter((order) => order.orderStatus == "canceled");
        break;
      case "approved":
        newOrders = newOrders.filter((order) => order.orderStatus == "approved");
        break;
      case "returned":
        newOrders = newReturnOrders;
        break;
      default:
        break;
    }
    setOrders(newOrders);
  }

  const getOrders = async () => {
    dispatch({ type: "SET_SHOW_LOADER", payload: true })
    const data = await apiRequest("admin/getAllOrders");
    if(!data) {
      dispatch({ type: "SET_SHOW_LOADER", payload: false })
      dispatch({ type: "SET_SHOW_ERROR", payload: { show: true, message: "אירעה שגיאה בעת טעינת ההזמנות" } });
      return;
    }
    let orders = data.orders; 
    orders.sort((a, b) => {
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    dispatchAdmin({ type: "SET_CONFIRMATION_ORDERS", payload: orders });
    dispatch({ type: "SET_SHOW_LOADER", payload: false })
    dispatch({ type: "SET_SHOW_SUCCESS", payload: { show: true, message: "ההזמנות נטענו בהצלחה" } });
    setLoading(true);

  };

  useEffect(() => {
    if (stateAdmin.providers != [] && stateAdmin.branches != []) {
      dispatchAdmin({
        type: "SET_FILTERS",
        payload: [
          {
            title: "סניפים",
            details: stateAdmin.branches,
          },
          {
            title: "ספקים",
            details: stateAdmin.providers,
          },
        ],
      });
    }
  }, [stateAdmin.providers, stateAdmin.branches]);

  useEffect(() => {
    getOrders();
  }, []);

  useEffect(() => {
    if (stateAdmin.confirmationOrders.length > 0) {
      setLoading(true);
      let newOrders = stateAdmin.confirmationOrders.filter((order) => order.orderLines.quantity > 0);
      newOrders = stateAdmin.confirmationOrders.filter((order) => order.orderStatus == "pending");
      setOrders(newOrders);
    }
  }, [stateAdmin.confirmationOrders]);


  useEffect(() => {
    if(stateAdmin.displayFilters.length < 1 ) return handleOrderBy();

    if(stateAdmin.displayFilters["סניפים"] && stateAdmin.displayFilters["ספקים"]) {
      setOrders([]);
      stateAdmin.confirmationOrders.filter((order) => {
        stateAdmin.displayFilters["סניפים"].map((filter) => {
          if (order.branchNumber == filter) {
            stateAdmin.displayFilters["ספקים"].map((filter) => {
              if (order.providerNumber == filter) {
                setOrders((orders) => [...orders, order]);
              }
            });
          }
        });
      });
      return;
    }
    if (stateAdmin.displayFilters["ספקים"]) {
      setOrders([]);
      stateAdmin.confirmationOrders.filter((order) => {
        stateAdmin.displayFilters["ספקים"].map((filter) => {
          if (order.providerNumber == filter) {
            setOrders((orders) => [...orders, order]);
          }
        });
      });
      return;
    }
    if (stateAdmin.displayFilters["סניפים"]) {
      setOrders([]);
      stateAdmin.confirmationOrders.filter((order) => {
        stateAdmin.displayFilters["סניפים"].map((filter) => {
          if (order.branchNumber == filter) {
            setOrders((orders) => [...orders, order]);
          }
        });
      });
      return;
    } 
    setOrders(stateAdmin.confirmationOrders);
  }, [stateAdmin.displayFilters]);

  useEffect(() => {
    handleOrderBy();
  }, [orderBy]);


  return (
    <>
      <div className={approvalsStatus.main}>
        <div className={approvalsStatus.header}>
          <div className={approvalsStatus.title}>סטטוס אישורים להזמנות</div>
          <div className={approvalsStatus.filter_buttons}>
              <div className={approvalsStatus.pending_button} onClick={() => setOrderBy("pending")} >הזמנות ממתינות לאישור</div>
              <div className={approvalsStatus.canceled_button} onClick={() => setOrderBy("canceled")}>הזמנות מבוטלות</div>
              <div className={approvalsStatus.approved_button} onClick={() => setOrderBy("approved")} >הזמנות מאושרות</div>
              <div className={approvalsStatus.returned_button} onClick={() => setOrderBy("returned")} >החזרות</div>
          </div>
        </div>
        <div className={approvalsStatus.body}>
          {loading ? (
            orders.map((order) => (
              <Order key={order._id} orderData={order}  orderBy={orderBy} />
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
