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
    <div className={`flex justify-between align-center mb-2 ${block ? 'bg-light' : 'bg-white'}`} style={{
      width: '100%',
      height: '77px',
      boxShadow: '0px 3px 6px #082a3a05',
      padding: '0 23px 0 29px',
      opacity: block ? 0.45 : 1
    }}>
      <div className="flex align-center">
        <div className="flex align-center">
          <input 
            type="checkbox" 
            checked={checked} 
            onChange={() => setChecked(!checked)}
            style={{
              width: '22px',
              height: '22px',
              border: '1px solid #082a3a'
            }}
          />
        </div>
        <div style={{
          width: '75px',
          height: '68px',
          margin: '0 0 0 20px'
        }}>
          <img 
            src={imageError ? imgProductDefault : image} 
            alt={name} 
            onError={handleImageError}
            style={{
              width: '100%',
              height: '100%',
              opacity: block ? 0.45 : 1
            }}
          />
        </div>
        <div style={{
          fontSize: '14px',
          fontWeight: 600,
          lineHeight: '18px',
          fontFamily: 'IBM Plex Sans Hebrew',
          color: '#082a3a'
        }}>
          {name}
        </div>
      </div>
      <div className="flex align-center">
        {['provider', 'category', 'barcode'].map((field) => (
          <div key={field} style={{
            fontSize: '11px',
            fontFamily: 'IBM Plex Sans Hebrew',
            lineHeight: '14px',
            color: '#9eaaaf',
            marginLeft: '45px'
          }}>
            {product[field + 'Name'] || product[field]}
          </div>
        ))}
        {!block ? (
          <button 
            className="flex align-center justify-center"
            onClick={blockedProducts}
            style={{
              width: '133px',
              height: '33px',
              backgroundColor: '#BE955D',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 500,
              marginRight: '20px'
            }}
          >
            <div style={{
              width: '15px',
              height: '15px',
              marginLeft: '7px',
              backgroundImage: 'url(../../../assets/image/admin/blockw.svg)',
              backgroundPosition: '50% 50%',
              backgroundRepeat: 'no-repeat'
            }}></div>
            חסום פריט
          </button>
        ) : (
          <button 
            onClick={unblockedProducts}
            style={{
              width: '133px',
              height: '33px',
              backgroundColor: '#082A3A',
              color: '#ffffff',
              fontSize: '14px',
              fontWeight: 500,
              marginRight: '20px'
            }}
          >
            הוצא מחסום
          </button>
        )}
      </div>
    </div>
  );
}

export default Product;
