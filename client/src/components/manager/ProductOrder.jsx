import { useState } from 'react';
import product from '../../assets/css/manager/ProductOrder.module.css';

import imgProduct from '../../assets/image/manager/0007434_-12-.png';


const ProductOrder = () => {
    const [productData, setProductData] = useState({
        image: "",
        details: "מוצר נהדר",
        supplier: "ספק מצויין",
        category: "קטגוריה נהדרת",
        group: "קבוצה נהדרת",
        barcode: "123456789",
        quantity: 0,
      });
    
      const onIncrease = () => {
        setProductData({ ...productData, quantity: productData.quantity + 1 });
      }
    
      const onDecrease = () => {
        if (productData.quantity > 0) {
          setProductData({ ...productData, quantity: productData.quantity - 1 });
        }
      }
    
    return (
        <div className={product.product}>
            <img src={productData.image ? productData.image : imgProduct } alt={productData.details} />
            <h2>{productData.details}</h2>
            <p>{productData.supplier}</p>
            <p>{productData.group}</p>
            <p>{productData.barcode}</p>
            <div>
                <button className={product.decrease} onClick={onIncrease}></button>
                <span>{productData.quantity}</span>
                <button className={product.increase} onClick={onDecrease}></button>
            </div>
        </div>
    );
};

export default ProductOrder;