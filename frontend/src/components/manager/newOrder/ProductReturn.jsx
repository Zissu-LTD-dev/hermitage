import { useState, useEffect } from "react";
import product from "../../../assets/css/manager/newOrder/ProductReturn.module.css";
import { useMainContext } from "../../../context/mainContext/MainContext";

import imgProduct from "../../../assets/image/manager/0007434_-12-.png";

const ProductReturn = ({ productData }) => {
  const { state, dispatch } = useMainContext();

  let { image, name, providerName, categoryName, barcode } = productData;
  const [active, setActive] = useState(false);
  const [quantity, setQuantity] = useState(0);

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

  useEffect(() => {
    if(!active){
      dispatch({ type: "REMOVE_RETURNED_PRODUCT", payload: barcode });
      setQuantity(0);
    }else{
      setQuantity(1);
      dispatch({
        type: "ADD_RETURNED_PRODUCT",
        payload: { ...productData, quantity: quantity + 1 },
      });
    }
  }, [active]);

  return (
    <div className={product.main}>
      <span>
        <img src={image ? image : imgProduct} alt={name} />
        <h2>{name}</h2>
      </span>

      <span>
        <p>{providerName}</p>
        <p>{categoryName}</p>
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
