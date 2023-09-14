import Login from "./pages/Login";
import "./App.css";
import { Box } from "@mui/material";

function App() {
  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Login />
    </Box>
  );
}
export default App;
