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

  const getOrders = async () => {
    dispatch({ type: "SET_SHOW_LOADER", payload: true })
    const data = await apiRequest("admin/getAllOrders");
    if(!data) {
      dispatch({ type: "SET_SHOW_LOADER", payload: false })
      dispatch({ type: "SET_SHOW_ERROR", payload: { show: true, message: "אירעה שגיאה בעת טעינת ההזמנות" } });
      return;
    }
    let orders = data.orders.filter((order) => order.status != "canceled");
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
      setOrders(stateAdmin.confirmationOrders);
    }
  }, [stateAdmin.confirmationOrders]);


  useEffect(() => {
    if(stateAdmin.displayFilters["סניפים"] && stateAdmin.displayFilters["ספקים"]) {
      setOrders([]);
      stateAdmin.confirmationOrders.filter((order) => {
        stateAdmin.displayFilters["סניפים"].map((filter) => {
          if (order.branchID == filter) {
            stateAdmin.displayFilters["ספקים"].map((filter) => {
              if (order.provider == filter) {
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
          if (order.provider == filter) {
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
          if (order.branchID == filter) {
            setOrders((orders) => [...orders, order]);
          }
        });
      });
      return;
    } 
    setOrders(stateAdmin.confirmationOrders);
  }, [stateAdmin.displayFilters]);


  return (
    <>
      <div className={approvalsStatus.main}>
        <div className={approvalsStatus.header}>
          <div className={approvalsStatus.title}>סטטוס אישורים להזמנות</div>
        </div>
        <div className={approvalsStatus.body}>
          {loading ? (
            orders.map((order) => (
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
