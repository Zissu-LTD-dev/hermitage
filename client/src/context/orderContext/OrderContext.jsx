import React, { createContext, useReducer, useContext, useEffect } from "react";
import { orderReducer, initialState } from "./orderReducer";

import cookie from "js-cookie";
const { REACT_APP_BACKEND_URL } = import.meta.env;

const OrderContext = createContext();

const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);

  const getAllProducts = async () => {
    try {
      const res = await fetch(`${REACT_APP_BACKEND_URL}manager/getProducts/1`, {
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
    getAllProducts();
  }, []);

  useEffect(() => {
    dispatch({ type: "SET_DISPLAY_PRODUCTS" });
  }, [state.activeDepartment]);

  return (
    <OrderContext.Provider value={{ state, dispatch }}>
      {children}
    </OrderContext.Provider>
  );
};

const useOrderContext = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("useOrderContext must be used within a ProductProvider");
  }
  return context;
};

export { ProductProvider, useOrderContext };
