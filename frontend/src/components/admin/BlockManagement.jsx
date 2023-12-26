import { useEffect, useState } from "react";
import apiRequest from "../../services/api.js"; //endpoint, method = "GET", payload = null
import blockManagement from "../../assets/css/admin/BlockManagement.module.css";
import { useMainContext } from "../../context/mainContext/MainContext";
import { useAdminContext } from "../../context/adminContext/AdminContext";
import Product from "./blockManagement/Product";

function BlockManagement() {
  const { state: stateMain, dispatch: dispatchMain  } = useMainContext();
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
    let blockedProducts = state.products.filter((product) => product.blocked);
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
        if (filters["ספקים"] && filters["קטגוריות"]) {
          products.filter((product) => {
            filters["ספקים"].map((filter) => {
              filters["קטגוריות"].map((filter2) => {
                if (product.provider == filter && product.category == filter2) {
                  showProducts.push(product);
                }
              });
            });
          });
        } else if (filters["ספקים"]) {
          products.filter((product) => {
            filters["ספקים"].map((filter) => {
              if (product.provider == filter) {
                showProducts.push(product);
              }
            });
          });
        } else if (filters["קטגוריות"]) {
          products.filter((product) => {
            filters["קטגוריות"].map((filter) => {
              if (product.category == filter) {
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
            title: "קטגוריות",
            details: state.categories,
          },
        ],
      });
    }
  }, [state.providers, state.categories]);

  return (
    <>
      <div className={blockManagement.main}>
        <div className={blockManagement.header}>
          <span>
            <div className={blockManagement.title}>ניהול חסומים</div>
            {/* <div className={blockManagement.providerName}>ספק</div>  */}
          </span>
          <div className={blockManagement.headerButtons} onClick={showBlockedProducts}>
            הצג את כל הפריטים החסומים
          </div>
        </div>
        <div className={blockManagement.body}>
          {
            showProducts.map((product, i) => {
              return <Product product={product} key={i} block={product.blocked}
                checkedAll={checkedAll} added={added} removed={removed}/>
            })
          }
        </div>
        {showProducts.length != [] && (
          <div className={blockManagement.footer}>
            <div className={blockManagement.selectAll}>
              <input type="checkbox" onChange={() => setCheckedAll(!checkedAll)} checked={checkedAll}/>
              <div>בחר הכל</div>
            </div>

            <div className={blockManagement.buttons}>
              <div className={blockManagement.blockSelected} onClick={blockedProducts}>
                <div className={blockManagement.blockSelectedIcon}></div>
                <div>חסום פריטים מסומנים</div>
              </div>

              <div className={blockManagement.unblockSelected} onClick={unblockedProducts}> 
                הוצאה מחסום של פריטים מסומנים
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default BlockManagement;
