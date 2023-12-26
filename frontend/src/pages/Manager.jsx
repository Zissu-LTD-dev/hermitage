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


  const getAllProducts = async (branchId) => {
    const data = await apiRequest(`manager/getProducts/${branchId}`);
    if(!data) return false;
    await dispatch({ type: "SET_ALL_PRODUCTS", payload: data.products });
    await dispatch({ type: "SET_DISPLAY_PRODUCTS" });
    return true;
  };

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
      let branchId = JSON.parse(localStorage.getItem("user")).branch.typeNumber;
      let allProducts = getAllProducts(branchId)
      let filters = getFilters();
      Promise.all([allProducts, filters]).then((values) => {
        dispatch({ type: "SET_SHOW_LOADER", payload: false });
        if(values[0] && values[1]){
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
      {state.showError && <ErrorPopup isShow={state.showError.show} message={state.showError.message} />}
      {state.showSuccess && <SuccessPopup isShow={state.showSuccess.show} message={state.showSuccess.message} />}
      {state.showWarning && <WarningPopup isShow={state.showWarning.show} message={state.showWarning.message} />}
      
      <div className={manager.main}>
        <Sidebar branchName={loading ? "" : state.userInfo.branch.name} />
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
