import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Paper, Container, Alert } from "@mui/material";

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    const formData = new URLSearchParams();
    formData.append("email", email);
    formData.append("password", password);

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData, credentials: "include",
      });

      if (response.ok) {
        onLoginSuccess();
        navigate("/home");
      } else {
        setError(await response.text());
      }
      // eslint-disable-next-line no-unused-vars
    } catch (err) { setError("Network error. Server might be offline."); }
  };

  return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', background: 'radial-gradient(circle at bottom right, #2a0845 0%, #0A0A0F 100%)' }}>
        <Container component="main" maxWidth="xs">
          <Paper elevation={24} sx={{
            p: 5, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center',
            bgcolor: 'rgba(20, 20, 30, 0.7)', backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4
          }}>
            <Typography component="h1" variant="h4" fontWeight="bold" gutterBottom sx={{ color: '#00E5FF' }}>
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
              Enter your details to access your dashboard.
            </Typography>

            {error && <Alert severity="error" sx={{ width: '100%', mb: 3 }}>{error}</Alert>}

            <Box component="form" onSubmit={handleLogin} sx={{ width: '100%' }}>
              <TextField margin="normal" required fullWidth label="Email Address" autoFocus value={email} onChange={(e) => setEmail(e.target.value)} />
              <TextField margin="normal" required fullWidth label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

              <Button type="submit" fullWidth variant="contained" sx={{
                mt: 4, mb: 3, py: 1.5, borderRadius: 8, bgcolor: '#A020F0', fontSize: '1.1rem',
                '&:hover': { bgcolor: '#8a19d6', boxShadow: '0 0 15px rgba(160, 32, 240, 0.5)' }
              }}>
                Log In
              </Button>

              <Typography variant="body2" color="text.secondary" align="center">
                Don't have an account?{" "}
                <Box component={Link} to="/signup" sx={{ color: '#00E5FF', textDecoration: 'none', fontWeight: 'bold', '&:hover': { textDecoration: 'underline' } }}>
                  Sign Up
                </Box>
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
  );
}

export default Login;