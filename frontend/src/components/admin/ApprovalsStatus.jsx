import { useState, useEffect } from "react";
import approvalsStatus from "../../assets/css/admin/ApprovalsStatus.module.css";
import { useMainContext } from "../../context/mainContext/MainContext";
import { useAdminContext } from "../../context/adminContext/AdminContext";
import apiRequest from "../../services/api";

import Order from "./approvalsStatus/Order";

function ApprovalsStatus() {
  const { state, dispatch } = useMainContext();
  const { state: stateAdmin, dispatch: dispatchAdmin } = useAdminContext();
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [orders, setOrders] = useState([]);
  const [orderBy, setOrderBy] = useState("pending");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Modified to fetch orders with pagination and status filter
  const getOrders = async (statusFilter = null, reset = false) => {
    if ((loading && !reset) || (loadingMore && !reset)) return;

    if (reset) {
      setLoading(true);
      setPage(1);
    } else {
      setLoadingMore(true);
    }

    dispatch({ type: "SET_SHOW_LOADER", payload: true });

    const currentPage = reset ? 1 : page;
    let endpoint = `admin/getAllOrders?page=${currentPage}&limit=20`;

    if (statusFilter) {
      endpoint += `&status=${statusFilter}`;
    }

    try {
      const data = await apiRequest(endpoint);

      if (data && data.orders) {
        if (reset) {
          setOrders(data.orders);
          dispatchAdmin({
            type: "SET_CONFIRMATION_ORDERS",
            payload: data.orders,
          });
          setPage(2);
        } else {
          setOrders((prev) => [...prev, ...data.orders]);
          dispatchAdmin({
            type: "SET_CONFIRMATION_ORDERS",
            payload: [...stateAdmin.confirmationOrders, ...data.orders],
          });
          setPage((prev) => prev + 1);
        }

        setHasMore(data.orders.length === 20);

        dispatch({
          type: "SET_SHOW_SUCCESS",
          payload: { show: true, message: "ההזמנות נטענו בהצלחה" },
        });
      } else {
        dispatch({
          type: "SET_SHOW_ERROR",
          payload: { show: true, message: "אירעה שגיאה בעת טעינת ההזמנות" },
        });
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      dispatch({
        type: "SET_SHOW_ERROR",
        payload: { show: true, message: "אירעה שגיאה בעת טעינת ההזמנות" },
      });
    } finally {
      setLoading(false);
      setLoadingMore(false);
      dispatch({ type: "SET_SHOW_LOADER", payload: false });
    }
  };

  // Load more orders when scrolling to bottom
  const loadMoreOrders = () => {
    if (hasMore && !loadingMore && !loading) {
      getOrders(orderBy);
    }
  };

  // Handle order by changes
  useEffect(() => {
    getOrders(orderBy, true);
  }, [orderBy]);

  // Effect for initial data fetch
  useEffect(() => {
    if (stateAdmin.providers.length > 0 && stateAdmin.branches.length > 0) {
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

    getOrders("pending", true);
  }, [stateAdmin.providers, stateAdmin.branches]);

  // Setup scroll listener for infinite scrolling
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100
      ) {
        loadMoreOrders();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hasMore, loadingMore, loading, orderBy]);

  // Filter orders based on displayFilters
  useEffect(() => {
    if (stateAdmin.displayFilters.length < 1) return;

    const filteredOrders = [...orders];
    let result = [];

    if (
      stateAdmin.displayFilters["סניפים"] &&
      stateAdmin.displayFilters["ספקים"]
    ) {
      // Filter by both branch and provider
      stateAdmin.displayFilters["סניפים"].forEach((branchFilter) => {
        stateAdmin.displayFilters["ספקים"].forEach((providerFilter) => {
          const matched = filteredOrders.filter(
            (order) =>
              order.branchNumber == branchFilter &&
              order.providerNumber == providerFilter
          );
          result = [...result, ...matched];
        });
      });
    } else if (stateAdmin.displayFilters["ספקים"]) {
      // Filter by provider only
      stateAdmin.displayFilters["ספקים"].forEach((providerFilter) => {
        const matched = filteredOrders.filter(
          (order) => order.providerNumber == providerFilter
        );
        result = [...result, ...matched];
      });
    } else if (stateAdmin.displayFilters["סניפים"]) {
      // Filter by branch only
      stateAdmin.displayFilters["סניפים"].forEach((branchFilter) => {
        const matched = filteredOrders.filter(
          (order) => order.branchNumber == branchFilter
        );
        result = [...result, ...matched];
      });
    }

    setOrders(result.length > 0 ? result : filteredOrders);
  }, [stateAdmin.displayFilters]);

  return (
    <>
      <div className={approvalsStatus.main}>
        <div className={approvalsStatus.header}>
          <div className={approvalsStatus.title}>סטטוס אישורים להזמנות</div>
          <div className={approvalsStatus.filter_buttons}>
            <div
              className={approvalsStatus.pending_button}
              onClick={() => setOrderBy("pending")}
            >
              הזמנות ממתינות לאישור
            </div>
            <div
              className={approvalsStatus.canceled_button}
              onClick={() => setOrderBy("canceled")}
            >
              הזמנות מבוטלות
            </div>
            <div
              className={approvalsStatus.approved_button}
              onClick={() => setOrderBy("approved")}
            >
              הזמנות מאושרות
            </div>
            <div
              className={approvalsStatus.returned_button}
              onClick={() => setOrderBy("returned")}
            >
              החזרות
            </div>
          </div>
        </div>
        <div className={approvalsStatus.body}>
          {orders.length > 0 ? (
            orders.map((order) => (
              <Order key={order._id} orderData={order} orderBy={orderBy} />
            ))
          ) : loading ? (
            <div className={approvalsStatus.loading}>טוען...</div>
          ) : (
            <div className={approvalsStatus.noOrders}>אין הזמנות להצגה</div>
          )}

          {loadingMore && (
            <div className={approvalsStatus.loadingMore}>
              טוען הזמנות נוספות...
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default ApprovalsStatus;
