import { useState, useEffect } from "react";
import productStyle from "../../../assets/css/admin/approvalsStatus/Product.module.css";
import { useMainContext } from "../../../context/mainContext/MainContext";
import imgProductDefault  from '../../../assets/image/products/000.png';
const { REACT_APP_PROJECT_IMAGES } = import.meta.env;

function Product({ productData, onDelete, onDecrease, onIncrease, orderBy }) {
  const { state, dispatch } = useMainContext();
  const [product, setProduct] = useState(productData);
  let { _id, name, price, subGroupName, barcode, quantity } = product;
  let image = `${REACT_APP_PROJECT_IMAGES}${barcode}.png`;
  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  }

  return (
    <>
      <div className={productStyle.main}>
        <span>
          <div className={productStyle.img}>
            <img src={imageError ? imgProductDefault : image} alt={name} onError={handleImageError} />
          </div>
          <div className={productStyle.name}>{name}</div>
        </span>
        <span>
          <div className={productStyle.category}>{subGroupName}</div>
          <div className={productStyle.barcode}>{barcode}</div>
          <div className={productStyle.barcode}>{price}₪</div>
          { orderBy != "pending" && <div className={productStyle.barcode}> {quantity} פריטים </div> }
          { orderBy == "pending" && (
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
