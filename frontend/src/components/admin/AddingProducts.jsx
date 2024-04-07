import { useState, useEffect } from "react";
import addingProducts from "../../assets/css/admin/AddingProducts.module.css";
import { useMainContext } from "../../context/mainContext/MainContext";
import { useAdminContext } from "../../context/adminContext/AdminContext";
import apiRequestForForm from "../../services/apiForForm";
import Product from "./addingProducts/Product";
import EditProduct from "./addingProducts/EditProduct";

function AddingProducts() {
  const { state: stateMain, dispatch: dispatchMain  } = useMainContext();
  const { state, dispatch } = useAdminContext();

  const [showProducts, setShowProducts] = useState([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState();

  const [upload, setUpload] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");

  const handleFile = (e) => {
    let types = [   'application/vnd.ms-excel', 
                    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',    
                ]
    if (!types.includes(e.target.files[0].type)) {
        dispatchMain({
        type: "SET_SHOW_ERROR",
        payload: { show: true, message: "excel הקובץ אינו" },
      });
      return;
    }
    setFile(e.target.files[0]);
    setFileName(e.target.files[0].name);
    setUpload(true);
  };

  const handleUpload = async () => {
    dispatchMain({ type: "SET_SHOW_LOADER", payload: true });
    const formData = new FormData();
    formData.append("excelFile", file);

    let res = await apiRequestForForm("admin/uploadExcel", "POST", formData);
    if (!res) {
      dispatchMain({ type: "SET_SHOW_LOADER", payload: false });
      dispatchMain({
        type: "SET_SHOW_ERROR",
        payload: { show: true, message: "הקובץ לא הועלה" },
      });
    }else{
        dispatchMain({ type: "SET_SHOW_LOADER", payload: false });
        dispatchMain({
            type: "SET_SHOW_SUCCESS",
            payload: { show: true, message: "הקובץ הועלה בהצלחה" },
            });
    }

    setUpload(false);
    setFile(null);
    setFileName("");
  };

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


  return (
    <>
        <div className={addingProducts.main}>
            <div className={addingProducts.header}>
                <div className={addingProducts.title}>הוספת מוצרים</div>
                <div className={addingProducts.buttons}>
                    <div className={addingProducts.addProduct} onClick={() => setShowAddProduct(true)} >
                        <div className={addingProducts.addProductIcon}></div>
                        <div className={addingProducts.addProductText}>הוספת מוצר בודד</div>
                    </div>
                    {!upload &&
                        <div className={addingProducts.uploadProducts}>
                            <div className={addingProducts.uploadProductsIcon}></div>
                            <div className={addingProducts.uploadProductsText}>העלאת מוצרים מקובץ אקסל</div>
                            <input
                                className={addingProducts.inputFile}
                                type="file"
                                onChange={handleFile}
                                />
                        </div>
                    }
                    {upload &&
                        <div className={addingProducts.uploadProducts} onClick={handleUpload}>
                            <div className={addingProducts.uploadProductsIcon}></div>
                            <div className={addingProducts.uploadProductsText}>שלח קובץ : {fileName}</div>
                        </div>
                    }
                </div>
            </div>
            <div className={addingProducts.body}>
                {showProducts.map((product) => {
                    return <Product key={product._id} product={product} deleteProduct={deleteProduct} editProduct={editProduct} />;
                })}
            </div>
        </div>
        {showEditProduct && <EditProduct product={showEditProduct} cancel={() => setShowEditProduct(null)} save={sendEditProduct} />}
    </>
  )
}

export default AddingProducts