import React from "react";
import { Link, Navigate } from "react-router-dom";
import { AppBar, Toolbar, Typography, Button, Box, Container, Stack } from "@mui/material";
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

function IndexPage({ isLoggedIn }) {
  if (isLoggedIn) {
    return <Navigate to="/home" />;
  }

  return (
      <Box sx={{
        flexGrow: 1,
        minHeight: '100vh',
        background: 'radial-gradient(circle at top, #1a1a2e 0%, #0A0A0F 100%)',
        overflow: 'hidden'
      }}>
        {/* Top Navigation Bar */}
        <AppBar position="transparent" elevation={0} sx={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <Toolbar>
            <FitnessCenterIcon sx={{ color: '#00E5FF', mr: 2, fontSize: 30 }} />
            <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: '900', letterSpacing: 1, color: 'white' }}>
              SPORT<span style={{ color: '#00E5FF' }}>TOGETHER</span>
            </Typography>

            <Button color="inherit" component={Link} to="/login" sx={{ fontWeight: 'bold', mr: 2, '&:hover': { color: '#00E5FF' } }}>
              Log In
            </Button>
            <Button variant="outlined" component={Link} to="/signup" sx={{
              borderColor: '#00E5FF', color: '#00E5FF', borderRadius: 8, px: 3,
              '&:hover': { borderColor: '#00E5FF', boxShadow: '0 0 15px rgba(0, 229, 255, 0.4)' }
            }}>
              Sign Up
            </Button>
          </Toolbar>
        </AppBar>

        {/* Main Hero Section */}
        <Container maxWidth="md" sx={{ mt: 12, textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Typography variant="h1" component="h1" gutterBottom fontWeight="900" sx={{
            background: "linear-gradient(45deg, #00E5FF 20%, #A020F0 80%)",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
            fontSize: { xs: '4rem', md: '6rem' }
          }}>
            Never Train Alone.
          </Typography>
          <Typography variant="h5" color="text.secondary" paragraph sx={{ maxWidth: 600, mx: 'auto', mb: 6, lineHeight: 1.6 }}>
            Connect with local athletes, organize matches, compete on leaderboards, and crush your goals together.
          </Typography>

          {/* Call to Action Buttons */}
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center">
            <Button variant="contained" size="large" component={Link} to="/signup" sx={{
              px: 5, py: 2, fontSize: '1.2rem', borderRadius: 8, bgcolor: '#00E5FF', color: 'black', fontWeight: 'bold',
              boxShadow: '0 0 20px rgba(0, 229, 255, 0.4)', '&:hover': { bgcolor: '#00B3CC', transform: 'translateY(-2px)' }
            }}>
              Start Your Journey
            </Button>
          </Stack>
        </Container>
      </Box>
  );
}

export default IndexPage;