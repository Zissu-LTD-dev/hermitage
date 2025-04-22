import React, { createContext, useReducer, useContext, useEffect } from "react";
import { mainReducer, initialState } from "./mainReducer";

const MainContext = createContext();

const MainProvider = ({ children }) => {
  const [state, dispatch] = useReducer(mainReducer, initialState);

  return (
    <MainContext.Provider value={{ state, dispatch }}>
      {children}
    </MainContext.Provider>
  );
};

const useMainContext = () => {
  const context = useContext(MainContext);
  if (!context) {
    throw new Error("useMainContext must be used within a MainProvider");
  }
  return context;
};

export { MainProvider, useMainContext };
