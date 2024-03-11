import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

import manager from "../assets/css/manager/Manager.module.css";
import { useMainContext } from "../context/mainContext/MainContext";
import apiRequest from "../services/api";

import { ErrorPopup, SuccessPopup, WarningPopup, LoaderPopup } from "../components/popups";

import Navbar from "../components/manager/navbar/Navbar";
import NewOrder from "../components/manager/NewOrder";
import PendingOrders from "../components/manager/PendingOrders";
import Documents from "../components/manager/Documents";

import Sidebar from "../components/manager/Sidebar";

function Manager() {
  const { state, dispatch } = useMainContext();
  const [loading, setLoading] = useState(true);


  const getAllProducts = async () => {
    const data = await apiRequest(`manager/getProducts`);
    if(!data) return false;
    await dispatch({ type: "SET_ALL_PRODUCTS", payload: data.products });
    await dispatch({ type: "SET_CONFIG_PRODUCTS", payload: data.locationProductsConfig });
    return true;
  };

  const getCategory = async () => {
    const data = await apiRequest("manager/getCategory");
    if(!data) return false;
    dispatch({ type: "SET_CATEGORY", payload: data.category });
    return true;
  }

  const getSubGroups = async () => {
    const data = await apiRequest("manager/getSubGroups");
    if(!data) return false;
    dispatch({ type: "SET_SUB_GROUPS", payload: data.subGroups });
    return true;
  }

  const getFilters = async () => {
    const data = await apiRequest("manager/getFilters");
    if(!data) return false;
    dispatch({ type: "SET_FILTERS", payload: data.filters });
    return true;
  };

  useEffect(() => {
    dispatch({ type: "SET_SHOW_LOADER", payload: true });
    if(localStorage.getItem("user")){
      dispatch({ type: "SET_USER_INFO", payload: JSON.parse(localStorage.getItem("user")) });
      // let branchId = JSON.parse(localStorage.getItem("user")).branch.branchTypeNumber ;
      let allProducts = getAllProducts()
      let category = getCategory();
      let subGroups = getSubGroups();
      let filters = getFilters();
      Promise.all([allProducts, category, subGroups, filters]).then((values) => {
        dispatch({ type: "SET_SHOW_LOADER", payload: false });
        if(values.every((value) => value)){
          setLoading(false);
          dispatch({ type: "SET_SHOW_SUCCESS", payload: { show: true, message: "הנתונים נטענו בהצלחה" } });
        }else{
          dispatch({ type: "SET_SHOW_ERROR", payload: { show: true, message: "אירעה שגיאה בטעינת הנתונים" } });
        }
      });
    }else{
      Navigate("/");
    }
  }, []);

  return (
    <>
      {state.showLoader && <LoaderPopup isShow={state.showLoader }/>}
      {state.showError.show && <ErrorPopup isShow={state.showError.show} message={state.showError.message} />}
      {state.showSuccess.show && <SuccessPopup isShow={state.showSuccess.show} message={state.showSuccess.message} />}
      {state.showWarning.show && <WarningPopup isShow={state.showWarning.show} message={state.showWarning.message} />}
      
      <div className={manager.main}>
        <Sidebar />
        <Navbar />
        <div className={manager.content}>
          {state.status == "new order"  && <NewOrder /> }
          {state.status == "pending orders" && <PendingOrders />}
          {state.status == "documents" && <Documents />}
        </div>
      </div>
    </>
  );
}

export default Manager;
