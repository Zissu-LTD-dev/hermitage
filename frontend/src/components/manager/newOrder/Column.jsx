import { useState, useEffect } from "react";
import column from "../../../assets/css/manager/newOrder/Column.module.css";
import { useOrderContext } from "../../../context/orderContext/OrderContext";
import Row from "./Row";
import ProductOrder from "./ProductOrder";
import ProductReturn from "./ProductReturn";

function Column({ name, num, products }) {
  const { state, dispatch } = useOrderContext();

  const [open, setOpen] = useState(false);
  const [activeRow, setActiveRow] = useState(false);

  const [arrowRight, setArrowRight] = useState(false);
  const [arrowLeft, setArrowLeft] = useState(false);


  useEffect(() => {
    setOpen(false);
  }, [state.activeDepartment]);

  return (
    <>
      {!open && (
        <div className={column.main} onClick={() => setOpen(true)}>
          <span>
            <i className={column.main__icon}></i>
            <div className={column.title}>עמודה: {name}</div>
          </span>
          <span>
            <i className={column.imaging}></i>
            <i className={column.opening__arrow}></i>
          </span>
        </div>
      )}

      {open && (
        <div className={column.main__open}>
          <div className={column.main} onClick={() => setOpen(false)}>
            <span>
              <i className={column.main__icon}></i>
              <div className={column.title}>עמודה: {name}</div>
            </span>
            <span>
              <i className={column.imaging}></i>
              <i className={column.closing__arrow}></i>
            </span>
          </div>

          {activeRow && (
            <div className={column.rows}>
              {products.map((product, i) => (
                <Row key={i} product={product} />
              ))}
            </div>
          )}

          {!activeRow && (
            <>
              <div className={column.products_list}>
                {products.map((product, i) => (
                  <ProductOrder key={i} productData={product} />
                ))}
              </div>

              <div className={column.arrow_right}>
                <i className={column.arrow_icon_right}></i>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}

export default Column;
