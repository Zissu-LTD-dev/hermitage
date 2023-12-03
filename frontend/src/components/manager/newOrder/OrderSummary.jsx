import { useState, useEffect } from "react";
import summary from "../../../assets/css/manager/newOrder/OrderSummary.module.css";

function OrderSummary({ providers }) {
  const { providerName, sumOrder, sumReturn, sumTotal } = providers;

  return (
    <>
      <div className={summary.main}>
        <span>
          <div className={summary.provider__name}>{providerName}</div>
        </span>
        <span>
          <div className={summary.sum__orders}>{sumOrder} מוצרים להזמנה</div>
          <div className={summary.sum__returns}>{sumReturn} מוצרים להחזרה</div>
          <div className={summary.sum__total}>
            {" "}
            שווי כספי להזמנה {sumTotal} ₪{" "}
          </div>
        </span>
      </div>
    </>
  );
}

export default OrderSummary;
