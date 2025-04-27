import { useState, useEffect } from "react";
import searchStyle from "../../../assets/css/navbar/Search.module.css";
import { useAdminContext } from "../../../context/adminContext/AdminContext";

function Search() {
  const { state, dispatch } = useAdminContext();

  const handleChange = (e) => {
    const searchQuery = e.target.value;

    // Store the search query in state
    dispatch({ type: "SET_SEARCH", payload: searchQuery });

    // If search is cleared and we're in ApprovalsStatus, no need to filter products
    if (searchQuery === "" && state.status === "approvals status") {
      dispatch({ type: "SET_SEARCH_RESULTS", payload: [] });
      return;
    }

    // For product search (in other components)
    if (
      state.status !== "approvals status" &&
      state.products &&
      state.products.length > 0
    ) {
      if (searchQuery !== "") {
        const results = state.products.filter(
          (product) =>
            String(product.name)
              .toLowerCase()
              .includes(String(searchQuery).toLowerCase()) ||
            String(product.barcode)
              .toLowerCase()
              .includes(String(searchQuery).toLowerCase())
        );
        dispatch({ type: "SET_SEARCH_RESULTS", payload: results });
      } else {
        dispatch({ type: "SET_SEARCH_RESULTS", payload: [] });
      }
    }
  };

  // Reset search when component status changes
  useEffect(() => {
    dispatch({ type: "SET_SEARCH", payload: "" });
    dispatch({ type: "SET_SEARCH_RESULTS", payload: [] });
  }, [state.status]);

  return (
    <>
      <div className={searchStyle.search}>
        <input
          type='text'
          placeholder={
            state.status === "approvals status"
              ? "חיפוש הזמנות"
              : "חיפוש מוצרים"
          }
          value={state.search || ""}
          onChange={handleChange}
        />
        <div className={searchStyle.icon}></div>
      </div>
    </>
  );
}

export default Search;
