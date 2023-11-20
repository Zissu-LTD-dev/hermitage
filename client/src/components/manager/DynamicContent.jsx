import { useState, useEffect } from "react";
import dynamicContent from "../../assets/css/manager/DynamicContent.module.css";
import { useOrderContext } from "../../context/orderContext/OrderContext";
import Departments from "./Departments";
import Wizard from "./Wizard";
import Column from "./Column";  

function DynamicContent() {
  
  const { state, dispatch } = useOrderContext();
  const [title, setTitle] = useState("יצירת הזמנה חדשה")


  return (
    <>
      <div className={dynamicContent.main}>
        <div className={dynamicContent.title}>{title}</div>
        <div className={dynamicContent.categories}> 
            <Departments />
        </div>
        <div className={dynamicContent.products}> 
          {state.displayProducts.map((column, i ) => (
            <Column key={i}  name={column.columnName ? column.columnName : i+1 } products={column.products} />
          ))}
        </div>
        <div className={dynamicContent.wizard}> 
          <Wizard />
        </div>
      </div>
    </>
  );
}

export default DynamicContent;
