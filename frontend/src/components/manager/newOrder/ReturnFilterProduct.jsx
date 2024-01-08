import { useState, useEffect } from "react";
import { useMainContext } from "../../../context/mainContext/MainContext";
import filterProductStyle from "../../../assets/css/manager/newOrder/ReturnFilterProduct.module.css";
import ProductReturn from "./ProductReturn";

function ReturnFilterProduct() {
    const { state, dispatch } = useMainContext();
    const [products, setProducts] = useState([]);
  
    const filterProducts = () => {
      let newProducts = [];
      let allProducts = state.allProducts;
      let displayFilters = state.displayFilters;
  
      for (let i = 0; i < allProducts.length; i++) {
        if (
          displayFilters["קבוצת משנה"] &&
          displayFilters["קבוצת משנה"].includes(allProducts[i]["category"])
        ) {
          newProducts.push(allProducts[i]);
        }
        if (
          displayFilters["ספק"] &&
          displayFilters["ספק"].includes(allProducts[i]["provider"])
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

      if(state.search == '' && state.displayFilters.length == 0) {
        setProducts([]);
      }
    }, [state.displayFilters, state.search]);
  
  
    return (
      <>
        <div className={filterProductStyle.main}>
          {products.map((product, i) => (
            <div className={filterProductStyle.product}>
                <ProductReturn key={i} productData={product} />
            </div>
          ))}
        </div>
      </>
    );
  }
export default ReturnFilterProduct