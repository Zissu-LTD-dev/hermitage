import { useState } from "react";
import branchManagement from "../../assets/css/admin/BranchManagement.module.css";
import { useOrderContext } from "../../context/orderContext/OrderContext";

import Provider from "./branchManagement/Provider";
import Branch from "./branchManagement/Branch";

function BranchManagement() {
  const { state, dispatch } = useOrderContext();
  const [active, setActive] = useState("byProvider");

  return (
    <div className={branchManagement.main}>
      <div className={branchManagement.header}>
        <div className={branchManagement.title}>ניהול סניפים</div>
        <div className={branchManagement.headerButtons}>
          <div
            className={branchManagement.byProvider}
            onClick={() => setActive("byProvider")}
          >
            לפי ספק
            {active == "byProvider" && (
              <div className={branchManagement.byProviderActive}></div>
            )}
          </div>
          <div
            className={branchManagement.byBranch}
            onClick={() => setActive("byBranch")}
          >
            לפי סניף
            {active == "byBranch" && (
              <div className={branchManagement.byBranchActive}></div>
            )}
          </div>
        </div>
      </div>
      <div className={branchManagement.body}>
        {active == "byProvider" ? (
          <>
            <Provider />
            <Provider />
            <Provider />
            <Provider />
          </>
        ) : (
          <>
            <Branch />
            <Branch />
            <Branch />
            <Branch />
            <Branch />
            <Branch />
          </>
        )}
      </div>
    </div>
  );
}

export default BranchManagement;
