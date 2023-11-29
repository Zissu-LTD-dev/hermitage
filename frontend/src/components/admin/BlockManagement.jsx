import { useState } from "react";
import blockManagement from "../../assets/css/admin/BlockManagement.module.css";
import { useOrderContext } from "../../context/orderContext/OrderContext";
import Product from "./blockManagement/Product";

function BlockManagement() {
  const { state, dispatch } = useOrderContext();

  return (
    <>
      <div className={blockManagement.main}>
        <div className={blockManagement.header}>
          <span>
            <div className={blockManagement.title}>ניהול חסומים</div>
            <div className={blockManagement.providerName}>ספק</div>
          </span>
          <div className={blockManagement.headerButtons}>
            הצג את כל הפריטים החסומים
          </div>
        </div>
        <div className={blockManagement.body}>
            <Product block={false} />
            <Product block={true} />
            <Product block={false} />
            <Product block={true} />
            <Product block={false} />
            <Product block={false} />
            <Product block={true} />
            <Product block={false} />
            <Product block={false} />
            <Product block={false} />
            <Product block={true} />
            <Product block={true} />
            <Product block={true} />
            <Product block={true} />

        </div>
        <div className={blockManagement.footer}>
          {/* select all */}
          <div className={blockManagement.selectAll}>
            <input type="checkbox" />
            <div>בחר הכל</div>
          </div>
          {/* buttons */}
          <div className={blockManagement.buttons}>
            {/* חסום פריטים מסומנים */}
            <div className={blockManagement.blockSelected}>
              <div className={blockManagement.blockSelectedIcon}></div>
              <div>חסום פריטים מסומנים</div>
            </div>
            {/* הוצאה מחסום של פריטים מסומנים */}
            <div className={blockManagement.unblockSelected}>
              הוצאה מחסום של פריטים מסומנים
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default BlockManagement;
