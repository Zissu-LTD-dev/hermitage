import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

import manager from "../assets/css/manager/Manager.module.css";
import { useOrderContext } from "../context/orderContext/OrderContext";
import cookie from "js-cookie";
const { REACT_APP_BACKEND_URL } = import.meta.env;

import NewOrder from "../components/manager/NewOrder";
import PendingOrders from "../components/manager/PendingOrders";
import Document from "../components/manager/Document";

import Sidebar from "../components/manager/Sidebar";
import Navbar from "../components/general/Navbar";

function Manager() {
  const { state, dispatch } = useOrderContext();
  const [loading, setLoading] = useState(true);


  const getAllProducts = async (branchId) => {
    try {
      const res = await fetch(`${REACT_APP_BACKEND_URL}manager/getProducts/${branchId}`, {
        headers: {
          authorization : `Bearer ${cookie.get("token")}`,
        },
      });
      const data = await res.json();
      console.log(data);

      await dispatch({ type: "SET_ALL_PRODUCTS", payload: data.products });
      await dispatch({ type: "SET_DISPLAY_PRODUCTS" });
    } catch (error) {
      console.log(error);
    }
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
          {state.status == "documents" && <Document />}
        </div>
      </div>
    </>
  );
}

export default Manager;
