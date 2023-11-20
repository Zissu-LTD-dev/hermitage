import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login, Admin, Manager } from "./pages";
import "./App.css";
import PrivateRouteAdmin from "./utils/PrivateRouteAdmin.jsx";
import PrivateRouteManager from "./utils/PrivateRouteManager.jsx";

import { ProductProvider } from "./context/orderContext/OrderContext.jsx";

import PrivateRoute from "./utils/PrivateRoutes.jsx";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route
            path="/admin"
            element={
              <PrivateRouteAdmin>
                <Admin />
              </PrivateRouteAdmin>
            }
          ></Route>

          <Route
            path="/"
            element={
              <PrivateRouteManager>
                <ProductProvider>
                  <Manager />
                </ProductProvider>
              </PrivateRouteManager>
            }
          ></Route>

          <Route path="/login" element={<Login />} exact />
          <Route path="*" element={<h1>Not Found page - 404 👀 </h1>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
