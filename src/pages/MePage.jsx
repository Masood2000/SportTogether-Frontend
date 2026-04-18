import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Container, Paper, Typography, Box, Grid, Chip, Button,
    CircularProgress, Divider, Avatar, Tooltip, Card, CardContent
} from "@mui/material";

// Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarIcon from '@mui/icons-material/Star';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

function MePage({ onLogout }) {
    const [userData, setUserData] = useState(null);
    const [myAchievements, setMyAchievements] = useState([]); // State for badges
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const loadProfileData = async () => {
            try {
                // Fetch both Profile AND Achievements at the same time
                const [profileRes, achievementsRes] = await Promise.all([
                    fetch("http://localhost:8080/api/auth/me", { credentials: "include" }),
                    fetch("http://localhost:8080/api/achievements/me", { credentials: "include" })
                ]);

                if (profileRes.ok) {
                    setUserData(await profileRes.json());
                } else {
                    setError("Failed to load profile. Please log in again.");
                }

                if (achievementsRes.ok) {
                    setMyAchievements(await achievementsRes.json());
                }
            } catch (err) {
                console.error("Profile fetch error:", err);
                setError("Network error. Could not connect to server.");
            } finally {
                setIsLoading(false);
            }
        };

        loadProfileData();
    }, []);

    const renderBadgeIcon = (iconType) => {
        switch (iconType) {
            case 'DISTANCE': return <DirectionsRunIcon sx={{ fontSize: 40, color: '#00E5FF' }} />;
            case 'FIRE': return <LocalFireDepartmentIcon sx={{ fontSize: 40, color: '#FF2A5F' }} />;
            case 'STAR': return <StarIcon sx={{ fontSize: 40, color: '#FFD700' }} />;
            default: return <SportsScoreIcon sx={{ fontSize: 40, color: '#A020F0' }} />;
        }
    };

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress color="primary" />
            </Box>
        );
    }

    if (error || !userData) {
        return (
            <Container sx={{ mt: 5, textAlign: "center" }}>
                <Typography color="error" variant="h6">{error}</Typography>
                <Button component={Link} to="/login" sx={{ mt: 2 }} variant="contained">
                    Go to Login
                </Button>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 5, mb: 8 }}>

            {/* Header Navigation */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h3" sx={{
                    background: "linear-gradient(45deg, #00E5FF 30%, #A020F0 90%)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 'bold'
                }}>
                    My Profile
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="outlined" component={Link} to="/home" startIcon={<ArrowBackIcon />} sx={{ borderRadius: 8 }}>
                        Dashboard
                    </Button>
                    <Button variant="text" color="error" onClick={() => { onLogout(); navigate("/login"); }}>
                        Log Out
                    </Button>
                </Box>
            </Box>

            {/* Profile Identity Section */}
            <Card elevation={0} sx={{ bgcolor: 'background.paper', borderRadius: 4, border: '1px solid rgba(255,255,255,0.05)', mb: 4, p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                    <Avatar sx={{ width: 100, height: 100, bgcolor: 'primary.main', fontSize: '3rem', fontWeight: 'bold' }}>
                        {userData.name[0].toUpperCase()}
                    </Avatar>
                    <Box>
                        <Typography variant="h4" fontWeight="bold" color="white">
                            {userData.name}
                        </Typography>
                        <Typography variant="h6" sx={{ color: '#A020F0', mb: 1 }}>
                            @{userData.username}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {userData.email} • {userData.sex || "Not specified"}
                        </Typography>
                        <Chip label={userData.fitnessLevel || "N/A"} color="primary" variant="outlined" sx={{ mt: 1 }} />
                    </Box>
                </Box>
            </Card>

            {/* NEW SECTION: TROPHY CABINET */}
            {myAchievements.length > 0 && (
                <Box sx={{ mb: 4, p: 3, bgcolor: 'rgba(255, 215, 0, 0.05)', borderRadius: 4, border: '1px solid rgba(255, 215, 0, 0.2)' }}>
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

            {/* Physical Stats Grid */}
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: 'white' }}>Physical Stats</Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {[
                    { label: "Age", value: userData.age ? `${userData.age} yrs` : "N/A", color: "#00E5FF" },
                    { label: "Height", value: userData.height ? `${userData.height} cm` : "N/A", color: "#A020F0" },
                    { label: "Weight", value: userData.weight ? `${userData.weight} kg` : "N/A", color: "#FF2A5F" }
                ].map((stat, idx) => (
                    <Grid item xs={12} sm={4} key={idx}>
                        <Card elevation={0} sx={{ bgcolor: 'background.paper', textAlign: 'center', py: 2, border: '1px solid rgba(255,255,255,0.05)' }}>
                            <CardContent sx={{ pb: "16px !important" }}>
                                <Typography variant="h4" fontWeight="bold" sx={{ color: stat.color }}>{stat.value}</Typography>
                                <Typography variant="subtitle2" sx={{ color: 'text.secondary', textTransform: 'uppercase', letterSpacing: 1, mt: 1 }}>{stat.label}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Preferences & Goals */}
            <Card elevation={0} sx={{ bgcolor: 'background.paper', borderRadius: 4, border: '1px solid rgba(255,255,255,0.05)', p: 3 }}>
                <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 'bold' }}>Sport Preferences</Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 4 }}>
                    {userData.sportPreferences && userData.sportPreferences.length > 0 ? (
                        userData.sportPreferences.map(sport => (
                            <Chip key={sport} label={sport} sx={{ bgcolor: 'rgba(0, 229, 255, 0.1)', color: '#00E5FF', border: '1px solid rgba(0, 229, 255, 0.3)' }} variant="outlined" />
                        ))
                    ) : (
                        <Typography variant="body2" color="text.secondary">No sports selected.</Typography>
                    )}
                </Box>

                <Divider sx={{ mb: 3, borderColor: 'rgba(255,255,255,0.05)' }} />

                <Typography variant="h6" sx={{ color: 'white', mb: 1, fontWeight: 'bold' }}>Personal Goals</Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', fontStyle: 'italic', pl: 2, borderLeft: '3px solid #A020F0' }}>
                    "{userData.personalGoals || "No goals set yet. Time to dream big!"}"
                </Typography>
            </Card>

        </Container>
    );
}

export default MePage;