import { useState, useEffect } from "react";
import branchManagement from "../../assets/css/admin/BranchManagement.module.css";
import { useAdminContext } from "../../context/adminContext/AdminContext";
import useFetch from "../../hooks/useFetch";

import Provider from "./branchManagement/Provider";
import Branch from "./branchManagement/Branch";

function BranchManagement() {
  const { state, dispatch } = useAdminContext();
  const [active, setActive] = useState("byProvider");

  useEffect(() => {
    if (state.providers) {
      dispatch({
        type: "SET_FILTERS",
        payload: [
          {
            title: "ספקים",
            details: state.providers,
          },
        ],
      });
    }
  }, [state.providers]);

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
            {state.providers.map((provider, i) => {
              return <Provider providerData={provider} key={i} />; 
            })}
          </>
        ) : (
          <>
            {state.branches.map((branch, i) => {
              return <Branch branchData={branch} key={i} />;
            })}
          </>
        )}
      </div>
    </div>
  );
}

export default BranchManagement;
