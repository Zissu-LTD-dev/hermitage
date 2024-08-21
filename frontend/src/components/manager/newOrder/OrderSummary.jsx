import { useState, useEffect } from "react";
import summary from "../../../assets/css/manager/newOrder/OrderSummary.module.css";
import { useMainContext } from '../../../context/mainContext/MainContext';

import imgProduct from "../../../assets/image/manager/0007434_-12-.png";


function OrderSummary({ providers , index }) {
  const { state, dispatch } = useMainContext();

  const [open, setOpen] = useState(false);
  const [noteProvider, setNoteProvider] = useState("");
  const [noteManager, setNoteManager] = useState("");

  const {
    providerName,
    orderLines,
    returnLines,
    totalOrderQty,
    totalOrderAmount,
    totalReturnQty,
    totalReturnAmount,
  } = providers;

  useEffect(() => {
    dispatch({ type: "UPDATE_SUMMARY", payload: { index, noteProvider, noteManager } });
  }, [noteProvider, noteManager]);

  return (
    <>
      <div className={summary.main}>
        <div className={summary.header}>
          <div className={summary.provider_name}>{providerName}</div>
          <div className={summary.order_summary}>
            <div className={summary.roder_data}>
              <div className={summary.total_order_qty}>
                {totalOrderQty} מוצרים להזמנה{" "}
              </div>
              <div className={summary.total_order_amount}>
                שווי כספי להזמנה {totalOrderAmount.toFixed(2)} ש"ח
              </div>
            </div>
            <div className={summary.return_data}>
              <div className={summary.total_order_qty}>
                {totalReturnQty} מוצרים להחזרה
              </div>
              <div className={summary.total_order_amount}>
                שווי כספי להחזרות {totalReturnAmount.toFixed(2)} ש"ח
              </div>
            </div>
          </div>
          <div
            className={
              !open ? summary.icon_close + " " + summary.icon : summary.icon
            }
            onClick={() => setOpen(!open)}
          ></div>
        </div>
        {open && (
          <div className={summary.body}>
            {orderLines.quantity != 0  && (
              <div className={summary.order_lines}>
                <div className={summary.order_title}>הזמנות </div>
                {orderLines.products.map((line, index) => (
                  <div key={index} className={summary.order_line}>
                    {/* img, name, barcode, quantity, price */}
                    <div className={summary.product_img}>
                      <img src={line.image ? line.image : imgProduct} alt='img' />
                    </div>
                    <div className={summary.product_name}>{line.name}</div>
                    <div className={summary.product_barcode}>
                      {line.barcode}
                    </div>
                    <div className={summary.product_quantity}>
                      {line.quantity} יח'
                    </div>
                    <div className={summary.product_price}>
                      {line.price.toFixed(2)} ש"ח
                    </div>
                  </div>
                ))}
              </div>
            )}
            {returnLines.quantity != 0 && (
              <div className={summary.order_lines}>
                <div className={summary.order_title}>החזרות </div>
                {returnLines.products.map((line, index) => (
                  <div key={index} className={summary.order_line}>
                    {/* img, name, barcode, quantity, price */}
                    <div className={summary.product_img}>
                      <img src={line.image ? line.image : imgProduct} alt='img' />
                    </div>
                    <div className={summary.product_name}>{line.name}</div>
                    <div className={summary.product_barcode}>
                      {line.barcode}
                    </div>
                    <div className={summary.product_quantity}>
                      {line.quantity} יח'
                    </div>
                    <div className={summary.product_price}>
                      {line.price.toFixed(2)} ש"ח
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            <div className={summary.notes}>
              <div className={summary.provider_note}>
                <label>הערה לספק : </label>
                <input type="text" onChange={(e) => setNoteProvider(e.target.value)} />
              </div>
              <div className={summary.manager_note}>
                <label>הערה למנהל : </label>
                <input type="text" onChange={(e) => setNoteManager(e.target.value)} />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default OrderSummary;
