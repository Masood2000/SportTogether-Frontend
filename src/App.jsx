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

// Material Design 3 "Indigo Light" Theme
const materialLightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#6750A4", // M3 Indigo Primary
      light: "#EADDFF",
      dark: "#21005D",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#625B71", // M3 Muted Secondary
    },
    background: {
      default: "#FEF7FF", // M3 Surface color (light violet tint)
      paper: "#FFFFFF",   // Pure white for cards
    },
    text: {
      primary: "#1D1B20", // Deep Charcoal
      secondary: "#49454F", // Muted Gray
    },
    divider: "#CAC4D0",
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 400,
      letterSpacing: "-0.5px",
      color: "#1D1B20"
    },
    h4: {
      fontWeight: 500,
      color: "#1D1B20"
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
      letterSpacing: "0.1px"
    }
  },
  shape: {
    borderRadius: 16, // Modern rounded corners
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 100, // Pill-shaped buttons (standard M3)
          padding: '10px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 1px 3px rgba(0,0,0,0.1)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0px 1px 3px rgba(0,0,0,0.05)', // Very soft elevation
          border: '1px solid #E7E0EC', // Subtle outline for depth
        },
      },
    },
  },
});

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
        <ThemeProvider theme={materialLightTheme}>
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
      <ThemeProvider theme={materialLightTheme}>
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