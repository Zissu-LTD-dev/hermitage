import { useState, useEffect } from "react";
import dynamicContent from "../../assets/css/manager/DynamicContent.module.css";
import { useOrderContext } from "../../context/orderContext/OrderContext";
import Departments from "./Departments";
import Wizard from "./Wizard";
import Column from "./Column";
import ProductOrderSummary from "./ProductOrderSummary";

function DynamicContent() {
  
  const { state, dispatch } = useOrderContext();

  return (
    <>
      <div className={dynamicContent.main}>
        <div className={dynamicContent.title}>{state.status.title}</div>
        <div className={dynamicContent.categories}> 
            <Departments />
        </div>
        <div className={dynamicContent.products}> 
        {state.status.step === 1 && state.displayProducts.map((column, i ) => (
            <Column key={i}  name={column.columnName ? column.columnName : i+1 } products={column.products} />
          ))}
        {state.status.step === 2 && state.orderedProducts.map((product, i ) => (
            <ProductOrderSummary key={i}  productData={product} />
          ))}
        {state.status.step === 3 && state.returnedProducts.map((product, i ) => (
            <Column key={i}  name={product.name ? product.name : i+1 } products={[product]} />
          ))}
          {state.status.step === 4 && <h1>סיכום</h1> }
        </div>
        <div className={dynamicContent.wizard}> 
          <Wizard />
        </div>
      </div>
    </>
  );
}

export default DynamicContent;
