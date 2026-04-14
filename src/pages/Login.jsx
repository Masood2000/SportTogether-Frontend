import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Paper, Container } from "@mui/material";

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // 1. Prepare the data as URLSearchParams because Spring expects @RequestParam
    const formData = new URLSearchParams();
    formData.append("email", email);
    formData.append("password", password);

    try {
      // 2. Make the POST request to your backend
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData,
        // 3. CRITICAL: This tells the browser to send and save the session cookie!
        credentials: "include",
      });

      // 4. Handle the Response
      if (response.ok) {
        // HTTP 200 OK
        console.log("login:success");
        onLoginSuccess();
        navigate("/home");
      } else {
        // HTTP 401 (Invalid username or password)
        const errorMessage = await response.text();
        console.error("Login failed:", errorMessage);
      }
    } catch (err) {
      // This catches network errors (e.g., backend is down)
      console.error("Network error:", err);
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ height: '100vh', display: 'flex', alignItems: 'center' }}>
      <Paper elevation={6} sx={{ p: 4, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h4" fontWeight="bold" gutterBottom color="primary">
          Welcome Back
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          Log in to check your upcoming matches.
        </Typography>

        <Box component="form" onSubmit={handleLogin} sx={{ mt: 1, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="Email Address"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2, py: 1.5 }}>
            Log In
          </Button>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{" "}
              <Box component={Link} to="/signup" sx={{ color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                Sign Up
              </Box>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;