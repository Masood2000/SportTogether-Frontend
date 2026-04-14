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







function IndexPage({ isLoggedIn }) {
  // If the user is already logged in, we automatically redirect them to the users page
  
  console.log("index page")
  if (isLoggedIn) {
    return <Navigate to="/home" />;
  }

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh' }}>
      {/* Top Navigation Bar */}
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ flexGrow: 1, fontWeight: 'bold', letterSpacing: 1 }}
          >
            Sport Together
          </Typography>
          
          {/* Top Right Buttons */}
          <Button color="inherit" component={Link} to="/login" sx={{ fontWeight: 'bold' }}>
            Login
          </Button>
          <Button 
            variant="outlined" 
            color="inherit" 
            component={Link} 
            to="/signup" 
            sx={{ ml: 2, borderColor: 'white', '&:hover': { borderColor: 'white', backgroundColor: 'rgba(255,255,255,0.1)' } }}
          >
            Sign Up
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Visual/Hero Section */}
      <Container maxWidth="md" sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom fontWeight="800" color="primary">
          Welcome to Sport Together
        </Typography>
        <Typography variant="h6" color="text.secondary" paragraph>
          Connect with local athletes, organize matches, and never play alone again.
          Join our active community today!
        </Typography>

        {/* Visuals / Image Placeholder */}
        <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center' }}>
          <Box
            component="img"
            sx={{
              height: 'auto',
              width: '100%',
              maxWidth: 700,
              borderRadius: 3,
              boxShadow: 4,
              objectFit: 'cover'
            }}
            alt="People playing sports together"
            // You can replace this with your actual app visual/logo
            src="https://images.unsplash.com/photo-1526676037777-05a232554f77?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80" 
          />
        </Box>

        {/* Call to Action Buttons */}
        <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 6, mb: 6 }}>
          <Button variant="contained" size="large" component={Link} to="/signup" sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}>
            Get Started
          </Button>
          <Button variant="text" size="large" component={Link} to="/login" sx={{ px: 4, py: 1.5, fontSize: '1.1rem' }}>
            I already have an account
          </Button>
        </Stack>
      </Container>
    </Box>
  );
}

export default IndexPage;