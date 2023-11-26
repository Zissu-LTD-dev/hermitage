import { useState, useEffect } from "react";
import summary from "../../../assets/css/manager/newOrder/OrderSummary.module.css";

function OrderSummary({ providers }) {
  const { providerName, sumOrder, sumReturn, sumTotal } = providers;

  return (
    <>
      <div className={summary.main}>
        <div className={summary.provider__name}>{providerName}</div>
        <div className={summary.sum__orders}>{sumOrder} מוצרים להזמנה</div>
        <div className={summary.sum__returns}>{sumReturn} מוצרים להחזרה</div>
        <div className={summary.sum__total}> שווי כספי להזמנה  {sumTotal} ₪ </div>
      </div>
    </>
  );
}

export default OrderSummary;
