import { useState } from 'react';
import product from '../../assets/css/manager/ProductOrder.module.css';

import imgProduct from '../../assets/image/manager/0007434_-12-.png';


const ProductOrder = ({productData}) => {
    let { image, details, supplier, category, group, barcode } = productData;
    const [quantity, setQuantity] = useState(0);
    
      const onIncrease = () => {
        setQuantity(quantity + 1);
      }
    
      const onDecrease = () => {
          if (quantity > 0) {
            setQuantity(quantity - 1);
        }
      }
    
    return (
        <div className={product.product}>
            <img src={image ? image : imgProduct } alt={details} />
            <h2>{details}</h2>
            <p>{supplier}</p>
            <p>{group}</p>
            <p>{barcode}</p>
            <div>
                <button className={product.decrease} onClick={onIncrease}></button>
                <span>{quantity}</span>
                <button className={product.increase} onClick={onDecrease}></button>
            </div>
        </div>
    );
};

export default ProductOrder;