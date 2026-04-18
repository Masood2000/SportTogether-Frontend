import React, { useState, useEffect } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import {
  Box, Container, Typography, Grid, Card, CardContent,
  CircularProgress, Alert, Button, Tabs, Tab, Tooltip, Avatar
} from "@mui/material";

// Icons
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import TimerIcon from '@mui/icons-material/Timer';
import PeopleIcon from '@mui/icons-material/People';
import PublicIcon from '@mui/icons-material/Public';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';

// Import our shared Activity Card
import ActivityCard from "../components/ActivityCard";

function HomePage({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const [myActivities, setMyActivities] = useState([]);
  const [feedActivities, setFeedActivities] = useState([]);
  const [myAchievements, setMyAchievements] = useState([]); // State for Badges
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoggedIn) return;
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchCurrentUser(),
          fetchMyActivities(),
          fetchSocialFeed(),
          fetchMyAchievements() // Fetch badges on load!
        ]);
        // eslint-disable-next-line no-unused-vars
      } catch (err) {
        setError("Error loading dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, [isLoggedIn]);

  const fetchCurrentUser = async () => {
    const response = await fetch("http://localhost:8080/api/auth/me", { credentials: "include" });
    if (response.ok) setCurrentUser(await response.json());
  };

  const fetchMyActivities = async () => {
    const response = await fetch("http://localhost:8080/api/activities/me", { credentials: "include" });
    if (response.ok) setMyActivities(await response.json());
  };

  const fetchSocialFeed = async () => {
    const response = await fetch("http://localhost:8080/api/activities/feed", { credentials: "include" });
    if (response.ok) setFeedActivities(await response.json());
  };

  const fetchMyAchievements = async () => {
    const response = await fetch("http://localhost:8080/api/achievements/me", { credentials: "include" });
    if (response.ok) setMyAchievements(await response.json());
  };

  // Shared function to toggle Kudos
  const handleToggleKudo = async (activityId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/activities/${activityId}/kudo`, {
        method: "POST", credentials: "include"
      });
      if (response.ok) {
        fetchSocialFeed();
        fetchMyActivities(); // Refresh both lists so UI stays in sync
      }
    } catch (err) { console.error("Kudo toggle failed", err); }
  };

  // Shared function to Add Comments
  const handleAddComment = async (activityId, text) => {
    try {
      const response = await fetch(`http://localhost:8080/api/comments/${activityId}`, {
        method: "POST", headers: { "Content-Type": "text/plain" }, body: text, credentials: "include"
      });
      if (response.ok) {
        fetchSocialFeed();
        fetchMyActivities();
      }
    } catch (err) { console.error("Failed to add comment", err); }
  };

  const handleLogout = async (e) => {
    e.preventDefault();
    await onLogout();
    navigate("/login");
  };

  // Dynamic Badge Icon Renderer
  const renderBadgeIcon = (iconType) => {
    switch(iconType) {
      case 'DISTANCE': return <DirectionsRunIcon sx={{ fontSize: 40, color: '#00E5FF' }} />;
      case 'FIRE': return <LocalFireDepartmentIcon sx={{ fontSize: 40, color: '#FF2A5F' }} />;
      case 'STAR': return <StarIcon sx={{ fontSize: 40, color: '#FFD700' }} />;
      default: return <SportsScoreIcon sx={{ fontSize: 40, color: '#A020F0' }} />;
    }
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
            background: "linear-gradient(45deg, #00E5FF 30%, #007BFF 90%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 'bold'
          }}>
            Sport Together
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Button variant="outlined" component={Link} to="/challenges" startIcon={<EmojiEventsIcon />} sx={{ borderRadius: 8, color: '#FFD700', borderColor: '#FFD700' }}>Challenges</Button>
            <Button variant="outlined" component={Link} to="/community" startIcon={<PeopleIcon />} sx={{ borderRadius: 8, color: '#A020F0', borderColor: '#A020F0' }}>Community</Button>
            <Button variant="outlined" component={Link} to="/me" sx={{ borderRadius: 8 }}>Profile</Button>
            <Button variant="text" color="error" onClick={handleLogout}>Logout</Button>
          </Box>
        </Box>

        {/* CALL TO ACTION */}
        <Box sx={{ mb: 4 }}>
          <Button variant="contained" component={Link} to="/log-activity" size="large" fullWidth sx={{
            py: 2, fontSize: '1.1rem', background: 'linear-gradient(45deg, #FF2A5F 30%, #FF7B00 90%)', boxShadow: '0 4px 20px rgba(255, 42, 95, 0.4)', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-2px)' }
          }}>
            + Log New Workout
          </Button>
        </Box>

        {/* TABS */}
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
              {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

              {/* TAB 0: MY DASHBOARD */}
              {tabValue === 0 && (
                  <Box>
                    {/* STATS CARDS */}
                    <Grid container spacing={3} sx={{ mb: 4 }}>
                      {[
                        { icon: <FitnessCenterIcon sx={{ fontSize: 40, color: '#00E5FF' }}/>, value: totalWorkouts, label: "Workouts", glow: "rgba(0, 229, 255, 0.15)" },
                        { icon: <TimerIcon sx={{ fontSize: 40, color: '#A020F0' }}/>, value: totalDuration, label: "Minutes Active", glow: "rgba(160, 32, 240, 0.15)" },
                        { icon: <LocalFireDepartmentIcon sx={{ fontSize: 40, color: '#FF2A5F' }}/>, value: Math.round(totalCalories), label: "Calories Burned", glow: "rgba(255, 42, 95, 0.15)" }
                      ].map((stat, index) => (
                          <Grid item xs={12} sm={4} key={index}>
                            <Card elevation={0} sx={{ bgcolor: 'background.paper', textAlign: 'center', py: 3, border: '1px solid rgba(255,255,255,0.05)', boxShadow: `0 8px 32px ${stat.glow}` }}>
                              <CardContent>
                                {stat.icon}
                                <Typography variant="h3" fontWeight="bold" sx={{ mt: 1, color: 'white' }}>{stat.value}</Typography>
                                <Typography variant="subtitle1" sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1 }}>{stat.label}</Typography>
                              </CardContent>
                            </Card>
                          </Grid>
                      ))}
                    </Grid>

                    {/* NEW SECTION: TROPHY CABINET */}
                    {myAchievements.length > 0 && (
                        <Box sx={{ mb: 6, p: 3, bgcolor: 'rgba(255, 215, 0, 0.05)', borderRadius: 4, border: '1px solid rgba(255, 215, 0, 0.2)' }}>
                          <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#FFD700', display: 'flex', alignItems: 'center', gap: 1 }}>
                            <EmojiEventsIcon /> Trophy Cabinet
                          </Typography>
                          <Grid container spacing={2}>
                            {myAchievements.map((achievement) => (
                                <Grid item xs={4} sm={3} md={2} key={achievement.id}>
                                  <Tooltip title={achievement.description} arrow placement="top">
                                    <Box sx={{
                                      display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                                      p: 2, bgcolor: 'background.paper', borderRadius: 3,
                                      boxShadow: '0 4px 15px rgba(0,0,0,0.5)', transition: 'transform 0.2s',
                                      '&:hover': { transform: 'translateY(-5px)', boxShadow: '0 8px 25px rgba(255, 215, 0, 0.3)' }
                                    }}>
                                      <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.05)', width: 60, height: 60, mb: 1 }}>
                                        {renderBadgeIcon(achievement.iconType)}
                                      </Avatar>
                                      <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'white', lineHeight: 1.2 }}>
                                        {achievement.name}
                                      </Typography>
                                    </Box>
                                  </Tooltip>
                                </Grid>
                            ))}
                          </Grid>
                        </Box>
                    )}

                    {/* MY ACTIVITY HISTORY */}
                    <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: 'white' }}>Activity History</Typography>
                    {myActivities.length === 0 ? (
                        <Box sx={{ p: 4, textAlign: 'center', bgcolor: 'background.paper', borderRadius: 4 }}>
                          <Typography variant="body1" color="text.secondary">No workouts logged yet. Time to get moving!</Typography>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          {myActivities.map((activity) => (
                              <ActivityCard
                                  key={activity.id}
                                  activity={activity}
                                  currentUser={currentUser}
                                  onToggleKudo={handleToggleKudo}
                                  onAddComment={handleAddComment}
                              />
                          ))}
                        </Box>
                    )}
                  </Box>
              )}

              {/* TAB 1: SOCIAL FEED */}
              {tabValue === 1 && (
                  <Box>
                    {feedActivities.length === 0 ? (
                        <Box sx={{ p: 4, textAlign: 'center', bgcolor: 'background.paper', borderRadius: 4 }}>
                          <Typography variant="body1" color="text.secondary">No recent activities. Add friends to see their progress!</Typography>
                        </Box>
                    ) : (
                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          {feedActivities.map((activity) => (
                              <ActivityCard
                                  key={activity.id}
                                  activity={activity}
                                  currentUser={currentUser}
                                  onToggleKudo={handleToggleKudo}
                                  onAddComment={handleAddComment}
                              />
                          ))}
                        </Box>
                    )}
                  </Box>
              )}

            </Box>
        )}
      </Container>
  );
}


export default HomePage;