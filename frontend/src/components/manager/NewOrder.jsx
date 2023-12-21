import { useState, useEffect } from "react";
import newOrder from "../../assets/css/manager/NewOrder.module.css";
import { useOrderContext } from "../../context/orderContext/OrderContext";

import cookie from "js-cookie";
const { REACT_APP_BACKEND_URL } = import.meta.env;

import Departments from "./newOrder/Departments";
import Wizard from "./newOrder/Wizard";
import Column from "./newOrder/Column";
import ProductOrderSummary from "./newOrder/ProductOrderSummary";
import OrderSummary from "./newOrder/OrderSummary";
import OrderFilterProduct from "./newOrder/OrderFilterProduct";
import ReturnFilterProduct from "./newOrder/ReturnFilterProduct";

function DynamicContent() {
  const { state, dispatch } = useOrderContext();
  const [activeFiltersSearch, setActiveFiltersSearch] = useState(false);

  const getFilters = async () => {
    try {
      const res = await fetch(`${REACT_APP_BACKEND_URL}manager/getFilters`, {
        headers: {
          authorization: `Bearer ${cookie.get("token")}`,
        },
      });
      const data = await res.json();
      console.log(data);

      dispatch({ type: "SET_FILTERS", payload: data.filters });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    dispatch({ type: "SET_STATUS_ORDER", payload: 1 });
    getFilters();
  }, []);

  useEffect(() => {
    console.log(state.displayFilters.length);
    if (state.search != "" || state.displayFilters.length != 0) {
      setActiveFiltersSearch(true);
    } else {
      setActiveFiltersSearch(false);
    }
  }, [state.search, state.displayFilters]);

  return (
    <>
      <div className={newOrder.main}>
        <div className={newOrder.header}>
          <div className={newOrder.title}>{state.statusOrder.title}</div>
          {state.statusOrder.step === 1 && !activeFiltersSearch && (
            <div className={newOrder.categories}>
              <Departments />
            </div>
          )}
        </div>
        <div className={newOrder.body}>
          <div className={newOrder.products}>
            {state.statusOrder.step === 1 &&
              !activeFiltersSearch &&
              state.displayProducts.map((column, i) => (
                <Column
                  key={i}
                  name={column.columnName ? column.columnName : i + 1}
                  products={column.products}
                />
              ))}
            {state.statusOrder.step === 1 && activeFiltersSearch && (
              <OrderFilterProduct />
            )}


            {state.statusOrder.step === 2 &&
              state.orderedProducts.map((product, i) => (
                <ProductOrderSummary key={i} productData={product} />
              ))}


            {state.statusOrder.step === 3 &&
                <ReturnFilterProduct />
              }


            {state.statusOrder.step === 4 &&
              state.summary.map((provider, i) => (
                <OrderSummary key={i} providers={provider} />
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
