import { useEffect, useState } from "react";
import apiRequest from "../../../services/api.js"; //endpoint, method = "GET", payload = null
import productStyle from "../../../assets/css/admin/blockManagement/Product.module.css";
import { useMainContext } from "../../../context/mainContext/MainContext";
import { useAdminContext } from "../../../context/adminContext/AdminContext";

import imgProductDefault  from '../../../assets/image/products/000.png';
const { REACT_APP_PROJECT_IMAGES } = import.meta.env;

function Product({ product, block,  checkedAll, added, removed }) {
  const { state: stateMain, dispatch: dispatchMain  } = useMainContext();
  const { state, dispatch } = useAdminContext();
  const [limited, setLimited] = useState(product.limited);
  const [imageError, setImageError] = useState(false);

  const [checked, setChecked] = useState(false);
  let { name, providerName, categoryName, barcode } = product;
  let image = `${REACT_APP_PROJECT_IMAGES}${barcode}.png`;

    // blockedProducts
    const blockedProducts = async() => {
      let res = await apiRequest("admin/updateBlockedProducts", "PUT", {
        productsBarcodeList: [barcode],
        blocked: true,
      });
      if(!res) return dispatchMain({ type: "SET_SHOW_ERROR", payload: { show: true, message: "אירעה שגיאה בחסימת הפריט" } });

      dispatchMain({ type: "SET_SHOW_SUCCESS", payload: { show: true, message: "הפריט חסום" } });
      dispatch({ type: "SET_BLOCKED_PRODUCTS", payload: [barcode] });      
      setChecked(false)
    }
  
    // unblockedProducts
    const unblockedProducts = async() => {
      let res = await apiRequest("admin/updateBlockedProducts", "PUT", {
        productsBarcodeList: [barcode],
        blocked: false,
      });
      if(!res) return dispatchMain({ type: "SET_SHOW_ERROR", payload: { show: true, message: "אירעה שגיאה בהוצאת הפריט מהחסימה" } });
  
      dispatchMain({ type: "SET_SHOW_SUCCESS", payload: { show: true, message: "הפריט הוצא מהחסימה" } });
      dispatch({ type: "SET_UNBLOCKED_PRODUCTS", payload: [barcode] });
      setChecked(false)
    }
  
  const handleLimited = async (limit) => {
      if (limit) {
        setLimited(true);
        dispatch({ type: "SET_LIMITED_PRODUCTS", payload: [barcode] });
        let res = await apiRequest("admin/updateLimitedProducts", "PUT", {
          barcode: barcode,
          limited: true,
        });
        if (!res) return dispatchMain({ type: "SET_SHOW_ERROR", payload: { show: true, message: "אירעה שגיאה בהגבלת הפריט" } });
        dispatchMain({ type: "SET_SHOW_SUCCESS", payload: { show: true, message: "הפריט הוגבל" } });
      } else {
        setLimited(false);
        dispatch({ type: "SET_UNLIMITED_PRODUCTS", payload: [barcode] });
        let res = await apiRequest("admin/updateLimitedProducts", "PUT", {
          barcode: barcode,
          limited: false,
        });
        if (!res) return dispatchMain({ type: "SET_SHOW_ERROR", payload: { show: true, message: "אירעה שגיאה בביטול הגבלת הפריט" } });
        dispatchMain({ type: "SET_SHOW_SUCCESS", payload: { show: true, message: "הגבלת הפריט בוטלה" } });
      }
    }

  const handleImageError = () => {
    setImageError(true);
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
            <img src={imageError ? imgProductDefault : image} alt={name} onError={handleImageError} />
          </div>
          <div className={productStyle.name}>{name}</div>
        </span>
        <span>
          <div className={productStyle.provider}>{providerName}</div>
          <div className={productStyle.category}>{categoryName}</div>
          <div className={productStyle.barcode}>{barcode}</div>
          {/* {!limited ? (
            <div
              className={productStyle.button + " " + productStyle.limitedText}
              onClick={() => handleLimited(true)}
            >
              <div>הגבל פריט</div>
            </div>
          ) : (
            <div
              className={productStyle.button + " " + productStyle.unlimitedText}
              onClick={() => handleLimited(false)}
            >
              <div>בטל הגבלה</div>
            </div>
          )} */}
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
