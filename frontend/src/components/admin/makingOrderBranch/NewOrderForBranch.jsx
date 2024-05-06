import { useState, useEffect } from "react";

import manager from "../../../assets/css/manager/Manager.module.css";
import { useMainContext } from "../../../context/mainContext/MainContext";
import apiRequest from "../../../services/api";

import NewOrder from "../../../components/manager/NewOrder";

function NewOrderForBranch() {
    const { state, dispatch } = useMainContext();
    const [loading, setLoading] = useState(true);
  
    const getAllProducts = async () => {
      const data = await apiRequest(`manager/getProducts`);
      if (!data) return false;
      await dispatch({ type: "SET_ALL_PRODUCTS", payload: data.products });
      await dispatch({
        type: "SET_CONFIG_PRODUCTS",
        payload: data.locationProductsConfig,
      });
      return true;
    };
  
    const getCategory = async () => {
      const data = await apiRequest("manager/getCategory");
      if (!data) return false;
      dispatch({ type: "SET_CATEGORY", payload: data.category });
      return true;
    };
  
    const getSubGroups = async () => {
      const data = await apiRequest("manager/getSubGroups");
      if (!data) return false;
      dispatch({ type: "SET_SUB_GROUPS", payload: data.subGroups });
      return true;
    };
  
    const getFilters = async () => {
      const data = await apiRequest("manager/getFilters");
      if (!data) return false;
      dispatch({ type: "SET_FILTERS", payload: data.filters });
      return true;
    };
  
    useEffect(() => {
      dispatch({ type: "SET_SHOW_LOADER", payload: true });
        let allProducts = getAllProducts();
        let category = getCategory();
        let subGroups = getSubGroups();
        let filters = getFilters();
        Promise.all([allProducts, category, subGroups, filters]).then(
          (values) => {
            dispatch({ type: "SET_SHOW_LOADER", payload: false });
            if (values.every((value) => value)) {
              setLoading(false);
              dispatch({
                type: "SET_SHOW_SUCCESS",
                payload: { show: true, message: "הנתונים נטענו בהצלחה" },
              });
            } else {
              dispatch({
                type: "SET_SHOW_ERROR",
                payload: { show: true, message: "אירעה שגיאה בטעינת הנתונים" },
              });
            }
          }
        );
    }, []);
  
    return (
      <>
          {!loading ? (
            <NewOrder />
          ) : (
            <div className={manager.content}>
              <h1 className={manager.update}>טוען נתונים...</h1>
            </div>
          )}
      </>
    );
}

export default NewOrderForBranch