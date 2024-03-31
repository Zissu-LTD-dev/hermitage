import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

import admin from "../assets/css/admin/Admin.module.css";
import { useMainContext } from "../context/mainContext/MainContext";
import { useAdminContext } from "../context/adminContext/AdminContext";
import useFetch from "../hooks/useFetch";

import { ErrorPopup, SuccessPopup, WarningPopup, LoaderPopup } from "../components/popups";

import Sidebar from "../components/admin/Sidebar";
import Navbar from "../components/admin/navbar/Navbar";

import BranchManagement from "../components/admin/BranchManagement";
import ApprovalsStatus from "../components/admin/ApprovalsStatus";
import BlockManagement from "../components/admin/BlockManagement";
import Documents from "../components/admin/Documents";
import AddingProducts from "../components/admin/AddingProducts";

function Admin() {  
  const { state, dispatch } = useMainContext();
  const { state: stateAdmin, dispatch: dispatchAdmin } = useAdminContext();
  const { data: dataInitialData, loading: loadingInitialData } = useFetch("admin/initialData");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(localStorage.getItem("user")){
      dispatch({ type: "SET_USER_INFO", payload: JSON.parse(localStorage.getItem("user")) });
      setLoading(false);
    }else{
      Navigate("/");
    }
  }, []);

  useEffect(() => {
    if(dataInitialData){
      dispatchAdmin({ type: "SET_INITIAL_DATA", payload: dataInitialData });
    }
  }, [loadingInitialData]);

  
  return (
    <>
      {state.showLoader && <LoaderPopup isShow={state.showLoader }/>}
      {state.showError.show && <ErrorPopup isShow={state.showError.show} message={state.showError.message} />}
      {state.showSuccess.show && <SuccessPopup isShow={state.showSuccess.show} message={state.showSuccess.message} />}
      {state.showWarning.show && <WarningPopup isShow={state.showWarning.show} message={state.showWarning.message} />}
      
      <div className={admin.main} >
        <Sidebar branchName="מנהל רשת" />
        <Navbar />
        <div className={admin.content}>
          {stateAdmin.status == "branch management" && <BranchManagement />}
          {stateAdmin.status == "approvals status" && <ApprovalsStatus />}
          {stateAdmin.status == "block management" && <BlockManagement />}
          {stateAdmin.status == "documents" && <Documents />}
          {stateAdmin.status == "adding products" && <AddingProducts />}
          {stateAdmin.status == "general management" && <h1>general management</h1>}
        </div>
      </div>
    </>
  );
}

export default Admin;
