import { useState, useEffect } from "react";
import orderStyle from "../../../assets/css/admin/approvalsStatus/Order.module.css";
import { useMainContext } from "../../../context/mainContext/MainContext";
import { useAdminContext } from "../../../context/adminContext/AdminContext";
import apiRequest from "../../../services/api";

import Product from "./Product";

function Order({ orderData, orderBy }) {
  const { state, dispatch } = useMainContext();
  const { state: stateAdmin, dispatch: dispatchAdmin } = useAdminContext();

  const [open, setOpen] = useState(false);
  const [quantityIsEmpty, setQuantityIsEmpty] = useState(false);

  let {
    orderNumber,
    createdDate,
    userName,
    branchNumber,
    branchName,
    provider,
    providerName,
    orderStatus,
    returnStatus,
    orderLines,
    returnLines,
    noteProvider,
    noteManager,
  } = orderData;
  let products =
    orderBy == "returned" ? returnLines.products : orderLines.products;
  let status = orderBy == "returned" ? "returned" : orderStatus;
  let time = createdDate.split("T")[1].split(".")[0];
  time = time.split(":").slice(0, 2).join(":");
  createdDate = createdDate.split("T")[0].split("-").reverse().join("/");

  const updateOrder = async (newOrder) => {
    const data = await apiRequest("admin/updateOrder", "PUT", newOrder);
    if (!data) {
      dispatch({ type: "SET_SHOW_LOADER", payload: false });
      dispatch({
        type: "SET_SHOW_ERROR",
        payload: { show: true, message: "אירעה שגיאה בעדכון ההזמנה" },
      });
      return false;
    }
    dispatch({ type: "SET_SHOW_LOADER", payload: false });
    dispatch({
      type: "SET_SHOW_SUCCESS",
      payload: { show: true, message: "ההזמנה עודכנה בהצלחה" },
    });
    return true;
  };

  const handleCancelOrder = async () => {
    let newOrder = { ...orderData, orderStatus: "canceled" };
    let update = await updateOrder(newOrder);
    if (!update) return;
    dispatchAdmin({ type: "CANCEL_ORDER_ADMIN", payload: newOrder });
  };

  const handleApproveOrder = async () => {
    dispatch({ type: "SET_SHOW_LOADER", payload: true });
    let newOrder = { ...orderData, orderStatus: "approved" };
    newOrder.orderLines.products = newOrder.orderLines.products.filter(
      (product) => product.quantity > 0
    );
    let update = await updateOrder(newOrder);
    if (!update) return;
    dispatchAdmin({ type: "APPROVE_ORDER_ADMIN", payload: newOrder });
  };

  const handleDecrease = (product) => {
    if (product.quantity == 0) return;
    product.quantity--;
    let newProducts = products.map((p) => {
      if (p._id == product._id) {
        return product;
      }
      return p;
    });
    let newOrderLines = {
      products: newProducts,
      quantity: orderLines.quantity - 1,
    };
    let totalOrderAmount = newOrderLines.products.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0
    );
    let totalOrderQty = newOrderLines.quantity;

    let newOrder = {
      ...orderData,
      orderLines: newOrderLines,
      totalOrderAmount,
      totalOrderQty,
    };
    dispatchAdmin({ type: "DECREASE_PRODUCT_ADMIN", payload: newOrder });
  };

  const handleIncrease = (product) => {
    product.quantity++;
    let newProducts = products.map((p) => {
      if (p._id == product._id) {
        return product;
      }
      return p;
    });
    let newOrderLines = {
      products: newProducts,
      quantity: orderLines.quantity + 1,
    };
    let totalOrderAmount = newOrderLines.products.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0
    );
    let totalOrderQty = newOrderLines.quantity;

    let newOrder = {
      ...orderData,
      orderLines: newOrderLines,
      totalOrderAmount,
      totalOrderQty,
    };
    dispatchAdmin({ type: "INCREASE_PRODUCT_ADMIN", payload: newOrder });
  };

  const handleDelete = (product) => {
    let newProducts = products.filter((p) => p._id != product._id);
    let newOrderLines = {
      products: newProducts,
      quantity: orderLines.quantity - product.quantity,
    };
    let totalOrderAmount = newOrderLines.products.reduce(
      (acc, product) => acc + product.price * product.quantity,
      0
    );
    let totalOrderQty = newOrderLines.quantity;

    let newOrder = {
      ...orderData,
      orderLines: newOrderLines,
      totalOrderAmount,
      totalOrderQty,
    };
    dispatchAdmin({ type: "DELETE_PRODUCT_ADMIN", payload: newOrder });
  };

  const handleOpen = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (orderData.totalOrderQty == 0) {
      setQuantityIsEmpty(true);
    } else {
      setQuantityIsEmpty(false);
    }
  }, [orderData]);

  return (
    <>
      <div className={orderStyle.main}>
        <div className={orderStyle.head} onClick={handleOpen}>
          <span>
            <div className={orderStyle.orderNum}>הזמנה #{orderNumber}</div>
            <div className={orderStyle.date}>
              {createdDate}
              <br />
              בשעה: {time}
            </div>
            <div className={orderStyle.branchName}>
              {branchName} - {branchNumber}
              <br />
              בוצע על ידי: {userName}
            </div>
            <div className={orderStyle.providerName}>{providerName}</div>
          </span>
          <span>
            {status == "pending" && (
              <div
                className={orderStyle.status + " " + orderStyle.statusPending}
              >
                ממתין לאישור
              </div>
            )}
            {status == "approved" && (
              <div
                className={orderStyle.status + " " + orderStyle.statusApproved}
              >
                הזמנה אושרה
              </div>
            )}
            {status == "canceled" && (
              <div
                className={orderStyle.status + " " + orderStyle.statusCanceled}
              >
                הזמנה בוטלה
              </div>
            )}
            {status == "returned" && (
              <div
                className={orderStyle.status + " " + orderStyle.statusReturned}
              >
                החזרה
              </div>
            )}
            <div
              className={
                open
                  ? orderStyle.iconArrow + " " + orderStyle.openiconArrow
                  : orderStyle.iconArrow
              }
            ></div>
          </span>
        </div>
        {open && orderBy == "panding" && (
          <>
            <div className={orderStyle.body}>
              {products.map((product) => (
                <Product
                  key={product._id}
                  productData={product}
                  onDelete={handleDelete}
                  onDecrease={handleDecrease}
                  onIncrease={handleIncrease}
                  orderBy={orderBy}
                />
              ))}
            </div>
            <div className={orderStyle.notes}>
              {noteManager && (
                <div className={orderStyle.note}>
                  <div className={orderStyle.noteTitle}>הערה למנהל:</div>
                  <div className={orderStyle.noteContent}>{noteManager}</div>
                </div>
              )}
              {noteProvider && (
                <div className={orderStyle.note}>
                  <div className={orderStyle.noteTitle}>הערה לספק:</div>
                  <div className={orderStyle.noteContent}>{noteProvider}</div>
                </div>
              )}
            </div>
            <div className={orderStyle.footer}>
              <div
                className={orderStyle.cancelOrder}
                onClick={handleCancelOrder}
              >
                ביטול הזמנה
              </div>
              <div
                className={
                  orderStyle.approveOrder +
                  " " +
                  (quantityIsEmpty ? orderStyle.disabled : "")
                }
                onClick={quantityIsEmpty ? handleApproveOrder : null}
              >
                אישור הזמנה
              </div>
            </div>
          </>
        )}
        {open && orderBy != "panding" && (
          <>
            <div className={orderStyle.body}>
              {products.map((product) => (
                <Product
                  key={product._id}
                  productData={product}
                  orderBy={orderBy}
                />
              ))}
            </div>
            <div className={orderStyle.notes}>
              {noteManager && (
                <div className={orderStyle.note}>
                  <div className={orderStyle.noteTitle}>הערה למנהל:</div>
                  <div className={orderStyle.noteContent}>{noteManager}</div>
                </div>
              )}
              {noteProvider && (
                <div className={orderStyle.note}>
                  <div className={orderStyle.noteTitle}>הערה לספק:</div>
                  <div className={orderStyle.noteContent}>{noteProvider}</div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Order;
