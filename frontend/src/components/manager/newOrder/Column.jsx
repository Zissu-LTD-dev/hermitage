import { useState, useEffect } from "react";
import column from "../../../assets/css/manager/newOrder/Column.module.css";
import { useOrderContext } from "../../../context/orderContext/OrderContext";
import Row from "./Row";
import ProductOrder from "./ProductOrder";
import ProductReturn from "./ProductReturn";

function Column({ isOrder, name, num, products }) {
  const { state, dispatch } = useOrderContext();

  const [open, setOpen] = useState(false);
  const [activRow, setActivRow] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [state.activeDepartment]);

  return (
    <>
      {!open && (
        <div className={column.main} onClick={() => setOpen(true)}>
          <i className={column.main__icon}></i>
          <div className={column.title}>עמודה: {name}</div>
          <i className={column.imaging}></i>
          <i className={column.opening__arrow}></i>
        </div>
      )}

      {open && (
        <div className={column.main__open}>
          <div className={column.main} onClick={() => setOpen(false)}>
            <i className={column.main__icon}></i>
            <div className={column.title}>עמודה: {name}</div>
            <i className={column.imaging}></i>
            <i className={column.closing__arrow}></i>
          </div>

          {activRow && (
            <div className={column.rows}>
              {products.map((product, i) => (
                <Row key={i} product={product} />
              ))}
            </div>
          )}

          {!activRow && (
            <div className={column.products}>
              { isOrder && products.map((product, i) => (
                <ProductOrder key={i} productData={product} /> 
              ))}
              { !isOrder && products.map((product, i) => (
                <ProductReturn key={i} productData={product} /> 
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default Column;
