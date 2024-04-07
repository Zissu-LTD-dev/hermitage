import { useState, useEffect } from "react";
import productStyle from "../../../assets/css/admin/addingProducts/Product.module.css";
import { useAdminContext } from "../../../context/adminContext/AdminContext";
import img from "../../../assets/image/manager/0007434_-12-.png";

function Product({product, deleteProduct, editProduct}) {
  const { state, dispatch } = useAdminContext();
  let {_id, barcode, name, providerName, category, subGroupName, price} = product;
  const [categoryName, setCategoryName] = useState("");
  

  useEffect(() => {
    if(category) {
      let cat = state.categories.find((cat) => cat.number == category);
      setCategoryName(cat.name);
    }
  }, [state.categories]);

  return (
    <>
      <div className={productStyle.main}>
        <span>
          <div className={productStyle.productImg}>
            <img src={img} />
          </div>
          <div className={productStyle.productName}>{name}</div>
        </span>
        <span>
          <div className={productStyle.productDetails + " " + productStyle.providerName}>
            <div className={productStyle.Text}>{providerName}</div>
          </div>
          <div className={productStyle.productDetails}>
            <div className={productStyle.Text}>{categoryName}</div>
          </div>
          <div className={productStyle.productDetails}>
            <div className={productStyle.Text}>{subGroupName}</div>
          </div>
          <div className={productStyle.productDetails}>
            <div className={productStyle.Text}>{barcode}</div>
          </div>
          {/* price */}
          <div className={productStyle.productDetails}>
            <div className={productStyle.Text}>{price}₪</div>
          </div>
          <div className={productStyle.Icon} onClick={() => editProduct(product)}></div>
          <div className={productStyle.productDelete} onClick={() => deleteProduct(_id)}></div>
        </span>
      </div>
    </>
  );
}

export default Product;
