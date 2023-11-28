import { useState } from "react";
import productStyle from "../../../assets/css/admin/approvalsStatus/Product.module.css";
import imgProduct from "../../../assets/image/manager/0007434_-12-.png";
import { useOrderContext } from "../../../context/orderContext/OrderContext";

function Product({productData, onDelete, onDecrease, onIncrease }) {
  const { state, dispatch } = useOrderContext();
  const [product, setProduct] = useState(productData);
  let { _id , name, categoryName, barcode, quantity } = product;
   

  return (
    <>
      <div className={productStyle.main}>
        <div className={productStyle.img}>
            <img src={imgProduct} alt="img" />
        </div>
        <div className={productStyle.name}>{name}</div>
        <div className={productStyle.category}>{categoryName}</div>
        <div className={productStyle.barcode}>{barcode}</div>
        <div className={productStyle.quantity}>
          <button className={productStyle.decrease} onClick={()=>onDecrease(product)}></button>
          <span>{quantity}</span>
          <button className={productStyle.increase} onClick={()=>onIncrease(product)}></button>
        </div>
        <div className={productStyle.buttonDelete} onClick={()=>onDelete(product)}></div>
      </div>
    </>
  );
}

export default Product;
