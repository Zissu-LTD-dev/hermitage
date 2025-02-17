import { useState, useEffect } from "react";
import product from "../../../assets/css/manager/newOrder/ProductOrder.module.css";
import { useMainContext } from "../../../context/mainContext/MainContext";

import imgProductDefault from "../../../assets/image/products/000.png";
const { REACT_APP_PROJECT_IMAGES } = import.meta.env;

const ProductOrder = ({ productData }) => {
  const { state, dispatch } = useMainContext();

  let {
    name,
    providerName,
    subGroupName,
    barcode,
    packQuantity,
    price,
    isBlocked,
  } = productData;
  let QuantityPerCase = packQuantity ? packQuantity : 1;
  let fixPrice = price
    ? `${price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}₪`
    : "אין מחיר זמין";
  let image = `${REACT_APP_PROJECT_IMAGES}${barcode}.png`;

  const [quantity, setQuantity] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [warningMessage, setWarningMessage] = useState("");

  const onIncrease = () => {
    const newQuantity = quantity + QuantityPerCase;
    setQuantity(newQuantity);
    dispatch({
      type: "ADD_ORDERED_PRODUCT",
      payload: {
        ...productData,
        quantity: newQuantity,
        originalQuantity: newQuantity,
      },
    });
  };

  const onDecrease = () => {
    if (quantity >= QuantityPerCase) {
      const newQuantity = quantity - QuantityPerCase;
      setQuantity(newQuantity);
      if (newQuantity > 0) {
        dispatch({
          type: "ADD_ORDERED_PRODUCT",
          payload: {
            ...productData,
            quantity: newQuantity,
            originalQuantity: newQuantity,
          },
        });
      } else {
        dispatch({ type: "REMOVE_ORDERED_PRODUCT", payload: barcode });
      }
    }
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handleQuantityChange = (e) => {
    const value = e.target.value;
    if (value === "") {
      setQuantity(0);
      dispatch({ type: "REMOVE_ORDERED_PRODUCT", payload: barcode });
      return;
    }
    if (!/^\d*$/.test(value)) {
      return;
    }
    setQuantity(parseInt(value, 10) || 0);
  };

  const handleQuantityBlur = () => {
    const newQuantity = quantity;

    if (newQuantity > 0 && newQuantity < QuantityPerCase) {
      setQuantity(QuantityPerCase);
      setWarningMessage(
        `הכמות עוגלה ל ${QuantityPerCase} (מוצר זה מגיע במכפלות של ${QuantityPerCase}).`
      );
    } else if (newQuantity % QuantityPerCase !== 0) {
      const roundedQuantity =
        Math.floor(newQuantity / QuantityPerCase) * QuantityPerCase;
      setQuantity(roundedQuantity);
      setWarningMessage(
        `הכמות עוגלה ל ${roundedQuantity} (מוצר זה מגיע במכפלות של ${QuantityPerCase}).`
      );
    } else {
      setWarningMessage("");
    }

    if (newQuantity > 0) {
      dispatch({
        type: "ADD_ORDERED_PRODUCT",
        payload: {
          ...productData,
          quantity: newQuantity,
          originalQuantity: newQuantity,
        },
      });
    } else {
      dispatch({ type: "REMOVE_ORDERED_PRODUCT", payload: barcode });
    }
  };

  useEffect(() => {
    state.orderedProducts.forEach((product) => {
      if (product.barcode === barcode) {
        setQuantity(product.quantity);
      }
    });
  }, [productData]);

  return (
    <div className={product.product}>
      {warningMessage && (
        <div
          className={product.warning}
          style={{
            textAlign: "right",
            direction: "rtl",
            color: "red",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "5px",
            backgroundColor: "#f8d7da",
          }}
        >
          {warningMessage}
        </div>
      )}
      <img
        src={imageError ? imgProductDefault : image}
        alt={name}
        onError={handleImageError}
      />
      <h2>{name}</h2>
      <p>כמות באריזה: {QuantityPerCase} </p>
      {/* <p>{providerName}</p> */}
      {/* <p>{subGroupName}</p> */}
      <p>{fixPrice}</p>
      <p>{barcode}</p>
      <div className={product.buttons}>
        {isBlocked && <span className={product.blocked}> מוצר חסום</span>}
        {!isBlocked && (
          <>
            <button className={product.decrease} onClick={onIncrease}></button>
            <input
              type='text'
              value={quantity}
              pattern='[0-9]*'
              onChange={handleQuantityChange}
              onBlur={handleQuantityBlur}
              className={product.quantityInput}
            />
            <button className={product.increase} onClick={onDecrease}></button>
          </>
        )}
      </div>
    </div>
  );
};

export default ProductOrder;
