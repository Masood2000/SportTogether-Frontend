import React from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Stack
} from "@mui/material";

function HomePage({ isLoggedIn, onLogout }) {
  // If the user is already logged in, we automatically redirect them to the users page

  const navigate = useNavigate();


  const handleLogout = (e) => {
    e.preventDefault();
    // Add your actual authentication logic here
    console.log("logout:succes from home")
    onLogout();
    navigate("/signup");
  };

  console.log("home" + isLoggedIn)

  if (!isLoggedIn) {
    console.log("called from here")
    return <Navigate to="/" />;
  }


  return (
    <div>
      <h1>
        Wellcome Masood
      </h1>
      <button onClick={handleLogout} >logout</button>
    </div>

  );
}

export default HomePage;