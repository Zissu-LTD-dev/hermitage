import { useState, useEffect } from "react";
import newOrder from "../../assets/css/manager/NewOrder.module.css";
import { useMainContext } from "../../context/mainContext/MainContext";
import apiRequest from "../../services/api";
import Categories from "./newOrder/Categories";
import Wizard from "./newOrder/Wizard";
import Column from "./newOrder/Column";
import ProductOrderSummary from "./newOrder/ProductOrderSummary";
import OrderSummary from "./newOrder/OrderSummary";
import OrderFilterProduct from "./newOrder/OrderFilterProduct";
import ReturnFilterProduct from "./newOrder/ReturnFilterProduct";

function DynamicContent() {
  const { state, dispatch } = useMainContext();
  const [activeFiltersSearch, setActiveFiltersSearch] = useState(false);
  const [branches, setBranches] = useState([]);
  const [showPopup, setShowPopup] = useState(false);

  const getBranches = async () => {
    let data = await apiRequest("admin/allBranches");
    if (!data) return false;    
    return data;
  };

  const handleContinueOrder = () => {
    setShowPopup(false);
  };

  const handleNewOrder = () => {
    localStorage.removeItem("activeOrder");
    setShowPopup(false);
    localStorage.setItem("activeOrder", '{}');
  };

  const updateActiveOrder = () => {
    const activeOrder = {
      orderedProducts: state.orderedProducts,
      returnedProducts: state.returnedProducts,
      summary: state.summary,
      branchNumbers: state.userInfo.branch.number
    };
    localStorage.setItem("activeOrder", JSON.stringify(activeOrder));
  };

  useEffect(() => {
    const activeOrder = localStorage.getItem("activeOrder");
    if (activeOrder) {
      setShowPopup(true);
    }
  }, []);

  useEffect(() => {
    dispatch({ type: "SET_STATUS_ORDER", payload: 1 });
    if (state.userInfo.role !== "manager" ) {
      let allBranches = getBranches();
      allBranches.then((data) => {
        if (data) {
          setBranches(data.branches);
        }
      });
    }
  }, []);

  useEffect(() => {
    if (state.search != "" || state.displayFilters.length != 0) {
      setActiveFiltersSearch(true);
    } else {
      setActiveFiltersSearch(false);
    }
  }, [state.search, state.displayFilters]);

  useEffect(() => {
    if (state.statusOrder.step === 1 || state.statusOrder.step === 3) {
      dispatch({ type: "SET_ACTIVE_NAVBAR", payload: true });
    } else {
      dispatch({ type: "SET_ACTIVE_NAVBAR", payload: false });
    }
    return () => {
      dispatch({ type: "SET_ACTIVE_NAVBAR", payload: false });
    }
  }, [state.statusOrder]);

  useEffect(() => {
    updateActiveOrder();
  }, [state.orderedProducts, state.returnedProducts, state.summary]);

  return (
    <>
      {showPopup && (
        <div className={newOrder.popupOverlay}>
          <div className={newOrder.popup}>
            <p>יש הזמנה פעילה האם להמשיך?</p>
            <button className={newOrder.continueOrderBtn} onClick={handleContinueOrder}>המשך הזמנה</button>
            <button className={newOrder.newOrderBtn} onClick={handleNewOrder}>הזמנה חדשה</button>
          </div>
        </div>
      )}
      <div className={newOrder.main}>
        <div className={newOrder.header}>
          <div className={newOrder.title}>{state.statusOrder.title}
            {state.userInfo.role !== "manager" && (
              <>
                <span className={newOrder.title}>
                   (עבור - {state.userInfo.branch.length == branches.length ? "כל הסניפים" : state.userInfo.branch.map((branch) => branch.name).join(", ")})
                </span>
              </>
            )}
          </div>
          {state.statusOrder.step === 1 && !activeFiltersSearch && (
            <div className={newOrder.categories}>
              <Categories />
            </div>
          )}
        </div>
        <div className={newOrder.body}>
          <div className={newOrder.products}>
            {state.statusOrder.step === 1 &&
              !activeFiltersSearch &&
              state.displayProductsConfig.map((column, i) => (
                <Column 
                  key={`${state.activeCategory}-${i}`}
                  details={column}
                />
              ))}
            {state.statusOrder.step === 1 && activeFiltersSearch && (
              <OrderFilterProduct key={state.statusOrder.step} />
            )}
            {state.statusOrder.step === 2 &&
              state.orderedProducts.map((product, i) => (
                <ProductOrderSummary key={product.barcode} productData={product} />
              ))}
            {state.statusOrder.step === 3 &&
                <ReturnFilterProduct key={state.statusOrder.step} />
              }
            {state.statusOrder.step === 4 &&
              state.summary.map((provider, i) => (
                <OrderSummary key={`${i}${provider.providerNumber}`} providers={provider} index={i} />
              ))}
          </div>
        </div>
        <div className={newOrder.footer}>
          <div className={newOrder.wizard}>
            <Wizard />
          </div>
        </div>
      </div>
    </>
  );
}

export default DynamicContent;
