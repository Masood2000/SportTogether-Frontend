import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
    Container, Typography, Box, Card, List, ListItem,
    ListItemAvatar, Avatar, ListItemText, CircularProgress, Button, Paper,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem, Chip, Grid
} from "@mui/material";
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';
import AddIcon from '@mui/icons-material/Add';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

function ChallengesPage() { // <--- Renamed Component!
    const [challenges, setChallenges] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const [activeChallenge, setActiveChallenge] = useState(null);
    const [leaderboardData, setLeaderboardData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const [newChallenge, setNewChallenge] = useState({
        name: "", description: "", metric: "CALORIES", durationDays: 7
    });

    useEffect(() => {
        fetchCurrentUser();
        fetchAllChallenges();
    }, []);

    const fetchCurrentUser = async () => {
        const response = await fetch("http://localhost:8080/api/auth/me", { credentials: "include" });
        if (response.ok) setCurrentUser(await response.json());
    };

    const fetchAllChallenges = async () => {
        setIsLoading(true);
        try {
            const response = await fetch("http://localhost:8080/api/challenges", { credentials: "include" });
            if (response.ok) setChallenges(await response.json());
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateChallenge = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/challenges", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newChallenge),
                credentials: "include"
            });
            if (response.ok) {
                setIsCreateOpen(false);
                fetchAllChallenges(); // Refresh the list
            }
        } catch (err) { console.error("Create failed", err); }
    };

    const handleJoinChallenge = async (id) => {
        try {
            const response = await fetch(`http://localhost:8080/api/challenges/${id}/join`, {
                method: "POST",
                credentials: "include"
            });
            if (response.ok) fetchAllChallenges(); // Refresh to show "View Leaderboard" button
        } catch (err) { console.error("Join failed", err); }
    };

    const viewLeaderboard = async (challenge) => {
        setActiveChallenge(challenge);
        setLeaderboardData([]);
        setIsLoading(true);
        try {
            const response = await fetch(`http://localhost:8080/api/challenges/${challenge.id}/leaderboard`, { credentials: "include" });
            if (response.ok) setLeaderboardData(await response.json());
        } catch (err) { console.error("Fetch leaderboard failed", err); }
        finally { setIsLoading(false); }
    };

    const getRankColor = (index) => {
        if (index === 0) return "#FFD700"; // Gold
        if (index === 1) return "#C0C0C0"; // Silver
        if (index === 2) return "#CD7F32"; // Bronze
        return "transparent";
    };

    const getMetricLabel = (metric) => {
        if (metric === "CALORIES") return "kcal";
        if (metric === "DURATION") return "mins";
        if (metric === "DISTANCE") return "km";
        return "";
    };

    // --- VIEW 1: RENDER SPECIFIC CHALLENGE LEADERBOARD ---
    if (activeChallenge) {
        return (
            <Container maxWidth="sm" sx={{ mt: 5, mb: 8 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Button startIcon={<ArrowBackIcon />} onClick={() => setActiveChallenge(null)} sx={{ color: 'text.secondary' }}>
                        All Challenges
                    </Button>
                </Box>
                <Typography variant="h3" sx={{
                    background: "linear-gradient(45deg, #FFD700 30%, #FF8C00 90%)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 'bold', mb: 1
                }}>
                    {activeChallenge.name}
                </Typography>
                <Typography variant="subtitle1" color="text.secondary" gutterBottom sx={{ mb: 4 }}>
                    Ranked by {activeChallenge.metric} • Ends {new Date(activeChallenge.endDate).toLocaleDateString()}
                </Typography>

                {isLoading ? <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box> : (
                    <Paper elevation={0} sx={{ bgcolor: 'transparent' }}>
                        {leaderboardData.length === 0 ? (
                            <Typography textAlign="center" color="text.secondary">No activities logged yet! Be the first!</Typography>
                        ) : (
                            <List sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {leaderboardData.map((entry, index) => (
                                    <Card key={entry.userId} elevation={0} sx={{
                                        bgcolor: 'background.paper', borderRadius: 4,
                                        border: index < 3 ? `2px solid ${getRankColor(index)}` : '1px solid rgba(255,255,255,0.05)',
                                        boxShadow: index === 0 ? "0 0 20px rgba(255, 215, 0, 0.2)" : "none"
                                    }}>
                                        <ListItem sx={{ py: 2 }}>
                                            <Box sx={{ mr: 2, display: 'flex', alignItems: 'center', width: 30 }}>
                                                <Typography variant="h5" fontWeight="bold">{index + 1}</Typography>
                                            </Box>
                                            <ListItemAvatar>
                                                <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                                                    <Avatar sx={{ width: 50, height: 50, bgcolor: 'rgba(255,255,255,0.1)' }}>{entry.name[0]}</Avatar>
                                                    {index < 3 && <Box sx={{ position: 'absolute', bottom: -5, right: -5 }}><WorkspacePremiumIcon sx={{ color: getRankColor(index) }} /></Box>}
                                                </Box>
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={<Typography variant="h6" fontWeight="bold">{entry.name}</Typography>}
                                                secondary={<Typography variant="body2" color="primary">{Math.round(entry.score)} {getMetricLabel(activeChallenge.metric)}</Typography>}
                                            />
                                            {index === 0 && <EmojiEventsIcon sx={{ color: "#FFD700", fontSize: 40 }} />}
                                        </ListItem>
                                    </Card>
                                ))}
                            </List>
                        )}
                    </Paper>
                )}
            </Container>
        );
    }

    // --- VIEW 2: RENDER CHALLENGE HUB LIST ---
    return (
        <Container maxWidth="md" sx={{ mt: 5, mb: 8 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
                <Typography variant="h3" sx={{
                    background: "linear-gradient(45deg, #00E5FF 30%, #A020F0 90%)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", fontWeight: 'bold'
                }}>
                    Challenges
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => setIsCreateOpen(true)} sx={{ bgcolor: '#A020F0', '&:hover': { bgcolor: '#8a19d6' }, borderRadius: 8 }}>
                        Create
                    </Button>
                    <Button variant="outlined" component={Link} to="/home" sx={{ borderRadius: 8 }}>Back</Button>
                </Box>
            </Box>

            {isLoading ? <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}><CircularProgress /></Box> : (
                <Grid container spacing={3}>
                    {challenges.map(challenge => {
                        // Check if the current user is already in this challenge
                        const isParticipating = currentUser && challenge.participants.some(p => p.id === currentUser.id);

                        return (
                            <Grid item xs={12} sm={6} key={challenge.id}>
                                <Card elevation={0} sx={{ bgcolor: 'background.paper', borderRadius: 4, border: '1px solid rgba(255,255,255,0.05)' }}>
                                    <Box sx={{ p: 3 }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                            <Typography variant="h6" fontWeight="bold">{challenge.name}</Typography>
                                            <Chip size="small" label={challenge.metric} color="primary" variant="outlined" />
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{challenge.description}</Typography>
                                        <Typography variant="caption" display="block" sx={{ mb: 2 }}>
                                            Ends: {new Date(challenge.endDate).toLocaleDateString()} • {challenge.participants.length} Participants
                                        </Typography>

                                        {isParticipating ? (
                                            <Button fullWidth variant="outlined" color="primary" onClick={() => viewLeaderboard(challenge)}>
                                                View Leaderboard
                                            </Button>
                                        ) : (
                                            <Button fullWidth variant="contained" color="primary" startIcon={<GroupAddIcon />} onClick={() => handleJoinChallenge(challenge.id)}>
                                                Join Challenge
                                            </Button>
                                        )}
                                    </Box>
                                </Card>
                            </Grid>
                        );
                    })}
                    {challenges.length === 0 && (
                        <Grid item xs={12}>
                            <Typography textAlign="center" color="text.secondary" sx={{ mt: 4 }}>
                                No active challenges right now. Be the first to create one!
                            </Typography>
                        </Grid>
                    )}
                </Grid>
            )}

            {/* CREATE CHALLENGE MODAL */}
            <Dialog open={isCreateOpen} onClose={() => setIsCreateOpen(false)} PaperProps={{ sx: { bgcolor: 'background.default', borderRadius: 4, p: 2, minWidth: '400px' } }}>
                <DialogTitle sx={{ fontWeight: 'bold', color: '#00E5FF' }}>Create a New Challenge</DialogTitle>
                <DialogContent>
                    <TextField fullWidth label="Challenge Name" margin="normal" value={newChallenge.name} onChange={(e) => setNewChallenge({...newChallenge, name: e.target.value})} placeholder="e.g., April Distance Challenge" />
                    <TextField fullWidth label="Description" margin="normal" multiline rows={2} value={newChallenge.description} onChange={(e) => setNewChallenge({...newChallenge, description: e.target.value})} />
                    <TextField fullWidth select label="Target Metric" margin="normal" value={newChallenge.metric} onChange={(e) => setNewChallenge({...newChallenge, metric: e.target.value})}>
                        <MenuItem value="CALORIES">Total Calories Burned</MenuItem>
                        <MenuItem value="DURATION">Total Duration (Minutes)</MenuItem>
                        <MenuItem value="DISTANCE">Total Distance (km)</MenuItem>
                    </TextField>
                    <TextField fullWidth label="Duration (Days)" type="number" margin="normal" value={newChallenge.durationDays} onChange={(e) => setNewChallenge({...newChallenge, durationDays: parseInt(e.target.value)})} />
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setIsCreateOpen(false)} color="error">Cancel</Button>
                    <Button onClick={handleCreateChallenge} variant="contained" color="primary" sx={{ borderRadius: 4 }}>Launch Challenge</Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
}

export default ChallengesPage; // <--- Exporting with new name