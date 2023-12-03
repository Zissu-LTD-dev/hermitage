import { useState } from "react";
import { useOrderContext } from "../../../context/orderContext/OrderContext";
import product from "../../../assets/css/manager/newOrder/ProductOrderSummary.module.css";

import imgProduct from "../../../assets/image/manager/0007434_-12-.png";

const ProductOrder = ({ productData }) => {
  const { state, dispatch } = useOrderContext();

  let { image, name, providerName, categoryName, barcode, quantity } =
    productData;
  const onIncrease = () => {
    dispatch({
      type: "ADD_ORDERED_PRODUCT",
      payload: { ...productData, quantity: quantity + 1 },
    });
  };

  const onDecrease = () => {
    if (productData.quantity > 1) {
      dispatch({
        type: "ADD_ORDERED_PRODUCT",
        payload: { ...productData, quantity: quantity - 1 },
      });
    } else {
      dispatch({ type: "REMOVE_ORDERED_PRODUCT", payload: barcode });
    }
  };

  return (
    <div className={product.product}>
      <span>
        <img src={image ? image : imgProduct} alt="img" />
        <span className={product.details}>
          <h2>{name}</h2>
        </span>
      </span>
      <span>
        <p>{providerName}</p>
        {/* <p>{productData.group}</p> */}
        <p>{categoryName}</p>
        <p>{barcode}</p>
        <div className={product.buttons}>
          <button className={product.decrease} onClick={onIncrease}></button>
          <span className={product.quantityNum}>{quantity}</span>
          <button className={product.increase} onClick={onDecrease}></button>
        </div>
      </span>
    </div>
  );
};

export default ProductOrder;
