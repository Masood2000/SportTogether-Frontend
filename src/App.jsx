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

// "Midnight Velocity" Theme Configuration
const midnightVelocityTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#F59E0B", // Vibrant Amber (High energy, stands out against dark backgrounds)
      light: "#FBBF24",
      dark: "#B45309",
    },
    secondary: {
      main: "#10B981", // Emerald Green (Perfect for "Activity Logged" or success states)
    },
    background: {
      default: "#0F172A", // Very Deep Navy Slate (More sophisticated than pure black)
      paper: "#1E293B",   // Lighter Slate for cards and modals
    },
    text: {
      primary: "#F8FAFC", // Off-white for better readability
      secondary: "#94A3B8", // Muted slate for less important info
    },
    divider: "rgba(255, 255, 255, 0.12)",
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 900,
      letterSpacing: "-0.02em",
      color: "#F8FAFC"
    },
    h4: {
      fontWeight: 800,
      color: "#F8FAFC"
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
      fontSize: '0.95rem'
    }
  },
  shape: {
    borderRadius: 12, // Modern, slightly rounded edges
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8, // Crisper buttons
          padding: '8px 20px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none", // Removes the default MUI "elevation" overlay for a cleaner look
        },
      },
    },
  },
});

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check session when the app loads
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("http://localhost:8080/api/auth/me", {
          method: "GET",
          credentials: "include",
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
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  // Handle Logout
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

  if (isLoading) {
    return (
        <ThemeProvider theme={midnightVelocityTheme}>
          <CssBaseline />
          <Box sx={{
            display: 'flex',
            height: '100vh',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'background.default'
          }}>
            <CircularProgress color="primary" />
          </Box>
        </ThemeProvider>
    );
  }

  return (
      <ThemeProvider theme={midnightVelocityTheme}>
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