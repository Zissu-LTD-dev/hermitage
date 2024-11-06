import { useState, useEffect } from "react";
import { useMainContext } from "../../../context/mainContext/MainContext";
import filterProductStyle from "../../../assets/css/manager/newOrder/ReturnFilterProduct.module.css";
import ProductReturn from "./ProductReturn";

function ReturnFilterProduct() {
  const { state, dispatch } = useMainContext();
  const [products, setProducts] = useState([]);
  const [orderProvidersList, setOrderProvidersList] = useState([]);

  const filterProducts = () => {
    let newProducts = [];
    let allProducts = state.allProducts;
    let displayFilters = state.displayFilters;

    for (let i = 0; i < allProducts.length; i++) {
      if (
        displayFilters["קבוצת משנה"] &&
        displayFilters["קבוצת משנה"].includes(allProducts[i]["subGroupNumber"])
      ) {
        newProducts.push(allProducts[i]);
      }
      if (
        displayFilters["ספק"] &&
        displayFilters["ספק"].includes(allProducts[i]["providerNumber"])
      ) {
        if (!newProducts.includes(allProducts[i])) {
          newProducts.push(allProducts[i]);
        }
      }
    }
    setProducts(newProducts);
  };

  const searchProducts = () => {
    setProducts(state.searchResults);
  };

  useEffect(() => {
    let newOrderProvidersList = state.orderedProducts.map((product) => {
      return product.providerNumber;
    });
    newOrderProvidersList = [...new Set(newOrderProvidersList)];
    setOrderProvidersList(newOrderProvidersList);
  }, []);

  useEffect(() => {
    if (state.displayFilters.length != 0) filterProducts();
    if (state.search != "") searchProducts();

    if (state.search == "" && state.displayFilters.length == 0) {
      setProducts([]);
    }
  }, [state.displayFilters, state.search]);

  return (
    <>
      {products.length > 0 && (
        <div className={filterProductStyle.main}>
          {products.map((product) => (
            <ProductReturn key={product.barcode} productData={product} open={orderProvidersList.includes(product.providerNumber)} />
          ))}
        </div>
      )}
      {!state.displayFilters.length && !state.search && !products.length && (
        <div className={filterProductStyle.main}>
          {state.returnedProducts.map((product) => (
            <ProductReturn key={product.barcode} productData={product} open={orderProvidersList.includes(product.providerNumber)} />
          ))}
        </div>
      )}
    </>
  );
}
export default ReturnFilterProduct;
