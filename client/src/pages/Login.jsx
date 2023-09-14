import React, { useState } from "react";
import { Typography, Box, TextField, Button } from "@mui/material";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("username: ", username);
    console.log("password: ", password);
    // handle form submit logic...
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        width: 300,
        bgcolor: "background.paper",
        p: 4,
      }}
    >
      <Typography
        sx={{ mb: 2, textAlign: "center" }}
      >
        <img src="https://www.hermitage.co.il/wp-content/uploads/2022/01/logo.png" alt="logo" />
      </Typography>

      <TextField
        label="Username"
        variant="outlined"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        fullWidth
        required
        sx={{ mb: 2 }}
      />

      <TextField
        label="Password"
        variant="outlined"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        fullWidth
        required
        sx={{ mb: 4 }}
      />

      <Button
        type="submit"
        variant="contained"
        color="primary"
        size="large"
        fullWidth
      >
        Login
      </Button>
    </Box>
  );
}

export default Login;
