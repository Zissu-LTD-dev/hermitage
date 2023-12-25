import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

import manager from "../assets/css/manager/Manager.module.css";
import { useMainContext } from "../context/mainContext/MainContext";
import apiRequest from "../services/api";

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
    await dispatch({ type: "SET_ALL_PRODUCTS", payload: data.products });
    await dispatch({ type: "SET_DISPLAY_PRODUCTS" });
  };

  useEffect(() => {
    if(localStorage.getItem("user")){
      dispatch({ type: "SET_USER_INFO", payload: JSON.parse(localStorage.getItem("user")) });
      let branchId = JSON.parse(localStorage.getItem("user")).branch.typeNumber;
      getAllProducts(branchId)
      setLoading(false);
    }else{
      Navigate("/");
    }
  }, []);

  return (
    <>
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
