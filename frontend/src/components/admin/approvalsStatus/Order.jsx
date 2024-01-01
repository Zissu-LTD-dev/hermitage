import { useState } from "react";
import orderStyle from "../../../assets/css/admin/approvalsStatus/Order.module.css";
import { useMainContext } from "../../../context/mainContext/MainContext";
import { useAdminContext } from "../../../context/adminContext/AdminContext";
import apiRequest from "../../../services/api";

import Product from "./Product";

function Order({orderData}) {
  const { state, dispatch } = useMainContext();
  const { state: stateAdmin, dispatch: dispatchAdmin } = useAdminContext();
  const [open, setOpen] = useState(false);
  let { orderNum, createdAt, branchName, provider, providerName, status, products } = orderData;

  orderNum = orderNum.toString().padStart(3, "0");
  createdAt = createdAt.split("T")[0].split("-").reverse().join("/"); 

  const updateOrder = async (newOrder) => {
    const data = await apiRequest("admin/updateOrder", "PUT", newOrder);
    if (!data){ 
      dispatch({ type: "SET_SHOW_ERROR", payload: { show: true, message: "אירעה שגיאה בעדכון ההזמנה" } });
      return false;
    } 
    dispatch({ type: "SET_SHOW_SUCCESS", payload: { show: true, message: "ההזמנה עודכנה בהצלחה" } });
    return true;
  }

    const handleCancelOrder = async () => {
      let newOrder = { ...orderData, status: "canceled" };
      let update = await updateOrder(newOrder);
      if (!update) return;
      dispatchAdmin({ type: "CANCEL_ORDER_ADMIN", payload: newOrder });
    }

    const handleApproveOrder =async () => {
      let newOrder = { ...orderData, status: "approved" };
      let update = await updateOrder(newOrder);
      if (!update) return;
      dispatchAdmin({ type: "APPROVE_ORDER_ADMIN", payload: newOrder });
    }

    const handleDecrease = (product) => {
      if (product.quantity == 1) return handleDelete(product);
      product.quantity--;
      let newProducts = products.map((p) => {
        if (p._id == product._id) {
          return product;
        }
        return p;
      });
      let newOrder = { ...orderData, products: newProducts };
      dispatchAdmin({ type: "DECREASE_PRODUCT_ADMIN", payload: newOrder });
    }
  
    const handleIncrease = (product) => {
      product.quantity++;
      let newProducts = products.map((p) => {
        if (p._id == product._id) {
          return product;
        }
        return p;
      });
      let newOrder = { ...orderData, products: newProducts };
      dispatchAdmin({ type: "INCREASE_PRODUCT_ADMIN", payload: newOrder });
    }
  
    const handleDelete = (product) => {
      let newProducts = products.filter((p) => p._id != product._id);
      let newOrder = { ...orderData, products: newProducts };
      dispatchAdmin({ type: "DELETE_PRODUCT_ADMIN", payload: newOrder });
    }
  

 
  const handleOpen = () => {
    setOpen(!open);
  };

  return (
    <>
      <div className={orderStyle.main}>
        <div className={orderStyle.head} onClick={handleOpen}  >
          <span>
            <div className={orderStyle.orderNum}>הזמנה #{orderNum}</div>
            <div className={orderStyle.date}>{createdAt}</div>
            <div className={orderStyle.branchName}>{branchName}</div>
            <div className={orderStyle.providerName}>{providerName}</div>
          </span>
          <span>
            {status == "pending" && <div className={ orderStyle.status + ' ' + orderStyle.statusPending}>ממתין לאישור</div>}
            {status == "approved" && <div className={ orderStyle.status + ' ' + orderStyle.statusApproved}>הזמנה אושרה</div>}
            {status == "canceled" && <div className={ orderStyle.status + ' ' + orderStyle.statusCanceled}>הזמנה בוטלה</div>}
            <div className={open ? orderStyle.iconArrow + ' ' + orderStyle.openiconArrow : orderStyle.iconArrow}></div>
          </span>
        </div>
        {open && (
          <>
            <div className={orderStyle.body}>
                {products.map((product) => (
                    <Product key={product._id} productData={product} onDelete={handleDelete} onDecrease={handleDecrease} onIncrease={handleIncrease} />
                ))}
            </div>
            <div className={orderStyle.footer}>
                <div className={orderStyle.cancelOrder} onClick={handleCancelOrder}>ביטול הזמנה</div>
                <div className={orderStyle.approveOrder} onClick={handleApproveOrder}>אישור הזמנה</div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Order;
