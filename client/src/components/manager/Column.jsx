import { useState, useEffect } from "react";
import column from "../../assets/css/manager/Column.module.css";
import Row from "./Row";

function Column({name , num,  products }) {
  const [open, setOpen] = useState(false);


  return (
    <>
      {!open && (
        <div className={column.main} onClick={() => setOpen(true)}>
          <i className={column.main__icon}></i>
          <div className={column.title}>{name}</div>
          <i className={column.imaging}></i>
          <i className={column.opening__arrow}></i>
        </div>
      )}

      {open && (
        <div className={column.main__open}>
          <div className={column.main} onClick={() => setOpen(false)}>
            <i className={column.main__icon}></i>
            <div className={column.title}>{name}</div>
            <i className={column.imaging}></i>
            <i className={column.closing__arrow}></i>
          </div>

          <div className={column.rows}>
            {products.map((product) => (
              <Row product={product} />
            ))}
          </div>
        </div>
      )}
    </>
  );
}

export default Column;
