import React from "react";
import { Link, Navigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Container,
  Stack
} from "@mui/material";

function HomePage({ isLoggedIn }) {
  // If the user is already logged in, we automatically redirect them to the users page
  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  return (
    <h1>
        Wellcome Masood
    </h1>
  );
}

export default IndexPage;