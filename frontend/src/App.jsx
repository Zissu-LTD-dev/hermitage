import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login, Admin, Manager } from "./pages";
import "./App.css";
import PrivateRouteAdmin from "./utils/PrivateRouteAdmin.jsx";
import PrivateRouteManager from "./utils/PrivateRouteManager.jsx";
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
            path="/manager"
            element={
              <PrivateRouteManager>
                  <Manager />
              </PrivateRouteManager>
            }
          ></Route>

          <Route path="/" element={
            <PrivateRoute>
              <Login />
            </PrivateRoute>
          } exact />
          <Route path="*" element={<h1>Not Found page - 404 👀 </h1>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
