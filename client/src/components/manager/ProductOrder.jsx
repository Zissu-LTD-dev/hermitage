import React from 'react';
import product from '../../assets/css/manager/ProductOrder.module.css';

import imgProduct from '../../assets/image/manager/0007434_-12-.png';


const ProductOrder = ({ productData, onIncrease, onDecrease }) => {
    let { image, details, supplier, group, barcode, quantity } = productData;
    
    
    return (
        <div className={product.product}>
            <img src={image ? image : imgProduct } alt={details} />
            <h2>{details}</h2>
            <p>{supplier}</p>
            <p>{group}</p>
            <p>{barcode}</p>
            <div>
                <button className={product.decrease} onClick={onDecrease}></button>
                <span>{quantity}</span>
                <button className={product.increase} onClick={onIncrease}></button>
            </div>
        </div>
    );
};

export default ProductOrder;