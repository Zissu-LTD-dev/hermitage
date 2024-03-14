import { useState, useEffect } from "react";
import row from "../../../assets/css/manager/newOrder/Row.module.css";
import ProductOrder from "./ProductOrder.jsx";

function Row({details}) {
  const [open, setOpen] = useState(false);

  let {currentBranch, shelvesNumber, shelvesName} = details;

  const productData = [
    {
      image: "", details: "מוצר נהדר", supplier: "ספק מצויין", category: "קטגוריה נהדרת", group: "קבוצה נהדרת", barcode: "123456789", quantity: 0,
    },
    {
        image: "", details: "מוצר נהדר", supplier: "ספק מצויין", category: "קטגוריה נהדרת", group: "קבוצה נהדרת", barcode: "123456789", quantity: 0,
      }

  ];

  return (
    <>
      {!open && (
        <div className={row.main} onClick={()=>setOpen(true)}>
          <div className={row.title}>
            <div className={row.title__text}>{shelvesName}</div>
            <div
              className={row.title__arrow + " " + row.title__arrow__close}
            ></div>
          </div>
        </div>
      )}

      {open && (
        <div className={row.main} >
          <div className={row.title} onClick={()=>setOpen(false)} >
            <div className={row.title__text}>{shelvesName}</div>
            <div className={row.title__arrow}></div>
          </div>
          <div className={row.products}>
            {productData.map((item) => (
              <ProductOrder productData={item} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default Row;
