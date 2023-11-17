import { useState } from "react";
import dynamicContent from "../../assets/css/manager/DynamicContent.module.css";
import Categories from "./Categories";
import Wizard from "./Wizard";
import Column from "./Column";  

function DynamicContent() {
    const [title, setTitle] = useState("יצירת הזמנה חדשה")


  return (
    <>
      <div className={dynamicContent.main}>
        <div className={dynamicContent.title}>{title}</div>
        <div className={dynamicContent.categories}> 
            <Categories />
        </div>
        <div className={dynamicContent.products}> 
          <Column />
        </div>
        <div className={dynamicContent.wizard}> 
          <Wizard />
        </div>
      </div>
    </>
  );
}

export default DynamicContent;
