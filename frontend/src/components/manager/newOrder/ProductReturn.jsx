import { useState, useEffect } from "react";
import product from "../../../assets/css/manager/newOrder/ProductReturn.module.css";
import { useMainContext } from "../../../context/mainContext/MainContext";

import imgProductDefault  from '../../../assets/image/products/000.png';
const { REACT_APP_PROJECT_IMAGES } = import.meta.env;

const ProductReturn = ({ productData }) => {
  const { state, dispatch } = useMainContext();

  // let { image, name, providerName, categoryName, barcode } = productData;
  let { name, providerName, subGroupName,  barcode, packQuantity, price } = productData;
  let image = `${REACT_APP_PROJECT_IMAGES}${barcode}.png`;

  const [imageError, setImageError] = useState(false);
  const [active, setActive] = useState(productData.quantity ? true : false);
  const [quantity, setQuantity] = useState(productData.quantity ? productData.quantity : 1);

  const onIncrease = () => {
    setQuantity(quantity + 1);
    dispatch({
      type: "ADD_RETURNED_PRODUCT",
      payload: { ...productData, quantity: quantity + 1 },
    });
  };

  const onDecrease = () => {
    if (quantity > 0) {
      setQuantity(quantity - 1);
      if (quantity > 1) {
        dispatch({
          type: "ADD_RETURNED_PRODUCT",
          payload: { ...productData, quantity: quantity - 1 },
        });
      } else {
        dispatch({ type: "REMOVE_RETURNED_PRODUCT", payload: barcode });
      }
    }
  };

  const handleImageError = () => {
    setImageError(true);
  }

  useEffect(() => {
    if(!active){
      dispatch({ type: "REMOVE_RETURNED_PRODUCT", payload: barcode });
      setQuantity(1);
    }
    if(active){
      dispatch({
        type: "ADD_RETURNED_PRODUCT",
        payload: { ...productData, quantity: quantity },
      });
    }
  }, [active]);

  useEffect(() => {
    if (state.returnedProducts.length != []) {
      state.returnedProducts.forEach((product) => {
        if (product.barcode === barcode) {
          setQuantity(product.quantity);
          setActive(true);
        }
      });
    }
  }, [state.displayFilters, state.searchResults]);

  return (
    <div className={product.main}>
      <span>
      <img src={imageError ? imgProductDefault : image} alt={name} onError={handleImageError} />
      <h2>{name}</h2>
      </span>

      <span>
        <p>{providerName}</p>
        <p>{subGroupName}</p>
        <p>{price ? `${price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, "$&,")}₪` : "אין מחיר זמין"}</p>
        <p>{barcode}</p>
        {active && (
          <>
            <div onClick={() => setActive(false)} className={product.activeBtn + " " + product.btn}>
              <div className={product.activeBtnIcon}></div>
              <div className={product.activeBtnText}>הורד מוצר מהחזרה</div>
            </div>
            <div className={product.buttons}>
              <button
                className={product.decrease}
                onClick={onIncrease}
              ></button>
              <div className={product.quantity} >{quantity}</div>
              <button
                className={product.increase}
                onClick={onDecrease}
              ></button>
            </div>
          </>
        )}
        {!active && (
          <>
            <div onClick={() => setActive(true)} className={product.btn}>
              <div className={product.btnIcon}></div>
              <div className={product.btnText}>הוסף מוצר להחזרה </div>
            </div>
            <div className={product.buttons + " " + product.disabled}>
              <button className={product.decrease}></button>
              <div className={product.quantity} >{quantity}</div>
              <button className={product.increase}></button>
            </div>
          </>
        )}
      </span>
    </div>
  );
};

export default ProductReturn;
