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
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [initialFetch, setInitialFetch] = useState(true);

  // Modified to fetch orders with pagination and status filter
  const getAllOrders = async (status = null, reset = false) => {
    if (loading) return;

    setLoading(true);
    dispatch({ type: "SET_SHOW_LOADER", payload: true });

    // Determine which page to fetch
    const currentPage = reset ? 1 : page;

    // Build query params
    let endpoint = `manager/getOrders/${branch}?page=${currentPage}&limit=20`;
    if (status) {
      endpoint += `&status=${status}`;
    }

    try {
      const data = await apiRequest(endpoint);

      if (data && data.orders) {
        dispatch({
          type: "SET_SHOW_SUCCESS",
          payload: { show: true, message: "ההזמנות נטענו בהצלחה" },
        });

        // Handle pagination
        if (reset) {
          setAllOrders(data.orders);
          setPage(2); // Next page will be 2
        } else {
          setAllOrders((prev) => [...prev, ...data.orders]);
          setPage((prev) => prev + 1);
        }

        // Check if there are more orders to fetch
        setHasMore(data.orders.length === 20); // Assuming 20 is the limit
      } else {
        dispatch({
          type: "SET_SHOW_ERROR",
          payload: { show: true, message: "אירעה שגיאה בטעינת ההזמנות" },
        });
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      dispatch({
        type: "SET_SHOW_ERROR",
        payload: { show: true, message: "אירעה שגיאה בטעינת ההזמנות" },
      });
    } finally {
      setLoading(false);
      dispatch({ type: "SET_SHOW_LOADER", payload: false });
      setInitialFetch(false);
    }
  };

  // Load more orders when scrolling to bottom
  const loadMoreOrders = () => {
    if (hasMore && !loading) {
      let statusFilter = null;
      if (title === "הזמנות ממתינות") statusFilter = "pending";
      else if (title === "הזמנות שהושלמו") statusFilter = "approved";
      else if (title === "הזמנות מבוטלות") statusFilter = "canceled";
      else if (title === "החזרות") statusFilter = "returned";

      getAllOrders(statusFilter);
    }
  };

  // Handle title changes
  useEffect(() => {
    let statusFilter = null;

    if (title === "הזמנות ממתינות") {
      statusFilter = "pending";
      setOrders(allOrders.filter((order) => order.orderStatus === "pending"));
    } else if (title === "הזמנות שהושלמו") {
      statusFilter = "approved";
      setOrders(allOrders.filter((order) => order.orderStatus === "approved"));
    } else if (title === "הזמנות מבוטלות") {
      statusFilter = "canceled";
      setOrders(allOrders.filter((order) => order.orderStatus === "canceled"));
    } else if (title === "החזרות") {
      statusFilter = "returned";
      setOrders(allOrders.filter((order) => order.returnStatus));
    }

    // Fetch new filtered data when title changes
    getAllOrders(statusFilter, true);
  }, [title]);

  // Effect for initial data fetch
  useEffect(() => {
    if (initialFetch) {
      getAllOrders("pending", true);
    }
  }, []);

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
  }, [hasMore, loading, title]);

  return (
    <>
      <div className={pendingOrders.main}>
        <div className={pendingOrders.header}>
          <div className={pendingOrders.title}>
            <h3>{title}</h3>
          </div>
          <div className={pendingOrders.buttons}>
            <button
              className={pendingOrders.button_pending}
              onClick={() => setTitle("הזמנות ממתינות")}
            >
              הזמנות ממתינות
            </button>
            <button
              className={pendingOrders.button_approved}
              onClick={() => setTitle("הזמנות שהושלמו")}
            >
              הזמנות שהושלמו
            </button>
            <button
              className={pendingOrders.button_canceled}
              onClick={() => setTitle("הזמנות מבוטלות")}
            >
              הזמנות מבוטלות
            </button>
            <button
              className={pendingOrders.button_returens}
              onClick={() => setTitle("החזרות")}
            >
              החזרות
            </button>
          </div>
        </div>
        <div className={pendingOrders.content}>
          {title === "החזרות" &&
            orders
              .filter(
                (order) => order.returnLines && order.returnLines.quantity > 0
              )
              .map((order, i) => (
                <Provider key={order._id || i} order={order} status={title} />
              ))}
          {title !== "החזרות" &&
            orders
              .filter(
                (order) => order.orderLines && order.orderLines.quantity > 0
              )
              .map((order, i) => (
                <Provider key={order._id || i} order={order} status={title} />
              ))}

          {loading && (
            <div className={pendingOrders.loading}>
              <div>טוען הזמנות נוספות...</div>
            </div>
          )}

          {!loading && orders.length === 0 && (
            <div className={pendingOrders.noOrders}>
              <div>אין הזמנות להצגה</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default PendingOrders;
