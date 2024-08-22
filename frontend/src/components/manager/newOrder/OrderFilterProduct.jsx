import { useState, useEffect } from "react";
import { useMainContext } from "../../../context/mainContext/MainContext";
import filterProductStyle from "../../../assets/css/manager/newOrder/OrderFilterProduct.module.css";
import ProductOrder from "./ProductOrder";

function OrderFilterProduct() {
  const { state, dispatch } = useMainContext();
  const [products, setProducts] = useState([]);

  const filterProducts = () => {
    let newProducts = [];
    let allProducts = state.allProducts;
    let displayFilters = state.displayFilters;

    for (let i = 0; i < allProducts.length; i++) {
      const isLocationValid = allProducts[i].location && 
                              typeof allProducts[i].location === 'object' && 
                              Object.keys(allProducts[i].location).length > 0;

      if (!isLocationValid || allProducts[i].location.column == 0 ) continue;
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
    if (state.displayFilters.length != 0) filterProducts();
    if (state.search != '' ) searchProducts();
  }, [state.displayFilters, state.search]);


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
