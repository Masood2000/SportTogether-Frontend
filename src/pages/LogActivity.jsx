import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Paper, Typography, TextField, Button, Box, MenuItem, Select, InputLabel, FormControl, Alert, Grid } from "@mui/material";
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

const SPORT_OPTIONS = ["TENNIS", "FOOTBALL", "BASKETBALL", "CRICKET", "RUNNING", "CYCLING", "SWIMMING", "BADMINTON"];

function LogActivity() {
    const navigate = useNavigate();
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({ sportType: "", durationMinutes: "", distanceKm: "", notes: "" });

    const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); setIsLoading(true);


        try {
            const response = await fetch("http://localhost:8080/api/activities", {
                method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
                body: JSON.stringify({
                    sportType: formData.sportType,
                    durationMinutes: parseInt(formData.durationMinutes),
                    distanceKm: parseFloat(formData.distanceKm) || 0,
                    notes: formData.notes
                }),
            });

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => navigate("/home"), 1500);
            } else setError(await response.text() || "Failed to log activity.");
            // eslint-disable-next-line no-unused-vars
        } catch (err) { setError("Network error."); }
        finally { setIsLoading(false); }
    };

    return (
        <Container maxWidth="sm" sx={{ py: 8 }}>
            <Paper elevation={0} sx={{
                p: { xs: 3, sm: 5 }, borderRadius: 4, bgcolor: 'background.paper',
                border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
            }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
                    <Box sx={{ p: 1.5, borderRadius: 3, bgcolor: 'rgba(255, 42, 95, 0.1)', color: '#FF2A5F', display: 'flex' }}>
                        <FitnessCenterIcon fontSize="large" />
                    </Box>
                    <Typography variant="h4" fontWeight="bold" sx={{ color: 'white' }}>
                        Log a Workout
                    </Typography>
                </Box>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 3 }}>Activity logged successfully! Computing calories and weather...</Alert>}

                <Box component="form" onSubmit={handleSubmit}>
                    <FormControl fullWidth margin="normal" required>
                        <InputLabel>Sport Type</InputLabel>
                        <Select name="sportType" value={formData.sportType} onChange={handleChange} label="Sport Type">
                            {SPORT_OPTIONS.map((sport) => <MenuItem key={sport} value={sport}>{sport}</MenuItem>)}
                        </Select>
                    </FormControl>

                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField margin="normal" required fullWidth label="Duration (mins)" name="durationMinutes" type="number" onChange={handleChange} inputProps={{ min: 1 }} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField margin="normal" fullWidth label="Distance (km) - Optional" name="distanceKm" type="number" onChange={handleChange} inputProps={{ step: "0.1", min: 0 }} />
                        </Grid>
                    </Grid>

                    <TextField margin="normal" fullWidth multiline rows={4} label="Notes / How did it feel?" name="notes" onChange={handleChange} />

                    <Box sx={{ display: 'flex', gap: 2, mt: 5 }}>
                        <Button variant="outlined" fullWidth onClick={() => navigate("/home")} sx={{ borderRadius: 8, color: 'text.secondary', borderColor: 'rgba(255,255,255,0.2)' }}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" fullWidth disabled={isLoading} sx={{
                            borderRadius: 8, bgcolor: '#FF2A5F', color: 'white', fontWeight: 'bold',
                            '&:hover': { bgcolor: '#e01e50', boxShadow: '0 0 15px rgba(255, 42, 95, 0.4)' }
                        }}>
                            {isLoading ? "Saving..." : "Save Activity"}
                        </Button>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}

export default LogActivity;