import { useState, useEffect } from "react";
import addingProducts from "../../assets/css/admin/AddingProducts.module.css";
import cookie from "js-cookie";
const { REACT_APP_BACKEND_URL } = import.meta.env;
import { useMainContext } from "../../context/mainContext/MainContext";
import { useAdminContext } from "../../context/adminContext/AdminContext";
import apiRequestForForm from "../../services/apiForForm";

import UploadFiles from "./addingProducts/UploadFiles";
import Product from "./addingProducts/Product";
import EditProduct from "./addingProducts/EditProduct";
import AddProduct from "./addingProducts/AddProduct";

function AddingProducts() {
  const { state: stateMain, dispatch: dispatchMain  } = useMainContext();
  const { state, dispatch } = useAdminContext();

  const [showUploadFiles, setShowUploadFiles] = useState(false);

  const [showProducts, setShowProducts] = useState([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState();



// filters
useEffect(() => {
    if(state.displayFilters == []){
      dispatch({ type: "SET_SEARCH", payload: "" });
    }
    if (state.products) {
      let products = state.products;
      let filters = state.displayFilters;
      let showProducts = [];

      if (state.displayFilters.length != []) {
        if (filters["ספקים"] && filters["קבוצת משנה"]) {
          products.filter((product) => {
            filters["ספקים"].map((filter) => {
              filters["קבוצת משנה"].map((filter2) => {
                if (product.providerNumber == filter && product.subGroupNumber == filter2) {
                  showProducts.push(product);
                }
              });
            });
          });
        } else if (filters["ספקים"]) {
          products.filter((product) => {
            filters["ספקים"].map((filter) => {
              if (product.providerNumber == filter) {
                showProducts.push(product);
              }
            });
          });
        } else if (filters["קבוצת משנה"]) {
          products.filter((product) => {
            filters["קבוצת משנה"].map((filter) => {
              if (product.subGroupNumber == filter) {
                showProducts.push(product);
              }
            });
          });
        } else {
          showProducts = [];
        }
        showProducts = [...new Set(showProducts)];
      }
      setShowProducts(showProducts);
    }
  }, [state.displayFilters]);

  // search
  useEffect(() => {
    if (state.searchResults != []) {
      setShowProducts(state.searchResults);
    }
  }, [state.searchResults]);

  useEffect(() => {
    if (state.providers != [] && state.categories != []) {
      dispatch({
        type: "SET_FILTERS",
        payload: [
          {
            title: "ספקים",
            details: state.providers,
          },
          {
            title: "קבוצת משנה",
            details: state.subGroups,
          },
        ],
      });
    }
  }, [state.providers, state.subGroups]);

  // delete product
const deleteProduct = async (productID) => {
    let newShowProducts = showProducts.filter((p) => p._id != productID);
    setShowProducts(newShowProducts);
    dispatch({ type: "DELETE_PRODUCT", payload: productID });

    let res = await apiRequestForForm(`admin/deleteProduct/${productID}`, "DELETE");
    if (!res) {
      dispatchMain({
        type: "SET_SHOW_ERROR",
        payload: { show: true, message: "המוצר לא נמחק" },
      });
    } else {
      dispatchMain({
        type: "SET_SHOW_SUCCESS",
        payload: { show: true, message: "המוצר נמחק בהצלחה" },
      });
    }
  };

  // add product
  const addProduct = async (product) => {
    setShowAddProduct(false);
    let newShowProducts = [...showProducts, product];
    setShowProducts(newShowProducts);
    dispatch({ type: "ADD_PRODUCT", payload: product });

    let res = await apiRequestForForm("admin/addProduct", "POST", product);
    if (!res) {
      dispatchMain({
        type: "SET_SHOW_ERROR",
        payload: { show: true, message: "המוצר לא נשמר" },
      });
    } else {
      dispatchMain({
        type: "SET_SHOW_SUCCESS",
        payload: { show: true, message: "המוצר נשמר בהצלחה" },
      });
    }

  }


  // edit product
  const editProduct = async (product) => {
    setShowEditProduct(product);
  }
  // send edit product
  const sendEditProduct = async (product) => {
    setShowEditProduct(null);
    let newShowProducts = showProducts.map((p) => {
      if (p._id == product._id) return product ;
      return p;
    });
    setShowProducts(newShowProducts);
    dispatch({ type: "UPDATE_PRODUCT", payload: product });

    let res = await apiRequestForForm(`admin/editProduct/${product._id}`, "PUT", product);
    if (!res) {
      dispatchMain({
        type: "SET_SHOW_ERROR",
        payload: { show: true, message: "המוצר לא נשמר" },
      });
    } else {
      dispatchMain({
        type: "SET_SHOW_SUCCESS",
        payload: { show: true, message: "המוצר נשמר בהצלחה" },
      });
    }
  }

  const downloadProducts = async () => {
    dispatchMain({ type: "SET_SHOW_LOADER", payload: true });
    let token = cookie.get("token");
    const response = await fetch(`${REACT_APP_BACKEND_URL}admin/downloadProducts`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      dispatchMain({
        type: "SET_SHOW_ERROR",
        payload: { show: true, message: "ההורדה נכשלה" },
      });
      dispatchMain({ type: "SET_SHOW_LOADER", payload: false });
      return;
    }
    dispatchMain({ type: "SET_SHOW_LOADER", payload: false });
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'מוצרים.xlsx';
    document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
    a.click();    
    a.remove();  //afterwards we remove the element again         
    
  }


  return (
    <>
        <div className={addingProducts.main}>
            <div className={addingProducts.header}>
                <div className={addingProducts.title}>ניהול מוצרים</div>
                <div className={addingProducts.buttons}>
                    <div className={addingProducts.addProduct} onClick={() => setShowAddProduct(true)} >
                        <div className={addingProducts.addProductIcon}></div>
                        <div className={addingProducts.addProductText}>הוספת מוצר בודד</div>
                    </div>
                    <div className={addingProducts.downloadProducts}  onClick={downloadProducts}>
                        <div className={addingProducts.downloadProductsIcon}></div>
                        <div className={addingProducts.downloadProductsText}>הורדת מוצרים לקובץ</div>
                    </div>
                    {!showUploadFiles && 
                      <div className={addingProducts.uploadProducts} onClick={() => setShowUploadFiles(true)}>
                          <div className={addingProducts.uploadProductsIcon}></div>
                          <div className={addingProducts.uploadProductsText}>העלאת מוצרים</div>
                        <div className={addingProducts.arrowIcon}></div>
                      </div>
                    }
                    {showUploadFiles &&
                      <div className={addingProducts.uploadProducts} onClick={() => setShowUploadFiles(false)}>
                          <div className={addingProducts.uploadProductsIcon}></div>
                          <div className={addingProducts.uploadProductsText}>העלאת מוצרים</div>
                        <div className={addingProducts.arrowIcon + " " + addingProducts.arrowIconUp}></div>
                      </div>
                    }
                </div>
            </div>
            {showUploadFiles && <UploadFiles />}
            <div className={addingProducts.body}>
                {showProducts.map((product) => {
                    return <Product key={product._id} product={product} deleteProduct={deleteProduct} editProduct={editProduct} />;
                })}
            </div>
        </div>
        {showEditProduct && <EditProduct product={showEditProduct} cancel={() => setShowEditProduct(null)} save={sendEditProduct} />}
        {showAddProduct && <AddProduct cancel={() => setShowAddProduct(false)} save={addProduct} />}
    </>
  )
}

export default AddingProducts