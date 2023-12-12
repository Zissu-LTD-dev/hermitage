import { useState, useEffect } from "react";
import searchStyle from "../../../assets/css/navbar/Search.module.css";
import { useOrderContext } from "../../../context/orderContext/OrderContext";

function Search() {
  const { state, dispatch } = useOrderContext();
  const [allProducts, setAllProducts] = useState([]);
  

  const handleChange = (e) => {
    let search = e.target.value;
    dispatch({ type: "SET_SEARCH", payload: search });

    if (search !== "") {
      let results = allProducts.filter(
        (product) =>
          String(product.name).startsWith(String(search)) ||
          String(product.barcode).startsWith(search)
      );
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
        />
        <div className={searchStyle.icon}></div>
      </div>
    </>
  );
}

export default Search;
