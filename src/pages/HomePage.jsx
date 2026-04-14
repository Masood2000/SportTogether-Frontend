import React, { useState, useEffect } from "react";
import { Link, useNavigate, Navigate } from "react-router-dom";
import {
  Box, Container, Typography, Grid, Card, CardContent,
  CircularProgress, List, ListItem, ListItemText, ListItemAvatar,
  Avatar, Alert, Button, Tabs, Tab, Chip, IconButton, TextField
} from "@mui/material";

// Icons
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import TimerIcon from '@mui/icons-material/Timer';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import PeopleIcon from '@mui/icons-material/People';
import PublicIcon from '@mui/icons-material/Public';
import DashboardIcon from '@mui/icons-material/Dashboard';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';

function HomePage({ isLoggedIn, onLogout }) {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0); // 0 = My Stats, 1 = Social Feed
  const [currentUser, setCurrentUser] = useState(null);
  const [myActivities, setMyActivities] = useState([]);
  const [feedActivities, setFeedActivities] = useState([]);
  const [commentText, setCommentText] = useState({}); // Track text per activity ID
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Initial Data Load
  useEffect(() => {
    if (!isLoggedIn) return;
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([
          fetchCurrentUser(),
          fetchMyActivities(),
          fetchSocialFeed()
        ]);
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

  const handleToggleKudo = async (activityId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/activities/${activityId}/kudo`, {
        method: "POST",
        credentials: "include"
      });

      if (response.ok) {
        setFeedActivities(prev =>
            prev.map(act => {
              if (act.id === activityId) {
                const hasLiked = act.likedByUserIds.includes(currentUser.id);
                const newLikes = hasLiked
                    ? act.likedByUserIds.filter(id => id !== currentUser.id)
                    : [...act.likedByUserIds, currentUser.id];
                return { ...act, likedByUserIds: newLikes };
              }
              return act;
            })
        );
      }
    } catch (err) {
      console.error("Kudo toggle failed", err);
    }
  };

  const handleAddComment = async (activityId) => {
    const text = commentText[activityId];
    if (!text || !text.trim()) return;

    try {
      const response = await fetch(`http://localhost:8080/api/comments/${activityId}`, {
        method: "POST",
        headers: { "Content-Type": "text/plain" },
        body: text,
        credentials: "include"
      });

      if (response.ok) {
        setCommentText({ ...commentText, [activityId]: "" }); // Clear specific input
        fetchSocialFeed(); // Refresh feed to show the new comment
      }
    } catch (err) {
      console.error("Failed to add comment", err);
    }
  };

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
            <Button
                variant="outlined"
                component={Link}
                to="/leaderboard"
                startIcon={<EmojiEventsIcon />}
                sx={{ borderRadius: 8, color: '#FFD700', borderColor: '#FFD700' }}
            >
              Leaderboard
            </Button>
            <Button
                variant="outlined"
                component={Link}
                to="/community"
                startIcon={<PeopleIcon />}
                sx={{ borderRadius: 8, color: '#A020F0', borderColor: '#A020F0' }}
            >
              Community
            </Button>
            <Button variant="outlined" component={Link} to="/me" sx={{ borderRadius: 8 }}>Profile</Button>
            <Button variant="text" color="error" onClick={handleLogout}>Logout</Button>
          </Box>
        </Box>

        {/* CALL TO ACTION */}
        <Box sx={{ mb: 4 }}>
          <Button
              variant="contained"
              component={Link}
              to="/log-activity"
              size="large"
              fullWidth
              sx={{
                py: 2,
                fontSize: '1.1rem',
                background: 'linear-gradient(45deg, #FF2A5F 30%, #FF7B00 90%)',
                boxShadow: '0 4px 20px rgba(255, 42, 95, 0.4)',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-2px)' }
              }}
          >
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
              {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

              {/* TAB 0: MY DASHBOARD */}
              {tabValue === 0 && (
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
              )}

              {/* TAB 1: SOCIAL FEED */}
              {tabValue === 1 && (
                  <Box>
                    {feedActivities.length === 0 ? (
                        <Box sx={{ p: 4, textAlign: 'center', bgcolor: 'background.paper', borderRadius: 4 }}>
                          <Typography variant="body1" color="text.secondary">No recent activities. Add friends to see their progress!</Typography>
                        </Box>
                    ) : (
                        <List sx={{ width: '100%', p: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
                          {feedActivities.map((activity) => {
                            const hasLiked = currentUser && activity.likedByUserIds?.includes(currentUser.id);

                            return (
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

                                    <Typography variant="subtitle2" sx={{ color: '#FF2A5F', fontWeight: 'bold', mb: 1 }}>
                                      🔥 Burned {Math.round(activity.caloriesBurned)} calories
                                    </Typography>

                                    {/* Interaction Bar */}
                                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', borderTop: '1px solid rgba(255,255,255,0.05)', pt: 1 }}>
                                      <IconButton onClick={() => handleToggleKudo(activity.id)} sx={{ color: hasLiked ? '#FF2A5F' : 'text.secondary' }}>
                                        {hasLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                                      </IconButton>
                                      <Typography variant="body2" sx={{ color: hasLiked ? '#FF2A5F' : 'text.secondary', fontWeight: 'bold', mr: 2 }}>
                                        {activity.likedByUserIds?.length || 0} Kudos
                                      </Typography>

                                      <ChatBubbleOutlineIcon sx={{ color: 'text.secondary', mr: 1 }} fontSize="small" />
                                      <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 'bold' }}>
                                        {activity.comments?.length || 0} Comments
                                      </Typography>
                                    </Box>

                                    {/* Comments Section */}
                                    <Box sx={{ mt: 2, width: '100%', pl: 1, borderLeft: '2px solid rgba(255,255,255,0.05)' }}>
                                      <List sx={{ p: 0 }}>
                                        {activity.comments?.map((comment) => (
                                            <ListItem key={comment.id} sx={{ px: 0, py: 0.5 }}>
                                              <Typography variant="body2" sx={{ color: 'white' }}>
                                              <span style={{ fontWeight: 'bold', color: '#00E5FF', marginRight: '8px' }}>
                                                {comment.user.username}
                                              </span>
                                                {comment.text}
                                              </Typography>
                                            </ListItem>
                                        ))}
                                      </List>

                                      {/* Add Comment Input */}
                                      <Box sx={{ display: 'flex', mt: 1, gap: 1 }}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            placeholder="Write a comment..."
                                            value={commentText[activity.id] || ""}
                                            onChange={(e) => setCommentText({ ...commentText, [activity.id]: e.target.value })}
                                            sx={{
                                              '& .MuiOutlinedInput-root': {
                                                borderRadius: 4,
                                                bgcolor: 'rgba(255,255,255,0.03)',
                                                fontSize: '0.85rem'
                                              }
                                            }}
                                        />
                                        <Button
                                            variant="text"
                                            onClick={() => handleAddComment(activity.id)}
                                            sx={{ color: '#00E5FF', fontWeight: 'bold', textTransform: 'none' }}
                                        >
                                          Post
                                        </Button>
                                      </Box>
                                    </Box>
                                  </ListItem>
                                </Card>
                            );
                          })}
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