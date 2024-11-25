import { useState } from "react";
import { useMainContext } from "../../../context/mainContext/MainContext";
import product from "../../../assets/css/manager/newOrder/ProductOrderSummary.module.css";

import imgProductDefault  from '../../../assets/image/products/000.png';
const { REACT_APP_PROJECT_IMAGES } = import.meta.env;

const ProductOrder = ({ productData }) => {
  const { state, dispatch } = useMainContext();
  const [imageError, setImageError] = useState(false);
  let { name, providerName, subGroupName,  barcode, packQuantity, price, quantity } = productData;
  let image = `${REACT_APP_PROJECT_IMAGES}${barcode}.png`;

  const onIncrease = () => {
    dispatch({
      type: "ADD_ORDERED_PRODUCT",
      payload: { ...productData, quantity: quantity + 1, originalQuantity: quantity + 1 },
    });
  };

  const onDecrease = () => {
    if (productData.quantity > 1) {
      dispatch({
        type: "ADD_ORDERED_PRODUCT",
        payload: { ...productData, quantity: quantity - 1, originalQuantity: quantity - 1 },
      });
    } else {
      dispatch({
        type: "ADD_ORDERED_PRODUCT",
        payload: { ...productData, quantity: 0, originalQuantity: 0 },
      });
    }
  };

  const handleQuantityChange = (e) => {
    if (!/^\d+$/.test(e.target.value))  return;
    const newQuantity = parseInt(e.target.value, 10);
    if (newQuantity > 0) {
      dispatch({ type: "ADD_ORDERED_PRODUCT", payload: { ...productData, quantity: newQuantity, originalQuantity: newQuantity } });
    } else {
      dispatch({ type: "ADD_ORDERED_PRODUCT", payload: { ...productData, quantity: 0, originalQuantity: 0 } });
    }
  };

  const handleImageError = () => {
    setImageError(true);
  }

  return (
    <div className={product.product}>
      <span>
      <img src={imageError ? imgProductDefault : image} alt={name} onError={handleImageError} />
      <span className={product.details}>
          <h2>{name}</h2>
        </span>
      </span>
      <span className={product.moreDetails}>
        <p>{providerName}</p>
        {/* <p>{productData.group}</p> */}
        <p>{subGroupName}</p>
        <p>{barcode}</p>
        <p>{price ? `${price}₪` : "אין מחיר זמין"}</p>
        <div className={product.buttons}>
          <button className={product.decrease} onClick={onIncrease}></button>
          <input 
              type="text" 
              value={quantity}
              pattern="[0-9]*"
              onChange={handleQuantityChange} 
              className={product.quantityInput}
            />
          <button className={product.increase} onClick={onDecrease}></button>
        </div>
      </span>
    </div>
  );
};

export default ProductOrder;
