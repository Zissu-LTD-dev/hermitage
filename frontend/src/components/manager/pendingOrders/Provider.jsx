import { useState, useEffect } from "react";
import Product from "./Product";
import providerC from "../../../assets/css/manager/pendingOrders/Provider.module.css";

function Provider({ order, status }) {
  const [open, setOpen] = useState(false);
  const [colorStatus, setColorStatus] = useState("");
  let { orderNumber, createdDate, providerName, returnLines, orderLines, userName } =
    order;
  const date = createdDate.split("T")[0].split("-").reverse().join("/");
  let time = createdDate.split("T")[1].split(".")[0];
  let newtime = time.split(":")[0] + ":" + time.split(":")[1];

  const handleOpen = () => {
    setOpen(!open);
  };

  useEffect(() => {
    if (status === "הזמנות ממתינות") setColorStatus("#CC7752");
    if (status === "הזמנות שהושלמו") setColorStatus("#79B551");
    if (status === "הזמנות מבוטלות") setColorStatus("#082A3A");
    if (status === "החזרות") setColorStatus("#007BFF");
  }, [status]);

  return (
    <>
      <div className={providerC.main_open}>
        <div className={providerC.main} onClick={handleOpen}>
          <span>
            <div className={providerC.orderNum}>הזמנה #{orderNumber}</div>
            <div className={providerC.date}>
              {date}
              <br />
              בשעה : {newtime}
            </div>
            <div className={providerC.userName}>בוצע על ידי : {userName}</div>
            <div className={providerC.provider}>{providerName}</div>
          </span>
          <span>
            <div
              style={{ backgroundColor: colorStatus }}
              className={providerC.status}
            >
              {status}
            </div>
            <div className={ !open ? providerC.icon + " " + providerC.close__icon : providerC.icon }></div>
          </span>
        </div>
        {open && status != "החזרות" && (
          <div className={providerC.products}>
            {orderLines.products.map((product) => (
              <Product key={product.barcode} productData={product} />
            ))}
          </div>
        )}
        {open && status === "החזרות" && (
          <div className={providerC.products}>
            {returnLines.products.map((product) => (
              <Product key={product.barcode} productData={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Provider;
