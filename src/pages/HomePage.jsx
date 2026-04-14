import React, { useState, useEffect } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import {
  Box, Container, Typography, Grid, Card, CardContent,
  CircularProgress, List, ListItem, ListItemText, ListItemAvatar,
  Avatar, Divider, Alert, Button, Tabs, Tab, Chip
} from "@mui/material";

import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import TimerIcon from '@mui/icons-material/Timer';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import PeopleIcon from '@mui/icons-material/People';
import PublicIcon from '@mui/icons-material/Public';
import DashboardIcon from '@mui/icons-material/Dashboard';

function HomePage({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0); // 0 = My Stats, 1 = Social Feed
  const [myActivities, setMyActivities] = useState([]);
  const [feedActivities, setFeedActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMyActivities = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/activities/me", { credentials: "include" });
      if (response.ok) setMyActivities(await response.json());
    } catch (err) { console.error(err); }
  };

  const fetchSocialFeed = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/activities/feed", { credentials: "include" });
      if (response.ok) setFeedActivities(await response.json());
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (!isLoggedIn) return;
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([fetchMyActivities(), fetchSocialFeed()]);
      setIsLoading(false);
    };
    loadData();
  }, [isLoggedIn]);

  const handleLogout = async (e) => {
    e.preventDefault();
    await onLogout();
    navigate("/login");
  };

  if (!isLoggedIn) return <Navigate to="/" />;

  const totalWorkouts = myActivities.length;
  const totalCalories = myActivities.reduce((sum, act) => sum + act.caloriesBurned, 0);
  const totalDuration = myActivities.reduce((sum, act) => sum + act.durationMinutes, 0);

  return (
      <Container maxWidth="md" sx={{ mt: 5, mb: 8 }}>
        {/* HEADER */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h3" color="primary" sx={{
            background: "linear-gradient(45deg, #00E5FF 30%, #007BFF 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            fontWeight: 'bold'
          }}>
            Sport Together
          </Typography>

          {/* NAVIGATION BUTTONS */}
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button variant="outlined" component={Link} to="/community" startIcon={<PeopleIcon />} sx={{ borderRadius: 8, color: '#A020F0', borderColor: '#A020F0' }}>
              Community
            </Button>
            <Button variant="outlined" component={Link} to="/me" sx={{ borderRadius: 8 }}>Profile</Button>
            <Button variant="text" color="error" onClick={handleLogout}>Logout</Button>
          </Box>
        </Box>

        {/* CALL TO ACTION */}
        <Box sx={{ mb: 4 }}>
          <Button variant="contained" component={Link} to="/log-activity" size="large" fullWidth sx={{
            py: 2, fontSize: '1.1rem', background: 'linear-gradient(45deg, #FF2A5F 30%, #FF7B00 90%)',
            boxShadow: '0 4px 20px rgba(255, 42, 95, 0.4)', transition: 'transform 0.2s',
            '&:hover': { transform: 'translateY(-2px)' }
          }}>
            + Log New Workout
          </Button>
        </Box>

        {/* DASHBOARD TABS */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
          <Tabs value={tabValue} onChange={(e, val) => setTabValue(val)} textColor="primary" indicatorColor="primary" centered>
            <Tab icon={<DashboardIcon />} iconPosition="start" label="My Stats" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }} />
            <Tab icon={<PublicIcon />} iconPosition="start" label="Friend Feed" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }} />
          </Tabs>
        </Box>

        {isLoading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>
        ) : (
            <Box>
              {/* TAB 0: MY DASHBOARD */}
              {tabValue === 0 && (
                  <Box>
                    <Grid container spacing={3} sx={{ mb: 6 }}>
                      {[
                        { icon: <FitnessCenterIcon sx={{ fontSize: 40, color: '#00E5FF' }}/>, value: totalWorkouts, label: "Workouts", glow: "rgba(0, 229, 255, 0.15)" },
                        { icon: <TimerIcon sx={{ fontSize: 40, color: '#A020F0' }}/>, value: totalDuration, label: "Minutes Active", glow: "rgba(160, 32, 240, 0.15)" },
                        { icon: <LocalFireDepartmentIcon sx={{ fontSize: 40, color: '#FF2A5F' }}/>, value: Math.round(totalCalories), label: "Calories Burned", glow: "rgba(255, 42, 95, 0.15)" }
                      ].map((stat, index) => (
                          <Grid item xs={12} sm={4} key={index}>
                            <Card elevation={0} sx={{
                              bgcolor: 'background.paper', textAlign: 'center', py: 3,
                              border: '1px solid rgba(255,255,255,0.05)', boxShadow: `0 8px 32px ${stat.glow}`
                            }}>
                              <CardContent>
                                {stat.icon}
                                <Typography variant="h3" fontWeight="bold" sx={{ mt: 1, color: 'white' }}>{stat.value}</Typography>
                                <Typography variant="subtitle1" sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}>{stat.label}</Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                      ))}
                    </Grid>
                  </Box>
              )}

              {/* TAB 1: SOCIAL FEED */}
              {tabValue === 1 && (
                  <Box>
                    {feedActivities.length === 0 ? (
                        <Box sx={{ p: 4, textAlign: 'center', bgcolor: 'background.paper', borderRadius: 4 }}>
                          <Typography variant="body1" color="text.secondary">No recent activities. Tell your friends to get moving!</Typography>
                        </Box>
                    ) : (
                        <List sx={{ width: '100%', p: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
                          {feedActivities.map((activity) => (
                              <Card key={activity.id} elevation={0} sx={{
                                bgcolor: 'background.paper', borderRadius: 3, border: '1px solid rgba(255,255,255,0.05)'
                              }}>
                                <ListItem alignItems="flex-start" sx={{ py: 3, px: 3, flexDirection: 'column' }}>

                                  {/* Header: User Info */}
                                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, width: '100%' }}>
                                    <Avatar sx={{ bgcolor: 'primary.main', width: 45, height: 45, mr: 2 }}>
                                      {activity.user.name[0].toUpperCase()}
                                    </Avatar>
                                    <Box>
                                      <Typography variant="subtitle1" fontWeight="bold" sx={{ color: 'white' }}>
                                        {activity.user.name} <span style={{ color: '#A020F0', fontWeight: 'normal', fontSize: '0.9rem' }}>@{activity.user.username}</span>
                                      </Typography>
                                      <Typography variant="caption" color="text.secondary">
                                        {new Date(activity.dateLogged).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                                      </Typography>
                                    </Box>
                                  </Box>

                                  {/* Body: Activity Details */}
                                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                    <Chip label={activity.sportType} color="primary" variant="outlined" />
                                    <Chip label={`${activity.durationMinutes} mins`} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />
                                    {activity.distanceKm > 0 && <Chip label={`${activity.distanceKm} km`} sx={{ bgcolor: 'rgba(255,255,255,0.05)' }} />}
                                  </Box>

                                  {activity.notes && (
                                      <Typography variant="body1" sx={{ fontStyle: 'italic', color: 'text.secondary', mb: 2, borderLeft: '3px solid #FF2A5F', pl: 2 }}>
                                        "{activity.notes}"
                                      </Typography>
                                  )}

                                  <Typography variant="subtitle2" sx={{ color: '#FF2A5F', fontWeight: 'bold' }}>
                                    🔥 Burned {Math.round(activity.caloriesBurned)} calories
                                  </Typography>

                                </ListItem>
                              </Card>
                          ))}
                        </List>
                    )}
                  </Box>
              )}
            </Box>
        )}
      </Container>
  );
}

export default HomePage;