import { useState, useEffect } from "react";
import searchStyle from "../../../assets/css/navbar/Search.module.css";
import { useAdminContext } from "../../../context/adminContext/AdminContext";

function Search() {
  const { state, dispatch } = useAdminContext();
  const [allProducts, setAllProducts] = useState([]);

  const handleChange = (e) => {
    let search = e.target.value;
    dispatch({ type: "SET_SEARCH", payload: search });

    if (search !== "") {
      let results = allProducts.filter(
        (product) =>
          String(product.name)
            .toLowerCase()
            .includes(String(search).toLowerCase()) ||
          String(product.barcode)
            .toLowerCase()
            .includes(String(search).toLowerCase())
      );
      dispatch({ type: "SET_SEARCH_RESULTS", payload: results });
    } else {
      dispatch({ type: "SET_SEARCH_RESULTS", payload: [] });
    }
    dispatch({ type: "SET_ACTIVE_FILTERS", payload: [] });
  };

  useEffect(() => {
    setAllProducts(state.products);
  }, [state.products]);

  useEffect(() => {
    dispatch({ type: "SET_SEARCH", payload: "" });
    dispatch({ type: "SET_SEARCH_RESULTS", payload: [] });
  }, [state.status]);

  return (
    <>
      <div className={searchStyle.search}>
        <input
          type='text'
          placeholder='חיפוש מוצרים'
          value={state.search}
          onChange={handleChange}
        />
        <div className={searchStyle.icon}></div>
      </div>
    </>
  );
}

export default Search;
