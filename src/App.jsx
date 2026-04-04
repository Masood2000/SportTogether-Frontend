import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import HomePage from "./pages/HomePage";
import IndexPage from "./pages/IndexPage";


// Modern Dark Theme Configuration
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#02383e", // Electric Cyan for high energy
    },
    secondary: {
      main: "#ff1744", // Vibrant red for secondary actions
    },
    background: {
      default: "#0a0a0a", // Almost pure black
      paper: "#1a1a1a",   // Slightly lighter black for cards/forms
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: 'none', // Modern websites usually avoid ALL CAPS buttons
      fontWeight: 600,
    }
  },
  shape: {
    borderRadius: 12, // Softer, modern rounded corners
  },
});

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <ThemeProvider theme={darkTheme}>
      {/* CssBaseline guarantees the background color is applied to the whole `body` */}
      <CssBaseline />
      
      <Routes>
        <Route path="/" element={isLoggedIn ? <HomePage isLoggedIn={isLoggedIn} onLogout={() => setIsLoggedIn(false)}/> : <IndexPage isLoggedIn={isLoggedIn} />} />
        <Route path="/login" element={isLoggedIn ? <HomePage isLoggedIn={isLoggedIn} onLogout={() => setIsLoggedIn(false)}/> : <Login onLoginSuccess={() => setIsLoggedIn(true)} />} />
        <Route path="/signup" element={isLoggedIn ? <HomePage isLoggedIn={isLoggedIn} onLogout={() => setIsLoggedIn(false)}/> :<Signup />} />
        <Route path="/home" element={isLoggedIn ? <HomePage isLoggedIn={isLoggedIn} onLogout={() => setIsLoggedIn(false)}/> : <Navigate to="/login" />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;