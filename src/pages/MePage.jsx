import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Container,
    Paper,
    Typography,
    Box,
    Grid,
    Chip,
    Button,
    CircularProgress,
    Divider
} from "@mui/material";

function MePage({ onLogout }) {
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/auth/me", {
                    method: "GET",
                    credentials: "include", // CRITICAL to send the session cookie
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserData(data);
                } else {
                    setError("Failed to load profile. Please log in again.");
                }
            } catch (err) {
                console.error("Profile fetch error:", err);
                setError("Network error. Could not connect to server.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);

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
        <Container maxWidth="md" sx={{ py: 5 }}>
            <Paper elevation={6} sx={{ p: { xs: 3, md: 5 }, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                    <Typography variant="h4" fontWeight="bold" color="primary">
                        My Profile
                    </Typography>
                    <Button variant="outlined" component={Link} to="/home">
                        Back to Home
                    </Button>
                </Box>

                <Divider sx={{ mb: 4 }} />

                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                        <Typography variant="h6" gutterBottom>{userData.name || "N/A"}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Username</Typography>
                        <Typography variant="h6" gutterBottom>@{userData.username || "N/A"}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                        <Typography variant="h6" gutterBottom>{userData.email || "N/A"}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary">Sex</Typography>
                        <Typography variant="h6" gutterBottom>{userData.sex || "N/A"}</Typography>
                    </Grid>

                    <Grid item xs={12}><Divider sx={{ my: 1 }} /></Grid>

                    <Grid item xs={4}>
                        <Typography variant="subtitle2" color="text.secondary">Age</Typography>
                        <Typography variant="h6">{userData.age ? `${userData.age} yrs` : "N/A"}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant="subtitle2" color="text.secondary">Height</Typography>
                        <Typography variant="h6">{userData.height ? `${userData.height} cm` : "N/A"}</Typography>
                    </Grid>
                    <Grid item xs={4}>
                        <Typography variant="subtitle2" color="text.secondary">Weight</Typography>
                        <Typography variant="h6">{userData.weight ? `${userData.weight} kg` : "N/A"}</Typography>
                    </Grid>

                    <Grid item xs={12}><Divider sx={{ my: 1 }} /></Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>Fitness Level</Typography>
                        <Chip label={userData.fitnessLevel || "N/A"} color="secondary" variant="outlined" />
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <Typography variant="subtitle2" color="text.secondary" gutterBottom>Sports</Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                            {userData.sportPreferences && userData.sportPreferences.length > 0 ? (
                                userData.sportPreferences.map(sport => (
                                    <Chip key={sport} label={sport} color="primary" size="small" />
                                ))
                            ) : (
                                <Typography variant="body1">None selected</Typography>
                            )}
                        </Box>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>Personal Goals</Typography>
                        <Typography variant="body1" sx={{ mt: 1, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                            {userData.personalGoals || "No goals set yet."}
                        </Typography>
                    </Grid>
                </Grid>

                <Box sx={{ mt: 5, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        color="error"
                        variant="text"
                        onClick={() => {
                            onLogout();
                            navigate("/login");
                        }}
                    >
                        Log Out
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}

export default MePage;