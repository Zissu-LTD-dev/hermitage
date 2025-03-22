import { useState, useEffect, useMemo } from "react";
import searchStyle from "../../../assets/css/navbar/Search.module.css";
import { useMainContext } from "../../../context/mainContext/MainContext";

function Search() {
  const { state, dispatch } = useMainContext();
  const [allProducts, setAllProducts] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Create an index for faster searching
  const productIndex = useMemo(() => {
    if (!allProducts.length) return {};

    const index = {};

    allProducts.forEach((product) => {
      if (!product || !product.name || !product.barcode) return;

      // Only include products with valid location
      const isLocationValid =
        product.location &&
        typeof product.location === "object" &&
        Object.keys(product.location).length > 0 &&
        product.location.column > 0;

      if (!isLocationValid) return;

      // Add product name to index (convert to lowercase)
      const nameLower = String(product.name).toLowerCase();
      const words = nameLower.split(/\s+/);

      // Index each word in the product name
      words.forEach((word) => {
        if (!word) return;
        if (!index[word]) index[word] = [];
        if (!index[word].includes(product)) index[word].push(product);
      });

      // Add barcode to index
      const barcode = String(product.barcode);
      if (!index[barcode]) index[barcode] = [];
      if (!index[barcode].includes(product)) index[barcode].push(product);
    });

    return index;
  }, [allProducts]);

  // Handle immediate input changes
  const handleChange = (e) => {
    const value = e.target.value;
    setInputValue(value);

    // Show empty results immediately when clearing search
    if (value === "") {
      dispatch({ type: "SET_SEARCH", payload: "" });
      dispatch({ type: "SET_SEARCH_RESULTS", payload: [] });
      dispatch({ type: "SET_ACTIVE_FILTERS", payload: [] });
    }
  };

  // Debounce the search input
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearch(inputValue);
    }, 200); // 200ms delay for typing

    return () => clearTimeout(timeoutId);
  }, [inputValue]);

  // Process the actual search (with the debounced value)
  useEffect(() => {
    if (debouncedSearch === "") return;

    dispatch({ type: "SET_SEARCH", payload: debouncedSearch });

    const searchTerm = debouncedSearch.trim().toLowerCase();
    if (searchTerm === "") {
      dispatch({ type: "SET_SEARCH_RESULTS", payload: [] });
      return;
    }

    // Use our index for faster searching
    const matchedProducts = new Set();

    // First try exact matches in the index
    if (productIndex[searchTerm]) {
      productIndex[searchTerm].forEach((product) =>
        matchedProducts.add(product)
      );
    }

    // Then try partial matches
    Object.keys(productIndex).forEach((key) => {
      if (key.includes(searchTerm)) {
        productIndex[key].forEach((product) => matchedProducts.add(product));
      }
    });

    // If we have no results yet, do a full scan (as fallback)
    if (matchedProducts.size === 0) {
      allProducts.forEach((product) => {
        const isLocationValid =
          product.location &&
          typeof product.location === "object" &&
          Object.keys(product.location).length > 0 &&
          product.location.column > 0;

        if (!isLocationValid) return;

        const productName = String(product.name || "").toLowerCase();
        const productBarcode = String(product.barcode || "");

        if (
          productName.includes(searchTerm) ||
          productBarcode.includes(searchTerm)
        ) {
          matchedProducts.add(product);
        }
      });
    }

    dispatch({
      type: "SET_SEARCH_RESULTS",
      payload: Array.from(matchedProducts),
    });
    dispatch({ type: "SET_ACTIVE_FILTERS", payload: [] });
  }, [debouncedSearch, productIndex]);

  useEffect(() => {
    setAllProducts(state.allProducts);
  }, [state.allProducts]);

  useEffect(() => {
    setInputValue("");
    dispatch({ type: "SET_SEARCH", payload: "" });
    dispatch({ type: "SET_SEARCH_RESULTS", payload: [] });
  }, [state.statusOrder]);

  return (
    <>
      <div className={searchStyle.search}>
        <input
          type='text'
          placeholder='חיפוש מוצרים'
          value={inputValue}
          onChange={handleChange}
          disabled={!state.activeNavbar ? true : false}
        />
        <div className={searchStyle.icon}></div>
      </div>
    </>
  );
}

export default Search;
