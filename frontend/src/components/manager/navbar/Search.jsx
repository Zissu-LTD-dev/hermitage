import { useState, useEffect } from "react";
import searchStyle from "../../../assets/css/navbar/Search.module.css";
import { useMainContext } from "../../../context/mainContext/MainContext";

function Search() {
  const { state, dispatch } = useMainContext();
  const [allProducts, setAllProducts] = useState([]);
  

  const handleChange = (e) => {
    let search = e.target.value;
    dispatch({ type: "SET_SEARCH", payload: search });

    if (search !== "") {
      let results = allProducts.filter((product) => {
        const isLocationValid = product.location && 
                                typeof product.location === 'object' && 
                                Object.keys(product.location).length > 0;
      
        return (
          isLocationValid &&
          product.location.column > 0 &&
          (String(product.name).startsWith(String(search)) ||
           String(product.barcode).startsWith(search))
        );
      });
      dispatch({ type: "SET_SEARCH_RESULTS", payload: results });
    } else {
      dispatch({ type: "SET_SEARCH_RESULTS", payload: [] });
    }
    dispatch({ type: "SET_ACTIVE_FILTERS", payload: [] });
  };

  

  useEffect(() => {
    setAllProducts(state.allProducts);
  }, [state.allProducts]);

  useEffect(() => {
    dispatch({ type: "SET_SEARCH", payload: "" });   
    dispatch({ type: "SET_SEARCH_RESULTS", payload: [] });
  }, [state.statusOrder]);

  return (
    <>
      <div className={searchStyle.search}>
        <input
          type="text"
          placeholder="חיפוש מוצרים"
          value={state.search}
          onChange={handleChange}
          disabled={!state.activeNavbar ? true : false}
        />
        <div className={searchStyle.icon}></div>
      </div>
    </>
  );
}

export default Search;
