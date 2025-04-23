import { useEffect, useState } from "react";
import apiRequest from "../../services/api.js"; //endpoint, method = "GET", payload = null
import { useMainContext } from "../../context/mainContext/MainContext";
import { useAdminContext } from "../../context/adminContext/AdminContext";
import Product from "./blockManagement/Product";

function BlockManagement() {
  const { state: stateMain, dispatch: dispatchMain } = useMainContext();
  const { state, dispatch } = useAdminContext();
  const [showProducts, setShowProducts] = useState([]);
  const [checkedAll, setCheckedAll] = useState(false);
  const [blockedList, setBlockedList] = useState([]);

  const added = (barcode) => {
    if (!blockedList.includes(barcode)) setBlockedList((blockedList) => [...blockedList, barcode]);
  }

  const removed = (barcode) => {
    if (blockedList.includes(barcode)) setBlockedList((blockedList) => blockedList.filter((barcodeA) => barcodeA != barcode));
  }

  const blockedProducts = async() => {
    let res = await apiRequest("admin/updateBlockedProducts", "PUT", {
      productsBarcodeList: blockedList,
      blocked: true,
    });
    if(!res) return dispatchMain({ type: "SET_SHOW_ERROR", payload: { show: true, message: "אירעה שגיאה בחסימת הפריטים" } });

    dispatchMain({ type: "SET_SHOW_SUCCESS", payload: { show: true, message: "הפריטים חוסמו" } });
    dispatch({ type: "SET_BLOCKED_PRODUCTS", payload: blockedList });
    
    setBlockedList([]);
    setCheckedAll(false);
  }

  const unblockedProducts = async() => {
    let res = await apiRequest("admin/updateBlockedProducts", "PUT", {
      productsBarcodeList: blockedList,
      blocked: false,
    });
    if(!res) return dispatchMain({ type: "SET_SHOW_ERROR", payload: { show: true, message: "אירעה שגיאה בהוצאת הפריטים מהחסימה" } });

    dispatchMain({ type: "SET_SHOW_SUCCESS", payload:  { show: true, message: "הפריטים הוצאו מהחסימה" } });
    dispatch({ type: "SET_UNBLOCKED_PRODUCTS", payload: blockedList });
    
    setBlockedList([]);
    setCheckedAll(false);
  }

  const showBlockedProducts = () => {
    let blockedProducts = state.products.filter((product) => product.isBlocked);
    setShowProducts(blockedProducts);
  };

  // filters
  useEffect(() => {
    if(state.displayFilters == []){
      dispatch({ type: "SET_SEARCH", payload: "" });
    }
    if (state.products) {
      let products = state.products;
      let filters = state.displayFilters;
      let showProducts = [];

      if (state.displayFilters.length != []) {
        if (filters["ספקים"] && filters["קבוצת משנה"]) {
          products.filter((product) => {
            filters["ספקים"].map((filter) => {
              filters["קבוצת משנה"].map((filter2) => {
                if (product.providerNumber == filter && product.subGroupNumber == filter2) {
                  showProducts.push(product);
                }
              });
            });
          });
        } else if (filters["ספקים"]) {
          products.filter((product) => {
            filters["ספקים"].map((filter) => {
              if (product.providerNumber == filter) {
                showProducts.push(product);
              }
            });
          });
        } else if (filters["קבוצת משנה"]) {
          products.filter((product) => {
            filters["קבוצת משנה"].map((filter) => {
              if (product.subGroupNumber == filter) {
                showProducts.push(product);
              }
            });
          });
        } else {
          showProducts = [];
        }
        showProducts = [...new Set(showProducts)];
      }
      setShowProducts(showProducts);
    }
  }, [state.displayFilters]);

  // search
  useEffect(() => {
    if (state.searchResults != []) {
      setShowProducts(state.searchResults);
    }
  }, [state.searchResults]);

  useEffect(() => {
    if (state.providers != [] && state.categories != []) {
      dispatch({
        type: "SET_FILTERS",
        payload: [
          {
            title: "ספקים",
            details: state.providers,
          },
          {
            title: "קבוצת משנה",
            details: state.subGroups,
          },
        ],
      });
    }
  }, [state.providers, state.subGroups]);

  useEffect(() => {
    if(showProducts.length == 0 && state.search == "" ){
      showBlockedProducts();
    }
  }, [state.search, showProducts]);

  return (
    <div className="admin-card" style={{ height: '100%', direction: 'rtl', margin: '10px' }}>
      <div className="flex justify-between align-center mb-3">
        <div className="flex align-center">
          <h2 className="text-dark" style={{
            fontSize: '28px',
            fontWeight: '500',
            lineHeight: '37px',
            fontFamily: 'IBM Plex Sans Hebrew',
            paddingLeft: '25px',
            borderLeft: '1px solid #7070705e'
          }}>
            ניהול חסומים
          </h2>
        </div>
        <button 
          className="btn" 
          onClick={showBlockedProducts}
          style={{
            width: '205px',
            height: '33px',
            backgroundColor: '#BE955D',
            fontSize: '14px',
            color: '#ffffff'
          }}
        >
          הצג את כל הפריטים החסומים
        </button>
      </div>

      <div className="flex flex-wrap justify-between align-center mb-3" style={{
        height: '75%',
        overflowY: 'auto',
        overflowX: 'hidden'
      }}>
        {showProducts.map((product, i) => (
          <Product 
            product={product} 
            key={product.barcode} 
            block={product.isBlocked}
            checkedAll={checkedAll} 
            added={added} 
            removed={removed}
          />
        ))}
      </div>

      {showProducts.length !== 0 && (
        <div className="flex justify-between align-center" style={{
          height: '61px',
          backgroundColor: '#FFFFFF',
          boxShadow: '0px 3px 6px #082A3A05'
        }}>
          <div className="flex align-center">
            <input 
              type="checkbox" 
              onChange={() => setCheckedAll(!checkedAll)} 
              checked={checkedAll}
              style={{
                width: '22px',
                height: '22px',
                border: '1px solid #082A3A',
                marginLeft: '14px'
              }}
            />
            <span>בחר הכל</span>
          </div>

          <div className="flex align-center">
            <button 
              className="btn" 
              onClick={blockedProducts}
              style={{
                width: '186px',
                height: '33px',
                backgroundColor: '#BE955D',
                fontSize: '14px',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <div style={{
                width: '15px',
                height: '15px',
                padding: '0 5px',
                backgroundImage: 'url(../../assets/image/admin/blockw.svg)',
                backgroundPosition: '50% 50%',
                backgroundRepeat: 'no-repeat'
              }}></div>
              חסום פריטים מסומנים
            </button>

            <button 
              className="btn" 
              onClick={unblockedProducts}
              style={{
                width: '233px',
                height: '33px',
                backgroundColor: '#082A3A',
                fontSize: '14px',
                color: '#FFFFFF',
                marginRight: '8px'
              }}
            >
              הוצאה מחסום של פריטים מסומנים
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BlockManagement;
