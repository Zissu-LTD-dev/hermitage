import { useState, useEffect } from "react";
import newOrder from "../../assets/css/manager/NewOrder.module.css";
import { useOrderContext } from "../../context/orderContext/OrderContext";
import Departments from "./newOrder/Departments";
import Wizard from "./newOrder/Wizard";
import Column from "./newOrder/Column";
import ProductOrderSummary from "./newOrder/ProductOrderSummary";
import OrderSummary from "./newOrder/OrderSummary";

function DynamicContent() {
  const { state, dispatch } = useOrderContext();

  useEffect(() => {
    dispatch({ type: "SET_STATUS_ORDER", payload: 1 });
  }, []);

  return (
    <>
      <div className={newOrder.main}>
        <div className={newOrder.header}>
          <div className={newOrder.title}>{state.statusOrder.title}</div>
          {state.statusOrder.step === 1 || state.statusOrder.step === 3  ? (
            <div className={newOrder.categories}>
              <Departments />
            </div>
          ): null }  
        </div>
        <div className={newOrder.body}>
          <div className={newOrder.products}>
            {state.statusOrder.step === 1 &&
              state.displayProducts.map((column, i) => (
                <Column
                  key={i}
                  isOrder={true}
                  name={column.columnName ? column.columnName : i + 1}
                  products={column.products}
                />
              ))}
            {state.statusOrder.step === 2 &&
              state.orderedProducts.map((product, i) => (
                <ProductOrderSummary key={i} productData={product} />
              ))}
            {state.statusOrder.step === 3 &&
              state.displayProducts.map((column, i) => (
                <Column
                  key={i}
                  isOrder={false}
                  name={column.columnName ? column.columnName : i + 1}
                  products={column.products}
                />
              ))}
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
