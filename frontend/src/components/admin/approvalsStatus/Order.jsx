import { useState } from "react";
import orderStyle from "../../../assets/css/admin/approvalsStatus/Order.module.css";
import Product from "./Product";

function Order({order}) {
  const [open, setOpen] = useState(false);
  let { orderNum, createdAt, branchName, provider, status, products } = order;

  orderNum = orderNum.toString().padStart(3, "0");
  createdAt = createdAt.split("T")[0].split("-").reverse().join("/"); 

  const handleOpen = () => {
    setOpen(!open);
  };

  return (
    <>
      <div className={orderStyle.main}>
        <div className={orderStyle.head} onClick={handleOpen}  >
            <div className={orderStyle.orderNum}>הזמנה #{orderNum}</div>
            <div className={orderStyle.date}>{createdAt}</div>
            <div className={orderStyle.branchName}>{branchName}</div>
            <div className={orderStyle.providerName}>{provider}</div>
            {status == "pending" && <div className={ orderStyle.status + ' ' + orderStyle.statusPending}>ממתין לאישור</div>}
            {status == "approved" && <div className={ orderStyle.status + ' ' + orderStyle.statusApproved}>הזמנה אושרה</div>}
            <div className={open ? orderStyle.iconArrow + ' ' + orderStyle.openiconArrow : orderStyle.iconArrow}></div>
        </div>
        {open && (
          <>
            <div className={orderStyle.body}>
                {products.map((product) => (
                    <Product key={product._id} product={product} />
                ))}
            </div>
            <div className={orderStyle.footer}>
                <div className={orderStyle.cancelOrder}>ביטול הזמנה</div>
                <div className={orderStyle.approveOrder}>אישור הזמנה</div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Order;
