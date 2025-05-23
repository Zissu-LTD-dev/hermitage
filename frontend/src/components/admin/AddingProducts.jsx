import { useState, useEffect } from "react";
import addingProducts from "../../assets/css/admin/AddingProducts.module.css";
import cookie from "js-cookie";
const { REACT_APP_BACKEND_URL } = import.meta.env;
import { useMainContext } from "../../context/mainContext/MainContext";
import { useAdminContext } from "../../context/adminContext/AdminContext";
import apiRequestForForm from "../../services/apiForForm";
import { useNavigate } from "react-router-dom";

import UploadFiles from "./addingProducts/UploadFiles";
import Product from "./addingProducts/Product";
import EditProduct from "./addingProducts/EditProduct";
import AddProduct from "./addingProducts/AddProduct";

function AddingProducts() {
  const { state: stateMain, dispatch: dispatchMain } = useMainContext();
  const { state, dispatch } = useAdminContext();
  const navigate = useNavigate();

  const [showUploadFiles, setShowUploadFiles] = useState(false);

  const [showProducts, setShowProducts] = useState([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState();
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // filters
  useEffect(() => {
    if (state.displayFilters == []) {
      dispatch({ type: "SET_SEARCH", payload: "" });
    }
    if (state.products) {
      let products = state.products;
      let filters = state.displayFilters;
      let showProducts = [];

      if (state.displayFilters.length != []) {
        setShowUploadFiles(false);
        if (filters["ספקים"] && filters["קבוצת משנה"]) {
          products.filter((product) => {
            filters["ספקים"].map((filter) => {
              filters["קבוצת משנה"].map((filter2) => {
                if (
                  product.providerNumber == filter &&
                  product.subGroupNumber == filter2
                ) {
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
        } else if (filters["מוצרים"]) {
          products.filter((product) => {
            filters["מוצרים"].map((filter) => {
              if (filter) {
                let config = product.branchTypeConfig.length > 0;
                let found = product.branchTypeConfig.find(
                  (config) => config.location.column > 0
                )
                  ? true
                  : false;
                if (found && config) {
                  showProducts.push(product);
                }
              } else if (!filter) {
                let config = product.branchTypeConfig.length == 0;
                let found = product.branchTypeConfig.find(
                  (config) => config.location.column > 0
                )
                  ? true
                  : false;
                if (!found || config) {
                  showProducts.push(product);
                }
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
      setShowUploadFiles(false);
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
          {
            title: "מוצרים",
            details: [
              { name: "פעילים", _id: "active", number: 1 },
              { name: "לא פעילים", _id: "notActive", number: 0 },
            ],
          },
        ],
      });
    }
  }, [state.providers, state.subGroups]);

  useEffect(() => {
    if (showUploadFiles) {
      setShowProducts([]);
      dispatch({ type: "SET_SEARCH", payload: "" });
      dispatch({ type: "SET_FILTERS", payload: [] });
    }
  }, [showUploadFiles]);

  // delete product
  const deleteProduct = async (productID) => {
    let newShowProducts = showProducts.filter((p) => p._id != productID);
    setShowProducts(newShowProducts);
    dispatch({ type: "DELETE_PRODUCT", payload: productID });

    let res = await apiRequestForForm(
      `admin/deleteProduct/${productID}`,
      "DELETE"
    );
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
      product._id = res._id;
      let newShowProducts = [...showProducts, product];
      setShowProducts(newShowProducts);
      dispatch({ type: "ADD_PRODUCT", payload: product });
      setShowAddProduct(false);
    }
  };

  // edit product
  const editProduct = async (product) => {
    setShowEditProduct(product);
  };
  // send edit product
  const sendEditProduct = async (product) => {
    setShowEditProduct(null);
    let newShowProducts = showProducts.map((p) => {
      if (p._id == product._id) return product;
      return p;
    });
    setShowProducts(newShowProducts);
    dispatch({ type: "UPDATE_PRODUCT", payload: product });

    let res = await apiRequestForForm(
      `admin/editProduct/${product._id}`,
      "PUT",
      product
    );
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
  };

  const downloadProducts = async () => {
    dispatchMain({ type: "SET_SHOW_LOADER", payload: true });
    let token = cookie.get("token");
    const response = await fetch(
      `${REACT_APP_BACKEND_URL}admin/downloadProducts`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!response.ok) {
      dispatchMain({
        type: "SET_SHOW_ERROR",
        payload: { show: true, message: "ההורדה נכשלה" },
      });
      dispatchMain({ type: "SET_SHOW_LOADER", payload: false });
      return;
    }
    dispatchMain({ type: "SET_SHOW_LOADER", payload: false });
    let date = new Date();
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `products-${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}.xlsx`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleDuplicate = (product) => {
    const newProduct = {
      ...product,
      barcode: "",
      _id: null,
      branchTypeConfig: product.branchTypeConfig.map((config) => ({
        ...config,
      })),
    };

    setSelectedProduct(newProduct);
    setShowAddDialog(true);
  };

  const handleSave = async (product) => {
    if (product._id) {
      await sendEditProduct(product);
    } else {
      await addProduct(product);
    }
    setShowAddDialog(false);
  };

  return (
    <>
      <div className={addingProducts.main}>
        <div className={addingProducts.header}>
          <div className={addingProducts.title}>ניהול מוצרים</div>
          <div className={addingProducts.buttons}>
            <div
              className={addingProducts.addProduct}
              onClick={() => setShowAddProduct(true)}
            >
              <div className={addingProducts.addProductIcon}></div>
              <div className={addingProducts.addProductText}>
                הוספת מוצר בודד
              </div>
            </div>
            <div
              className={addingProducts.downloadProducts}
              onClick={downloadProducts}
            >
              <div className={addingProducts.downloadProductsIcon}></div>
              <div className={addingProducts.downloadProductsText}>
                הורדת מוצרים לקובץ
              </div>
            </div>
            {!showUploadFiles && (
              <div
                className={addingProducts.uploadProducts}
                onClick={() => setShowUploadFiles(true)}
              >
                <div className={addingProducts.uploadProductsIcon}></div>
                <div className={addingProducts.uploadProductsText}>
                  העלאת מוצרים
                </div>
                <div className={addingProducts.arrowIcon}></div>
              </div>
            )}
            {showUploadFiles && (
              <div
                className={addingProducts.uploadProducts}
                onClick={() => setShowUploadFiles(false)}
              >
                <div className={addingProducts.uploadProductsIcon}></div>
                <div className={addingProducts.uploadProductsText}>
                  העלאת מוצרים
                </div>
                <div
                  className={
                    addingProducts.arrowIcon + " " + addingProducts.arrowIconUp
                  }
                ></div>
              </div>
            )}
          </div>
        </div>
        {showUploadFiles && <UploadFiles />}
        <div className={addingProducts.body}>
          {showProducts.map((product) => {
            return (
              <div key={product._id} className={addingProducts.productRow}>
                <Product
                  product={product}
                  deleteProduct={deleteProduct}
                  editProduct={editProduct}
                  handleDuplicate={handleDuplicate}
                />
              </div>
            );
          })}
        </div>
      </div>
      {showEditProduct && (
        <EditProduct
          product={showEditProduct}
          cancel={() => setShowEditProduct(null)}
          save={sendEditProduct}
        />
      )}
      {showAddProduct && (
        <AddProduct cancel={() => setShowAddProduct(false)} save={addProduct} />
      )}
      {showAddDialog && (
        <AddProduct
          cancel={() => setShowAddDialog(false)}
          save={handleSave}
          product={selectedProduct}
        />
      )}
    </>
  );
}

export default AddingProducts;
