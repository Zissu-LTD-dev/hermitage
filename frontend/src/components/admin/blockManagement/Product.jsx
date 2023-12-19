import { useEffect, useState } from "react";
import apiRequest from "../../../services/api.js"; //endpoint, method = "GET", payload = null
import productStyle from "../../../assets/css/admin/blockManagement/Product.module.css";
import { useAdminContext } from "../../../context/adminContext/AdminContext";
import img from "../../../assets/image/manager/0007434_-12-.png";

function Product({ product, block,  checkedAll, added, removed }) {
  const { state, dispatch } = useAdminContext();

  const [checked, setChecked] = useState(false);
  let { name, providerName, categoryName, barcode } = product;

    // blockedProducts
    const blockedProducts = async() => {
      let res = await apiRequest("admin/updateBlockedProducts", "PUT", {
        productsBarcodeList: [barcode],
        blocked: true,
      });
  
      dispatch({ type: "SET_BLOCKED_PRODUCTS", payload: [barcode] });      
      setChecked(false)
    }
  
    // unblockedProducts
    const unblockedProducts = async() => {
      let res = await apiRequest("admin/updateBlockedProducts", "PUT", {
        productsBarcodeList: [barcode],
        blocked: false,
      });
  
      dispatch({ type: "SET_UNBLOCKED_PRODUCTS", payload: [barcode] });
      setChecked(false)
    }
  

  useEffect(() => {
    if (checked) added(barcode);
    else removed(barcode);
  }, [checked]);

  useEffect(() => {
    setChecked(checkedAll);
  }, [checkedAll, block]);

  return (
    <>
      <div
        className={
          block
            ? productStyle.blocked + " " + productStyle.main
            : productStyle.main
        }
      >
        <span>
          <div className={productStyle.checkboxSelect}>
            <input type="checkbox" checked={checked} onChange={() => setChecked(!checked)}/>
          </div>
          <div className={productStyle.image}>
            <img src={img} />
          </div>
          <div className={productStyle.name}>{name}</div>
        </span>
        <span>
          <div className={productStyle.provider}>{providerName}</div>
          <div className={productStyle.category}>{categoryName}</div>
          <div className={productStyle.barcode}>{barcode}</div>
          {!block ? (
            <div
              className={productStyle.button + " " + productStyle.blockedText}
              onClick={blockedProducts}
            >
              <div className={productStyle.blockedIcon}></div>
              <div>חסום פריט</div>
            </div>
          ) : (
            <div
              className={productStyle.button + " " + productStyle.unblockedText}
              onClick={unblockedProducts}
            >
              <div>הוצא מחסום</div>
            </div>
          )}
        </span>
      </div>
    </>
  );
}

export default Product;
