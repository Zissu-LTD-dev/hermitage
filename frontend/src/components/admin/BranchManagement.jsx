import { useState, useEffect } from "react";
import branchManagement from "../../assets/css/admin/BranchManagement.module.css";
import { useAdminContext } from "../../context/adminContext/AdminContext";

import Provider from "./branchManagement/Provider";
import Branch from "./branchManagement/Branch";

function BranchManagement() {
  const { state, dispatch } = useAdminContext();
  const [active, setActive] = useState("byProvider");
  const [filtersProviders, setFiltersProviders] = useState([]);
  const [showBlocked, setShowBlocked] = useState(false);

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

  useEffect(() => {
    if (state.displayFilters["ספקים"]) {
      setFiltersProviders([]);
      
      state.providers.filter((provider) => {
        state.displayFilters["ספקים"].map((filter) => {
          if (provider.number == filter) {
            setFiltersProviders((filtersProviders) => [
              ...filtersProviders,
              provider,
            ]);
          }
        });
      });
    } else {
      setFiltersProviders([]);
    }
  }, [state.displayFilters]);

  // useEffect(() => {
  //   if (showBlocked) {
  //     setActive("byBranch");
  //   }
  // }, [showBlocked])

  useEffect(() => {
    if( showBlocked && active == "byProvider" ) {
      setShowBlocked(false);
    }
  }, [active])

  return (
    <div className={branchManagement.main}>
      <div className={branchManagement.header}>
        <span>
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
        </span>
        <div 
          className={active == 'byBranch' ? branchManagement.blocked : branchManagement.blocked + " " + branchManagement.blockedByProvider } 
          onClick={() => setShowBlocked(active == 'byBranch' ? !showBlocked : null )}>
            {showBlocked ? "הצג הכול" : "הצג סניפים מוגבלים"}
        </div>
      </div>
      <div className={branchManagement.body}>
        {active == "byProvider" ? (
          <>
            {filtersProviders && filtersProviders.length != 0
              ? filtersProviders.map((provider, i) => {
                  return <Provider providerData={provider} key={i} />;
                })
              : state.providers.map((provider, i) => {
                  return <Provider providerData={provider} key={i} />;
                })}
          </>
        ) : (
          <>
            {state.branches.map((branch, i) => {
              return (
                <Branch
                  branchData={branch}
                  filtersProviders={filtersProviders}
                  showBlocked={showBlocked}
                  key={i}
                />
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

export default BranchManagement;
