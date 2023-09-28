import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Typography, Box, TextField, Button } from "@mui/material";
import axios from "axios";
const myAxios = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  headers: {
    "Content-type": "application/json",
  },
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await myAxios.post("/auth/login", { email, password, });
    const { token, user } = response.data; 

    document.cookie = `token=${token}`;
    localStorage.setItem("user", JSON.stringify(user));

    if (user.role === "admin") {
      navigate("/admin");
    } else {
      navigate("/");
    }

    setEmail("");
    setPassword("");

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
        label="Email"
        variant="outlined"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
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
