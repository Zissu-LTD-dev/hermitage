import {createContext, useReducer, useContext, useEffect } from "react";
import { adminReducer, initialState } from "./adminReducer";

const AdminContext = createContext();

const AdminProvider = ({ children }) => {
  const [state, dispatch] = useReducer(adminReducer, initialState);
    return (
        <AdminContext.Provider value={{ state, dispatch }}>
            {children}
        </AdminContext.Provider>
    );

}

const useAdminContext = () => {
    const context = useContext(AdminContext);
    if (!context) {
        throw new Error("useAdminContext must be used within a AdminProvider");
    }
    return context;
};

export { AdminProvider, useAdminContext };
