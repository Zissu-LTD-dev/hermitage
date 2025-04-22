import { useState, useEffect } from "react";
import row from "../../../assets/css/manager/newOrder/Row.module.css";
import ProductOrder from "./ProductOrder.jsx";

function Row({details, productsList}) {
  const [open, setOpen] = useState(true);
  const [products, setProducts] = useState([]);

  let {currentBranch, shelvesNumber, shelvesName} = details;

  useEffect(() => {
    let shelfNum = parseInt(details.shelvesNumber);
    let newProducts = productsList.filter((product) => {
        if (product.location.shelf === shelfNum) {
          return product;
        }
      });
    setProducts(newProducts);
  }, []);

  return (
    <>
      {open && (
        <div className={row.main} >
          <div className={row.title} onClick={()=>setOpen(false)} >
            <div className={row.title__text}>{shelvesName}</div>
            <div className={row.title__arrow}></div>
          </div>
          <div className={row.products}>
            {products.map((item) => (
              <ProductOrder key={item.barcode}   productData={item} />
              ))}
          </div>
        </div>
      )}

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
    </>
  );
}

export default Row;
