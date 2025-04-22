import { useState, useEffect } from "react";
import summary from "../../../assets/css/manager/newOrder/OrderSummary.module.css";
import { useMainContext } from '../../../context/mainContext/MainContext';

import imgProductDefault from '../../../assets/image/products/000.png';
const { REACT_APP_PROJECT_IMAGES } = import.meta.env;

function OrderSummary({ providers, index }) {
  const { state, dispatch } = useMainContext();

  const [open, setOpen] = useState(false);
  const [noteProvider, setNoteProvider] = useState("");
  const [noteManager, setNoteManager] = useState("");
  const [imageErrors, setImageErrors] = useState({});

  const {
    providerName,
    orderLines,
    returnLines,
    totalOrderQty,
    totalOrderAmount,
    totalReturnQty,
    totalReturnAmount,
  } = providers;

  const handleImageError = (barcode) => {
    setImageErrors(prev => ({ ...prev, [barcode]: true }));
  }

  useEffect(() => {
    dispatch({ type: "UPDATE_SUMMARY", payload: { index, noteProvider, noteManager } });
  }, [noteProvider, noteManager]);


  const renderProductLine = (line) => (
    <div key={line.barcode} className={summary.order_line}>
      <div className={summary.product_img}>
        <img 
          src={imageErrors[line.barcode] ? imgProductDefault : `${REACT_APP_PROJECT_IMAGES}${line.barcode}.png`} 
          alt={line.name} 
          onError={() => handleImageError(line.barcode)} 
        />
      </div>
      <div className={summary.product_name}>{line.name}</div>
      <div className={summary.product_barcode}>{line.barcode}</div>
      <div className={summary.product_quantity}>{line.quantity} יח'</div>
      <div className={summary.product_price}>{line.price.toFixed(2)} ש"ח</div>
    </div>
  );

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
            {orderLines.quantity !== 0 && (
              <div className={summary.order_lines}>
                <div className={summary.order_title}>הזמנות </div>
                {orderLines.products.map(renderProductLine)}
              </div>
            )}
            {returnLines.quantity !== 0 && (
              <div className={summary.order_lines}>
                <div className={summary.order_title}>החזרות </div>
                {returnLines.products.map(renderProductLine)}
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