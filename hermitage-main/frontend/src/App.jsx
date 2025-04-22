import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react"; // This was missing
import { Login, Admin, Manager } from "./pages";
import "./App.css";
import PrivateRouteAdmin from "./utils/PrivateRouteAdmin.jsx";
import PrivateRouteManager from "./utils/PrivateRouteManager.jsx";
import PrivateRoute from "./utils/PrivateRoutes.jsx";

import { AdminProvider } from "./context/adminContext/AdminContext.jsx";

// Disable wheel scrolling on number inputs globally
export function disableNumberInputScrolling() {
  // Function to prevent wheel events on number inputs
  const preventNumberInputScroll = (event) => {
    // Check if the target is a number input
    if (event.target.type === "number") {
      // Stop the event from bubbling up
      event.stopPropagation();
      // Prevent default scroll behavior
      event.preventDefault();
      // Keep the input focused (optional)
      event.target.blur();
      // Return false to prevent default in older browsers
      return false;
    }
  };

  // Add listeners for various scroll events
  document.addEventListener("wheel", preventNumberInputScroll, {
    passive: false,
    capture: true,
  });
  document.addEventListener("mousewheel", preventNumberInputScroll, {
    passive: false,
    capture: true,
  });
  document.addEventListener("DOMMouseScroll", preventNumberInputScroll, {
    passive: false,
    capture: true,
  });

  // Return a cleanup function
  return () => {
    document.removeEventListener("wheel", preventNumberInputScroll, {
      capture: true,
    });
    document.removeEventListener("mousewheel", preventNumberInputScroll, {
      capture: true,
    });
    document.removeEventListener("DOMMouseScroll", preventNumberInputScroll, {
      capture: true,
    });
  };
}

function App() {
  useEffect(() => {
    // The function returns a cleanup function that will be used when the component unmounts
    const cleanup = disableNumberInputScrolling();
    return cleanup;
  }, []);

  return (
    <div className='App'>
      <BrowserRouter>
        <Routes>
          <Route
            path='/admin'
            element={
              <PrivateRouteAdmin>
                <AdminProvider>
                  <Admin />
                </AdminProvider>
              </PrivateRouteAdmin>
            }
          ></Route>

          <Route
            path='/manager'
            element={
              <PrivateRouteManager>
                <Manager />
              </PrivateRouteManager>
            }
          ></Route>

          <Route
            path='/'
            element={
              <PrivateRoute>
                <Login />
              </PrivateRoute>
            }
            exact
          />
          <Route path='*' element={<h1>Not Found page - 404 👀 </h1>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
export default App;
