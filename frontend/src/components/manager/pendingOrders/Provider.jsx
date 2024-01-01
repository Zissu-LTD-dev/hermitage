import { useState } from "react";
import Product from "./Product";
import providerC from "../../../assets/css/manager/pendingOrders/Provider.module.css";

function Provider({ order }) {
  const [open, setOpen] = useState(false);
  let { orderNum, createdAt, providerName, products } = order;
  const number = orderNum.toString().padStart(3, "0");
  const date = createdAt.split("T")[0].split("-").reverse().join("/");

  const handleOpen = () => {
    setOpen(!open);
  };

  return (
    <>
      {!open && (
        <div className={providerC.main} onClick={handleOpen}>
          <span>
            <div className={providerC.orderNum}>הזמנה #{number}</div>
            <div className={providerC.date}>{date}</div>
            <div className={providerC.provider}>{providerName}</div>
          </span>
          <span>
            <div className={providerC.status}>הזמנה ממתינה</div>
            <div className={providerC.icon + " " + providerC.close__icon}></div>
          </span>
        </div>
      )}
      {open && (
        <div className={providerC.main__open}>
          <div className={providerC.main} onClick={handleOpen}>
            <span>
              <div className={providerC.orderNum}>הזמנה #{number}</div>
              <div className={providerC.date}>{date}</div>
              <div className={providerC.provider}>{providerName}</div>
            </span>
            <span>
              <div className={providerC.status}>הזמנה ממתינה</div>
              <div className={providerC.icon}></div>
            </span>
          </div>
          <div className={providerC.products}>
            {products.map((product) => (
              <Product productData={product} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default Provider;
