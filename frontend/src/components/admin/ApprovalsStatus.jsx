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
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [orderBy, setOrderBy] = useState("pending");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Function to fetch orders with pagination and status filter
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
        // Make sure we have orders array
        const receivedOrders = Array.isArray(data.orders) ? data.orders : [];

        if (reset) {
          setOrders(receivedOrders);
          setFilteredOrders(receivedOrders);
          dispatchAdmin({
            type: "SET_CONFIRMATION_ORDERS",
            payload: receivedOrders,
          });
          setPage(2);
        } else {
          const updatedOrders = [...(orders || []), ...receivedOrders];
          setOrders(updatedOrders);
          setFilteredOrders(updatedOrders);
          dispatchAdmin({
            type: "SET_CONFIRMATION_ORDERS",
            payload: updatedOrders,
          });
          setPage((prev) => prev + 1);
        }

        setHasMore(receivedOrders.length === 20);

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

  // Handle order status changes
  useEffect(() => {
    getOrders(orderBy, true);
  }, [orderBy]);

  // Initial setup and filters
  useEffect(() => {
    // Set up filters if they don't exist yet
    if (
      stateAdmin.providers.length > 0 &&
      stateAdmin.branches.length > 0 &&
      (!stateAdmin.filters || stateAdmin.filters.length === 0)
    ) {
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

    // Initial load
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

  // Apply filters when displayFilters change
  useEffect(() => {
    if (!orders.length) return;

    // If no filters are active, show all orders
    if (
      !stateAdmin.displayFilters ||
      Object.keys(stateAdmin.displayFilters).length === 0
    ) {
      setFilteredOrders(orders);
      return;
    }

    let result = [];
    const branchFilters = stateAdmin.displayFilters["סניפים"];
    const providerFilters = stateAdmin.displayFilters["ספקים"];

    if (
      branchFilters &&
      branchFilters.length > 0 &&
      providerFilters &&
      providerFilters.length > 0
    ) {
      // Filter by both branch and provider
      orders.forEach((order) => {
        if (
          branchFilters.includes(order.branchNumber) &&
          providerFilters.includes(order.providerNumber)
        ) {
          result.push(order);
        }
      });
    } else if (branchFilters && branchFilters.length > 0) {
      // Filter by branch only
      result = orders.filter((order) =>
        branchFilters.includes(order.branchNumber)
      );
    } else if (providerFilters && providerFilters.length > 0) {
      // Filter by provider only
      result = orders.filter((order) =>
        providerFilters.includes(order.providerNumber)
      );
    } else {
      // No specific filters set
      result = orders;
    }

    setFilteredOrders(result);
  }, [stateAdmin.displayFilters, orders]);

  // Handle search functionality
  useEffect(() => {
    if (!orders.length) return;

    // If no search query, rely on the filters
    if (!stateAdmin.search || stateAdmin.search.trim() === "") {
      // If we're not actively filtering, show all orders
      if (
        !stateAdmin.displayFilters ||
        Object.keys(stateAdmin.displayFilters).length === 0
      ) {
        setFilteredOrders(orders);
      }
      return;
    }

    // Search by order number, branch name, or provider name
    const searchQuery = stateAdmin.search.toLowerCase().trim();
    const results = orders.filter(
      (order) =>
        order.orderNumber.toString().includes(searchQuery) ||
        order.branchName.toLowerCase().includes(searchQuery) ||
        order.providerName.toLowerCase().includes(searchQuery) ||
        order.userName.toLowerCase().includes(searchQuery)
    );

    setFilteredOrders(results);
  }, [stateAdmin.search, orders]);

  return (
    <>
      <div className={approvalsStatus.main}>
        <div className={approvalsStatus.header}>
          <div className={approvalsStatus.title}>סטטוס אישורים להזמנות</div>
          <div className={approvalsStatus.filter_buttons}>
            <div
              className={`${approvalsStatus.pending_button} ${
                orderBy === "pending" ? approvalsStatus.active : ""
              }`}
              onClick={() => setOrderBy("pending")}
            >
              הזמנות ממתינות לאישור
            </div>
            <div
              className={`${approvalsStatus.canceled_button} ${
                orderBy === "canceled" ? approvalsStatus.active : ""
              }`}
              onClick={() => setOrderBy("canceled")}
            >
              הזמנות מבוטלות
            </div>
            <div
              className={`${approvalsStatus.approved_button} ${
                orderBy === "approved" ? approvalsStatus.active : ""
              }`}
              onClick={() => setOrderBy("approved")}
            >
              הזמנות מאושרות
            </div>
            <div
              className={`${approvalsStatus.returned_button} ${
                orderBy === "returned" ? approvalsStatus.active : ""
              }`}
              onClick={() => setOrderBy("returned")}
            >
              החזרות
            </div>
          </div>
        </div>
        <div className={approvalsStatus.body}>
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <Order key={order._id} orderData={order} orderBy={orderBy} />
            ))
          ) : loading ? (
            <div className={approvalsStatus.loading}>טוען...</div>
          ) : (
            <div className={approvalsStatus.noOrders}>
              {stateAdmin.search ||
              Object.keys(stateAdmin.displayFilters || {}).length > 0
                ? "אין הזמנות התואמות את החיפוש או הסינון"
                : "אין הזמנות להצגה"}
            </div>
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
