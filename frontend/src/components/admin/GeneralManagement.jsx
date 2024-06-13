import { useState, useEffect } from "react";
import generalManagement from "../../assets/css/admin/GeneralManagement.module.css";

import Users from "./generalManagement/Users";
import Branches from "./generalManagement/Branches";
import Providers from "./generalManagement/Providers";
import SubGroup from "./generalManagement/SubGroup";
import Categories from "./generalManagement/Categories";

function GeneralManagement() {
    const [status, setStatus] = useState();
  return (
    <>
      <div className={generalManagement.main}>
        <div className={generalManagement.header}>
          <div className={generalManagement.title}>ניהול כללי</div>
          <div className={generalManagement.headerButtons}>
            <div className={generalManagement.headerButton}
                onClick={() => setStatus("users")}
            >משתמשים</div>
            <div className={generalManagement.headerButton}
                onClick={() => setStatus("branches")}
            >סניפים</div>
            <div className={generalManagement.headerButton}
                onClick={() => setStatus("providers")}
            >ספקים</div>
            <div className={generalManagement.headerButton}
                onClick={() => setStatus("subgroup")}
            >קבוצות משנה</div>
            {/* categories */}
            <div className={generalManagement.headerButton}
                onClick={() => setStatus("categories")}
            >קטגוריות</div>
          </div>
        </div>
        <div className={generalManagement.body}>
            {status == "users" && <Users />}
            {status == "branches" && <Branches />}
            {status == "providers" && <Providers />}
            {status == "subgroup" && <SubGroup />}
            {status == "categories" && <Categories />}
        </div>
      </div>
    </>
  );
}

export default GeneralManagement;
