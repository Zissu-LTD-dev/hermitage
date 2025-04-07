import { useState, useEffect } from "react";
import { useMainContext } from "../../../context/mainContext/MainContext";
import filterProductStyle from "../../../assets/css/manager/newOrder/OrderFilterProduct.module.css";
import ProductOrder from "./ProductOrder";

function OrderFilterProduct() {
  const { state, dispatch } = useMainContext();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Use AND logic between filter categories
    if (Object.keys(state.displayFilters).length > 0) {
      let filteredProducts = state.allProducts.filter((product) => {
        // Skip products without valid location
        const isLocationValid =
          product.location &&
          typeof product.location === "object" &&
          Object.keys(product.location).length > 0;

        if (!isLocationValid || product.location.column == 0) return false;

        // Check each filter category - product must match ALL categories (AND logic)
        for (const category in state.displayFilters) {
          const filterValues = state.displayFilters[category];

          // Skip empty filter arrays
          if (!filterValues || filterValues.length === 0) continue;

          // Check if product matches any value in this category
          const matchesCategory = filterValues.some((value) => {
            if (category === "קבוצת משנה") {
              return product.subGroupNumber === value;
            } else if (category === "ספק") {
              return product.providerNumber === value;
            }
            return false;
          });

          // If product doesn't match this category, exclude it
          if (!matchesCategory) return false;
        }

        // Product passed all filter categories
        return true;
      });

      setProducts(filteredProducts);
    } else if (state.search !== "") {
      setProducts(state.searchResults);
    } else {
      setProducts([]);
    }
  }, [state.displayFilters, state.search, state.allProducts]);

  return (
    <>
      <div className={filterProductStyle.main}>
        {products.map((product, i) => (
          <div className={filterProductStyle.product} key={i}>
            <ProductOrder key={product.barcode} productData={product} />
          </div>
        ))}
      </div>
    </>
  );
}

export default OrderFilterProduct;
