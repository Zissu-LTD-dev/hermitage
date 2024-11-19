import { useState, useEffect } from "react";
import productStyle from "../../../assets/css/admin/approvalsStatus/Product.module.css";
import { useMainContext } from "../../../context/mainContext/MainContext";
import imgProductDefault  from '../../../assets/image/products/000.png';
const { REACT_APP_PROJECT_IMAGES } = import.meta.env;

function Product({ productData, onDelete, onDecrease, onIncrease, orderBy }) {
  const { state, dispatch } = useMainContext();
  const [product, setProduct] = useState(productData);
  let { _id, name, price, subGroupName, barcode, quantity, QuantityLimit } = product;
  let originalQuantity = product.originalQuantity || quantity ;
  let image = `${REACT_APP_PROJECT_IMAGES}${barcode}.png`;
  const [imageError, setImageError] = useState(false);
  const [isQuantityLimit, setIsQuantityLimit] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  }

  useEffect(() => {
    if (quantity > QuantityLimit && QuantityLimit > 0) {
      setIsQuantityLimit(true);
    }
  }, [quantity, QuantityLimit]);
  

  return (
    <>
      <div className={productStyle.main} style={{backgroundColor: isQuantityLimit ? "rgba(255, 107, 107, 0.2)" : null }}>
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
          { quantity > QuantityLimit && QuantityLimit > 0 && <div className={productStyle.barcode}>מוגבל ל: {QuantityLimit} פריטים</div> }
          { orderBy != "pending" && <div className={productStyle.barcode}> {quantity} פריטים <br/> ( במקור {originalQuantity} פריטים ) </div> }
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
