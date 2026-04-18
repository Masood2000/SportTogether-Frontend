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
import ChallengesPage from "./pages/ChallengesPage.jsx";
import FriendProfilePage from './pages/FriendProfilePage';



const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#00E5FF' }, // Cyan
    secondary: { main: '#A020F0' }, // Purple
    background: {
      default: '#0A0A0F', // Very dark blue/black
      paper: '#12121A',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
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
        <ThemeProvider theme={darkTheme}>
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
          <Route path="/challenges" element={isLoggedIn ? <ChallengesPage /> : <Navigate to="/login" />} />
          <Route path="/profile/:userId" element={<FriendProfilePage />} />
        </Routes>
      </ThemeProvider>
  );
}


export default App;