import { useState, useEffect } from "react";
import branchManagement from "../../assets/css/admin/BranchManagement.module.css";
import { useAdminContext } from "../../context/adminContext/AdminContext";
import useFetch from "../../hooks/useFetch";

import Provider from "./branchManagement/Provider";
import Branch from "./branchManagement/Branch";

function BranchManagement() {
  const { state, dispatch } = useAdminContext();
  const [active, setActive] = useState("byProvider");
  const [filtersProviders, setFiltersProviders] = useState([]);

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
