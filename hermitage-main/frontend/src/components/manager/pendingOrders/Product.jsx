import { useState } from "react";
import product from "../../../assets/css/manager/pendingOrders/Product.module.css";
const { REACT_APP_PROJECT_IMAGES } = import.meta.env;
import imgProductDefault  from '../../../assets/image/products/000.png';


function Product({ productData }) {
  let { name, subGroupName, barcode, quantity } = productData;

  let image = `${REACT_APP_PROJECT_IMAGES}${barcode}.png`;

  const [imageError, setImageError] = useState(false);

  const handleImageError = () => {
    setImageError(true);
  }




  return (
    <div className={product.main}>
      <span>
        <div className={product.img}>
          <img src={imageError ? imgProductDefault : image} alt={name} onError={handleImageError} />
        </div>
        <div className={product.name}>{name}</div>
      </span>
      <span>
        <div className={product.category}>{subGroupName}</div>
        <div className={product.barcode}>{barcode}</div>
        <div className={product.quantity}>{quantity} יחידות</div>
      </span>
    </div>
  );
}

export default Product;
