import { useState, useEffect } from "react";
import { useMainContext } from "../../../context/mainContext/MainContext";
import filterProductStyle from "../../../assets/css/manager/newOrder/ReturnFilterProduct.module.css";
import ProductReturn from "./ProductReturn";

function ReturnFilterProduct() {
  const { state, dispatch } = useMainContext();
  const [products, setProducts] = useState([]);
  const [orderProvidersList, setOrderProvidersList] = useState([]);

  useEffect(() => {
    // Get providers from ordered products
    let newOrderProvidersList = state.orderedProducts.map((product) => {
      return product.providerNumber;
    });
    newOrderProvidersList = [...new Set(newOrderProvidersList)];
    setOrderProvidersList(newOrderProvidersList);
  }, [state.orderedProducts]);

  useEffect(() => {
    if (Object.keys(state.displayFilters).length > 0) {
      // Use AND logic between filter categories
      let filteredProducts = state.allProducts.filter((product) => {
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
      {products.length > 0 && (
        <div className={filterProductStyle.main}>
          {products.map((product) => (
            <ProductReturn
              key={product.barcode}
              productData={product}
              open={orderProvidersList.includes(product.providerNumber)}
            />
          ))}
        </div>
      )}
      {!Object.keys(state.displayFilters).length &&
        !state.search &&
        !products.length && (
          <div className={filterProductStyle.main}>
            {state.returnedProducts.map((product) => (
              <ProductReturn
                key={product.barcode}
                productData={product}
                open={orderProvidersList.includes(product.providerNumber)}
              />
            ))}
          </div>
        )}
    </>
  );
}
export default ReturnFilterProduct;
