import { useState } from "react";
import productStyle from "../../../assets/css/admin/approvalsStatus/Product.module.css";
import imgProduct from "../../../assets/image/manager/0007434_-12-.png";
import { useMainContext } from "../../../context/mainContext/MainContext";

function Product({ productData, onDelete, onDecrease, onIncrease, orderBy }) {
  const { state, dispatch } = useMainContext();
  const [product, setProduct] = useState(productData);
  let { _id, name, price, subGroupName, barcode, quantity } = product;

  return (
    <>
      <div className={productStyle.main}>
        <span>
          <div className={productStyle.img}>
            <img src={imgProduct} alt="img" />
          </div>
          <div className={productStyle.name}>{name}</div>
        </span>
        <span>
          <div className={productStyle.category}>{subGroupName}</div>
          <div className={productStyle.barcode}>{barcode}</div>
          <div className={productStyle.barcode}>{price}₪</div>
          { orderBy != "panding" && <div className={productStyle.barcode}> {quantity} פריטים </div> }
          { orderBy == "panding" && (
            <>
              <div className={productStyle.quantity}>
                <button
                  className={productStyle.decrease}
                  onClick={() => onDecrease(product)}
                ></button>
                <div className={productStyle.quantityNum}>{quantity}</div>
                <button
                  className={productStyle.increase}
                  onClick={() => onIncrease(product)}
                ></button>
              </div>
              <div
                className={productStyle.buttonDelete}
                onClick={() => onDelete(product)}
              ></div>
            </>
          )}
        </span>
      </div>
    </>
  );
}

export default Product;
