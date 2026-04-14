import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import HomePage from "./pages/HomePage";
import IndexPage from "./pages/IndexPage";
import MePage from "./pages/MePage.jsx";
import LogActivity from "./pages/LogActivity.jsx";
import CommunityPage from "./pages/CommunityPage.jsx";
import LeaderboardPage from "./pages/LeaderboardPage.jsx";

// Replace the darkTheme in App.jsx with this:
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#00E5FF", // Electric Cyan (High energy, futuristic)
    },
    secondary: {
      main: "#FF2A5F", // Vibrant Pink/Red (Less aggressive than pure red, more modern)
    },
    background: {
      default: "#0B0F19", // Deep Midnight Blue instead of pure black
      paper: "#1A2235",   // Slightly lighter blue-gray for cards
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: { fontWeight: 800, letterSpacing: "-1px" },
    h4: { fontWeight: 800 },
    button: { textTransform: 'none', fontWeight: 700, letterSpacing: "0.5px" }
  },
  shape: {
    borderRadius: 16, // Softer, rounder corners
  },
});

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add a loading state

  // Check session when the app loads
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/auth/me", {
          method: "GET",
          credentials: "include", // CRITICAL: Send the session cookie
        });

        if (response.ok) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error("Session check failed:", error);
        setIsLoggedIn(false);
      } finally {
        setIsLoading(false); // Stop loading once we have an answer
      }
    };

    checkSession();
  }, []); // Empty dependency array means this runs once on mount

  // Handle Logout securely by destroying the backend session
  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8080/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setIsLoggedIn(false);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Show a spinner while checking the session to prevent UI flickering
  if (isLoading) {
    return (
        <ThemeProvider theme={darkTheme}>
          <CssBaseline />
          <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress color="primary" />
          </Box>
        </ThemeProvider>
    );
  }

  return (
      <ThemeProvider theme={darkTheme}>
        <CssBaseline />

        <Routes>
          <Route path="/" element={isLoggedIn ? <HomePage isLoggedIn={isLoggedIn} onLogout={handleLogout}/> : <IndexPage isLoggedIn={isLoggedIn} />} />
          <Route path="/login" element={isLoggedIn ? <HomePage isLoggedIn={isLoggedIn} onLogout={handleLogout}/> : <Login onLoginSuccess={() => setIsLoggedIn(true)} />} />
          <Route path="/signup" element={isLoggedIn ? <HomePage isLoggedIn={isLoggedIn} onLogout={handleLogout}/> : <Signup />} />
          <Route path="/home" element={isLoggedIn ? <HomePage isLoggedIn={isLoggedIn} onLogout={handleLogout}/> : <Navigate to="/login" />} />
          <Route path="/me" element={isLoggedIn ? <MePage onLogout={handleLogout}/> : <Navigate to="/login" />} />
          <Route path="/log-activity" element={isLoggedIn ? <LogActivity /> : <Navigate to="/login" />} />
          <Route path="/community" element={isLoggedIn ? <CommunityPage /> : <Navigate to="/login" />} />
          <Route path="/leaderboard" element={isLoggedIn ? <LeaderboardPage /> : <Navigate to="/login" />} />
        </Routes>
      </ThemeProvider>
  );
}

export default App;