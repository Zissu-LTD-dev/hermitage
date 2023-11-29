import { useState } from "react";
import productStyle from "../../../assets/css/admin/blockManagement/Product.module.css";
import img from "../../../assets/image/manager/0007434_-12-.png";

function Product({block}) {
//   const [block, setBlock] = useState(false);
//   const [block, setBlock] = useState(true);

  return (
    <>
      <div
        className={
          block
            ? productStyle.blocked + " " + productStyle.main
            : productStyle.main
        }
      >
        <span>
          <div className={productStyle.checkboxSelect}>
            <input type="checkbox" />
          </div>
          <div className={productStyle.image}>
            <img src={img} />
          </div>
          <div className={productStyle.name}>שם המוצר</div>
        </span>
        <span>
          <div className={productStyle.provider}>ספק</div>
          <div className={productStyle.category}>קטגוריה</div>
          <div className={productStyle.barcode}>ברקוד</div>
          {!block ? (
            <div
              className={productStyle.button + " " + productStyle.blockedText}
              onClick={() => setBlock(!block)}
            >
              <div className={productStyle.blockedIcon}></div>
              <div>חסום פריט</div>
            </div>
          ) : (
            <div
              className={productStyle.button + " " + productStyle.unblockedText}
              onClick={() => setBlock(!block)}
            >
              <div>הוצא מחסום</div>
            </div>
          )}
        </span>
      </div>
    </>
  );
}

export default Product;
