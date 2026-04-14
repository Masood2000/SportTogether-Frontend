import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Container, Paper, Typography, TextField, Button, Box,
    MenuItem, Select, InputLabel, FormControl, Alert
} from "@mui/material";

// Match these to the options in your Signup component
const SPORT_OPTIONS = ["TENNIS", "SOCCER", "BASKETBALL", "CRICKET", "RUNNING", "CYCLING", "SWIMMING", "BADMINTON"];

function LogActivity() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        sportType: "",
        durationMinutes: "",
        distanceKm: "",
        notes: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const response = await fetch("http://localhost:8080/api/activities", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    sportType: formData.sportType,
                    durationMinutes: parseInt(formData.durationMinutes),
                    distanceKm: parseFloat(formData.distanceKm) || 0, // Distance is optional
                    notes: formData.notes
                }),
                credentials: "include", // CRITICAL: send the session cookie!
            });

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => navigate("/home"), 1500); // Go back home after 1.5s
            } else {
                const errorText = await response.text();
                setError(errorText || "Failed to log activity.");
            }
        } catch (err) {
            console.error(err);
            setError("Network error.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ py: 5 }}>
            <Paper elevation={6} sx={{ p: 4, borderRadius: 3 }}>
                <Typography variant="h4" fontWeight="bold" color="primary" gutterBottom>
                    Log a Workout
                </Typography>

                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 2 }}>Activity logged successfully! Earning those calories...</Alert>}

                <Box component="form" onSubmit={handleSubmit}>
                    <FormControl fullWidth margin="normal" required>
                        <InputLabel>Sport Type</InputLabel>
                        <Select name="sportType" value={formData.sportType} onChange={handleChange} label="Sport Type">
                            {SPORT_OPTIONS.map((sport) => (
                                <MenuItem key={sport} value={sport}>{sport}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>

                    <TextField
                        margin="normal" required fullWidth label="Duration (minutes)" name="durationMinutes"
                        type="number" value={formData.durationMinutes} onChange={handleChange}
                        inputProps={{ min: 1 }}
                    />

                    <TextField
                        margin="normal" fullWidth label="Distance (km) - Optional" name="distanceKm"
                        type="number" value={formData.distanceKm} onChange={handleChange}
                        inputProps={{ step: "0.1", min: 0 }}
                    />

                    <TextField
                        margin="normal" fullWidth multiline rows={3} label="Notes / How did it feel?"
                        name="notes" value={formData.notes} onChange={handleChange}
                    />

                    <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                        <Button variant="outlined" fullWidth onClick={() => navigate("/home")}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" fullWidth disabled={isLoading}>
                            {isLoading ? "Saving..." : "Save Activity"}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}

export default LogActivity;