import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

import admin from "../assets/css/admin/Admin.module.css";
import { useOrderContext } from "../context/orderContext/OrderContext";
import cookie from "js-cookie";
const { REACT_APP_BACKEND_URL } = import.meta.env;

import Sidebar from "../components/admin/Sidebar";
import Navbar from "../components/general/Navbar";

import ApprovalsStatus from "../components/admin/ApprovalsStatus";
import BranchManagement from "../components/admin/BranchManagement";

function Admin() {  
  const { state, dispatch } = useOrderContext();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(localStorage.getItem("user")){
      dispatch({ type: "SET_USER_INFO", payload: JSON.parse(localStorage.getItem("user")) });
      setLoading(false);
    }else{
      Navigate("/login");
    }
  }, []);

  
  return (
    <>
    <div className={admin.main} >
      <Sidebar branchName="כמנהל רשת" />
      <Navbar />
      <div className={admin.content}>
        {state.admin.status == "branch management" && <BranchManagement />}
        {state.admin.status == "approvals status" && <ApprovalsStatus />}
        {state.admin.status == "block management" && <h1>block management</h1>}
        {state.admin.status == "documents" && <h1>documents</h1>}
        {state.admin.status == "adding products" && <h1>adding products</h1>}
      </div>
    </div>
    </>
  );
}

export default Admin;
