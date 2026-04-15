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

// "Onyx & Electric Blue" AMOLED Theme
const onyxBlackTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#3B82F6", // Bright Electric Blue
      light: "#60A5FA",
      dark: "#1D4ED8",
    },
    secondary: {
      main: "#A855F7", // Purple accent for variety
    },
    background: {
      default: "#000000", // Pure Black (AMOLED)
      paper: "#0A0A0A",   // Extremely dark gray for cards
    },
    text: {
      primary: "#FFFFFF",
      secondary: "#94A3B8",
    },
    divider: "rgba(255, 255, 255, 0.08)",
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 900,
      letterSpacing: "-1.5px",
    },
    h4: {
      fontWeight: 800
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
      letterSpacing: "0.5px"
    }
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          // Custom scrollbar for a sleek black look
          "&::-webkit-scrollbar": { width: 8 },
          "&::-webkit-scrollbar-track": { background: "#000000" },
          "&::-webkit-scrollbar-thumb": { background: "#333", borderRadius: 10 },
          "&::-webkit-scrollbar-thumb:hover": { background: "#444" },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "#0A0A0A",
          border: "1px solid rgba(255, 255, 255, 0.05)", // Critical for defining edges on black
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.5)",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '8px 24px',
        },
        containedPrimary: {
          boxShadow: "0 0 15px rgba(59, 130, 246, 0.3)", // Subtle glow effect
          '&:hover': {
            boxShadow: "0 0 25px rgba(59, 130, 246, 0.5)",
          },
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
        <ThemeProvider theme={onyxBlackTheme}>
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
      <ThemeProvider theme={onyxBlackTheme}>
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