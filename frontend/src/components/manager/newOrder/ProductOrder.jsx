import { useState, useEffect } from 'react';
import product from '../../../assets/css/manager/newOrder/ProductOrder.module.css';
import { useMainContext } from '../../../context/mainContext/MainContext';

import imgProduct from '../../../assets/image/manager/0007434_-12-.png';


const ProductOrder = ({productData}) => {
  const { state, dispatch } = useMainContext();

    let { image, name, providerName, subGroupName,  barcode, packQuantity, price, isBlocked } = productData;
    let QuantityPerCase = packQuantity ? packQuantity : 1;
    let fixPrice = price ?`${price.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}₪`: 'אין מחיר זמין';
    const [quantity, setQuantity] = useState(0);
    
      const onIncrease = () => {
        setQuantity(quantity + 1);
        dispatch({ type: "ADD_ORDERED_PRODUCT", payload: { ...productData, quantity: quantity + 1 } });
      }
      
      const onDecrease = () => {
        if (quantity > 0) {
          setQuantity(quantity - 1);
          if(quantity > 1){
            dispatch({ type: "ADD_ORDERED_PRODUCT", payload: { ...productData, quantity: quantity - 1 } });
          }else{
          dispatch({ type: "REMOVE_ORDERED_PRODUCT", payload:  barcode  });
        }}

      }

    useEffect(() => {
      state.orderedProducts.forEach((product) => {
        if (product.barcode === barcode) {
          setQuantity(product.quantity);
        }
      });
    }, [productData]);
    
    return (
        <div className={product.product}>
            <img src={image ? image : imgProduct } alt={name} />
            <h2>{name}</h2>
            <p>כמות באריזה: {QuantityPerCase} </p>
            <p>{providerName}</p>
            <p>{subGroupName}</p>
            <p>{fixPrice}</p>
            <p>{barcode}</p>
            <div className={product.buttons}>
                {isBlocked && <span className={product.blocked}> מוצר חסום</span>}
                {!isBlocked && (
                  <>
                    <button className={product.decrease} onClick={onIncrease}></button>
                    <span>{quantity}</span>
                    <button className={product.increase} onClick={onDecrease}></button>
                  </>
                )}
            </div>
        </div>
    );
};

export default ProductOrder;