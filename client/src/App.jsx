import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login, Admin, Manager } from "./pages";
import "./App.css";
import { Box } from "@mui/material";
import PrivateRouteAdmin from "./utils/PrivateRouteAdmin.jsx";
import PrivateRouteManager from "./utils/PrivateRouteManager.jsx";
import PrivateRoute from "./utils/PrivateRoutes.jsx";

function App() {
  return (
    <BrowserRouter>
      <Box className="App">
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
                <Manager />
              </PrivateRouteManager>
            }
          ></Route>

          <Route path="/login" element={<Login />} exact />
          <Route  path="*" element={<h1>Not Found 404 👀 </h1>} />
        </Routes>
      </Box>
    </BrowserRouter>
  );
}
export default App;
