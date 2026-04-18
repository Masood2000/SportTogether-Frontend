import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
    Container, Typography, Box, Grid, Chip, Button,
    CircularProgress, Divider, Avatar, Tooltip, Card, CardContent
} from "@mui/material";



// Icons
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarIcon from '@mui/icons-material/Star';
import SportsScoreIcon from '@mui/icons-material/SportsScore';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';

import ActivityCard from "../components/ActivityCard"; // Adjust path if needed

function FriendProfilePage() {
    const { userId } = useParams(); // Gets the ID from the URL (/profile/1)
    const navigate = useNavigate();

    const [profileUser, setProfileUser] = useState(null);
    const [achievements, setAchievements] = useState([]);
    const [activities, setActivities] = useState([]);
    const [currentUser, setCurrentUser] = useState(null); // Needed for Kudo functionality
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchAllData = async () => {
            setIsLoading(true);
            try {
                // Fetch Current Logged-in User (For Kudos)
                const meRes = await fetch("http://localhost:8080/api/auth/me", { credentials: "include" });
                if (meRes.ok) setCurrentUser(await meRes.json());

                // Fetch Friend's Profile Data
                const profileRes = await fetch(`http://localhost:8080/api/auth/user/${userId}`, { credentials: "include" });
                if (!profileRes.ok) throw new Error("User not found");
                setProfileUser(await profileRes.json());

                // Fetch Friend's Badges & Activities
                const [achieveRes, actRes] = await Promise.all([
                    fetch(`http://localhost:8080/api/achievements/user/${userId}`, { credentials: "include" }),
                    fetch(`http://localhost:8080/api/activities/user/${userId}`, { credentials: "include" })
                ]);

                if (achieveRes.ok) setAchievements(await achieveRes.json());
                if (actRes.ok) setActivities(await actRes.json());

                // eslint-disable-next-line no-unused-vars
            } catch (err) {
                setError("Failed to load profile. They might not exist!");
            } finally {
                setIsLoading(false);
            }
        };
        fetchAllData();
    }, [userId]);

    const handleToggleKudo = async (activityId) => {
        try {
            const res = await fetch(`http://localhost:8080/api/activities/${activityId}/kudo`, { method: "POST", credentials: "include" });
            if (res.ok) {
                // Refresh activities to show new Kudo count
                const actRes = await fetch(`http://localhost:8080/api/activities/user/${userId}`, { credentials: "include" });
                if (actRes.ok) setActivities(await actRes.json());
            }
        } catch (err) { console.error(err); }
    };

    const handleAddComment = async (activityId, text) => {
        try {
            const res = await fetch(`http://localhost:8080/api/comments/${activityId}`, {
                method: "POST", headers: { "Content-Type": "text/plain" }, body: text, credentials: "include"
            });
            if (res.ok) {
                const actRes = await fetch(`http://localhost:8080/api/activities/user/${userId}`, { credentials: "include" });
                if (actRes.ok) setActivities(await actRes.json());
            }
        } catch (err) { console.error(err); }
    };

    const renderBadgeIcon = (iconType) => {
        switch (iconType) {
            case 'DISTANCE': return <DirectionsRunIcon sx={{ fontSize: 40, color: '#00E5FF' }} />;
            case 'FIRE': return <LocalFireDepartmentIcon sx={{ fontSize: 40, color: '#FF2A5F' }} />;
            case 'STAR': return <StarIcon sx={{ fontSize: 40, color: '#FFD700' }} />;
            default: return <SportsScoreIcon sx={{ fontSize: 40, color: '#A020F0' }} />;
        }
    };

    if (isLoading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;
    if (error) return <Typography color="error" align="center" sx={{ mt: 10 }}>{error}</Typography>;

    return (
        <Container maxWidth="md" sx={{ py: 5, mb: 8 }}>
            <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ color: 'text.secondary', mb: 2 }}>
                Back
            </Button>

            {/* Profile Identity */}
            <Card elevation={0} sx={{ bgcolor: 'background.paper', borderRadius: 4, border: '1px solid rgba(255,255,255,0.05)', mb: 4, p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, flexWrap: 'wrap' }}>
                    <Avatar sx={{ width: 100, height: 100, bgcolor: 'primary.main', fontSize: '3rem', fontWeight: 'bold' }}>
                        {profileUser.name[0].toUpperCase()}
                    </Avatar>
                    <Box>
                        <Typography variant="h4" fontWeight="bold" color="white">{profileUser.name}</Typography>
                        <Typography variant="h6" sx={{ color: '#A020F0', mb: 1 }}>@{profileUser.username}</Typography>
                        <Chip label={profileUser.fitnessLevel || "Athlete"} color="primary" variant="outlined" />
                    </Box>
                </Box>
            </Card>

            {/* Trophy Cabinet */}
            {achievements.length > 0 && (
                <Box sx={{ mb: 4, p: 3, bgcolor: 'rgba(255, 215, 0, 0.05)', borderRadius: 4, border: '1px solid rgba(255, 215, 0, 0.2)' }}>
                    <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#FFD700', display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmojiEventsIcon /> Trophy Cabinet
                    </Typography>
                    <Grid container spacing={2}>
                        {achievements.map((badge) => (
                            <Grid item xs={4} sm={3} md={2} key={badge.id}>
                                <Tooltip title={badge.description} arrow placement="top">
                                    <Box sx={{
                                        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                                        p: 2, bgcolor: 'background.paper', borderRadius: 3, border: '1px solid rgba(255, 215, 0, 0.2)'
                                    }}>
                                        <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.05)', width: 60, height: 60, mb: 1 }}>
                                            {renderBadgeIcon(badge.iconType)}
                                        </Avatar>
                                        <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'white' }}>{badge.name}</Typography>
                                    </Box>
                                </Tooltip>
                            </Grid>
                        ))}
                    </Grid>
                </Box>
            )}

            {/* Activity Feed */}
            <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: 'white' }}>{profileUser.name}'s Workouts</Typography>
            {activities.length === 0 ? (
                <Typography color="text.secondary">No workouts logged yet.</Typography>
            ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    {activities.map((activity) => (
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
        </Container>
    );
}

export default FriendProfilePage;