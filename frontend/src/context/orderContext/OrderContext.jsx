import React, { createContext, useReducer, useContext, useEffect } from "react";
import { orderReducer, initialState } from "./orderReducer";

const OrderContext = createContext();

const ProductProvider = ({ children }) => {
  const [state, dispatch] = useReducer(orderReducer, initialState);

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
