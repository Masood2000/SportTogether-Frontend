import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Container, Typography, Box, Card, List, ListItem,
    ListItemAvatar, Avatar, ListItemText, CircularProgress, Button, Paper
} from "@mui/material";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'; // Trophy icon
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium'; // Medal icon

function LeaderboardPage() {
    const [rankings, setRankings] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/leaderboard/friends", {
                    credentials: "include"
                });
                if (response.ok) {
                    const data = await response.json();
                    setRankings(data);
                }
            } catch (err) {
                console.error("Leaderboard fetch failed", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchLeaderboard();
    }, []);

    const getRankColor = (index) => {
        if (index === 0) return "#FFD700"; // Gold
        if (index === 1) return "#C0C0C0"; // Silver
        if (index === 2) return "#CD7F32"; // Bronze
        return "transparent";
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 5, mb: 8 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h3" sx={{
                    background: "linear-gradient(45deg, #FFD700 30%, #FF8C00 90%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontWeight: 'bold'
                }}>
                    Leaderboard
                </Typography>
                <Button variant="outlined" component={Link} to="/home" sx={{ borderRadius: 8 }}>Back</Button>
            </Box>

            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                Top Athletes (Last 7 Days)
            </Typography>

            {isLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box>
            ) : (
                <Paper elevation={0} sx={{ bgcolor: 'transparent' }}>
                    <List sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                        {rankings.map((entry, index) => (
                            <Card key={entry.userId} elevation={0} sx={{
                                bgcolor: 'background.paper',
                                borderRadius: 4,
                                border: index < 3 ? `2px solid ${getRankColor(index)}` : '1px solid rgba(255,255,255,0.05)',
                                boxShadow: index === 0 ? "0 0 20px rgba(255, 215, 0, 0.2)" : "none"
                            }}>
                                <ListItem sx={{ py: 2 }}>
                                    <Box sx={{ mr: 2, display: 'flex', alignItems: 'center', width: 30 }}>
                                        <Typography variant="h5" fontWeight="bold">
                                            {index + 1}
                                        </Typography>
                                    </Box>

                                    <ListItemAvatar>
                                        <Badge
                                            overlap="circular"
                                            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                            badgeContent={index < 3 ? <WorkspacePremiumIcon sx={{ color: getRankColor(index) }} /> : null}
                                        >
                                            <Avatar sx={{ width: 50, height: 50, bgcolor: 'rgba(255,255,255,0.1)' }}>
                                                {entry.name[0]}
                                            </Avatar>
                                        </Badge>
                                    </ListItemAvatar>

                                    <ListItemText
                                        primary={<Typography variant="h6" fontWeight="bold">{entry.name}</Typography>}
                                        secondary={<Typography variant="body2" color="primary">{Math.round(entry.totalCalories)} kcal</Typography>}
                                    />

                                    {index === 0 && <EmojiEventsIcon sx={{ color: "#FFD700", fontSize: 40 }} />}
                                </ListItem>
                            </Card>
                        ))}
                    </List>
                </Paper>
            )}
        </Container>
    );
}

// Simple Badge component if not using MUI standard
const Badge = ({ children, badgeContent }) => (
    <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        {children}
        <Box sx={{ position: 'absolute', bottom: 0, right: 0 }}>{badgeContent}</Box>
    </Box>
);

export default LeaderboardPage;