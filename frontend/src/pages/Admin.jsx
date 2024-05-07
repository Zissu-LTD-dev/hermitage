import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

import admin from "../assets/css/admin/Admin.module.css";
import { useMainContext } from "../context/mainContext/MainContext";
import { useAdminContext } from "../context/adminContext/AdminContext";
import useFetch from "../hooks/useFetch";

import { ErrorPopup, SuccessPopup, WarningPopup, LoaderPopup } from "../components/popups";

import Sidebar from "../components/admin/Sidebar";
import NavbarAdmin from "../components/admin/navbar/NavbarAdmin";
import Navbar from "../components/manager/navbar/Navbar";

import MakingOrderBranch from "../components/admin/MakingOrderBranch";
import BranchManagement from "../components/admin/BranchManagement";
import ApprovalsStatus from "../components/admin/ApprovalsStatus";
import BlockManagement from "../components/admin/BlockManagement";
import Documents from "../components/admin/Documents";
import Message from "../components/admin/Message";
import AddingProducts from "../components/admin/AddingProducts";
import GeneralManagement from "../components/admin/GeneralManagement";

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
        {stateAdmin.status != "order execution" &&<NavbarAdmin />}
        {stateAdmin.status == "order execution" && <Navbar />}
        <div className={admin.content}>
          {stateAdmin.status == "order execution" && <MakingOrderBranch />}
          {stateAdmin.status == "approvals status" && <ApprovalsStatus />}
          {stateAdmin.status == "branch management" && <BranchManagement />}
          {stateAdmin.status == "block management" && <BlockManagement />}
          {stateAdmin.status == "adding products" && <AddingProducts />}
          {stateAdmin.status == "documents" && <Documents />}
          {stateAdmin.status == "message" && <Message />}
          {stateAdmin.status == "general management" && <GeneralManagement />}
        </div>
      </div>
    </>
  );
}

export default Admin;
