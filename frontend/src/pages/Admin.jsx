import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

import admin from "../assets/css/admin/Admin.module.css";
import { useMainContext } from "../context/mainContext/MainContext";
import { useAdminContext } from "../context/adminContext/AdminContext";
import useFetch from "../hooks/useFetch";


import cookie from "js-cookie";
const { REACT_APP_BACKEND_URL } = import.meta.env;

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
    <div className={admin.main} >
      <Sidebar branchName="כמנהל רשת" />
      <Navbar />
      <div className={admin.content}>
        {stateAdmin.status == "branch management" && <BranchManagement />}
        {stateAdmin.status == "approvals status" && <ApprovalsStatus />}
        {stateAdmin.status == "block management" && <BlockManagement />}
        {stateAdmin.status == "documents" && <Documents />}
        {stateAdmin.status == "adding products" && <AddingProducts />}
      </div>
    </div>
    </>
  );
}

export default Admin;
