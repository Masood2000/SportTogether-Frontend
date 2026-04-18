import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box, Button, TextField, Typography, Paper, Container, Grid,
  MenuItem, Select, InputLabel, FormControl, OutlinedInput, Chip, Alert
} from "@mui/material";

const SEX_OPTIONS = ["MALE", "FEMALE", "OTHER"];
const FITNESS_LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"];
const SPORT_OPTIONS = ["TENNIS", "FOOTBALL", "BASKETBALL", "CRICKET", "RUNNING", "CYCLING", "SWIMMING", "BADMINTON"];

function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "", username: "", email: "", password: "", age: "", height: "", weight: "", sex: "", fitnessLevel: "", sportPreferences: [], personalGoals: ""
  });

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSportChange = (e) => setFormData((prev) => ({ ...prev, sportPreferences: typeof e.target.value === 'string' ? e.target.value.split(',') : e.target.value }));

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(""); setIsLoading(true);
    const cleanedData = {
      ...formData,
      age: formData.age === "" ? null : parseInt(formData.age, 10),
      height: formData.height === "" ? null : parseFloat(formData.height),
      weight: formData.weight === "" ? null : parseFloat(formData.weight),
      sportPreferences: formData.sportPreferences.length > 0 ? formData.sportPreferences : []
    };

    try {
      const response = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(cleanedData),
      });
      if (response.ok) navigate("/login");
      else setError(await response.text() || "Registration failed.");
    } catch (err) { setError("Network error."); }
    finally { setIsLoading(false); }
  };

  return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 5, background: 'radial-gradient(circle at top left, #08203e 0%, #0A0A0F 100%)' }}>
        <Container component="main" maxWidth="md">
          <Paper elevation={24} sx={{
            p: { xs: 3, md: 5 }, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center',
            bgcolor: 'rgba(20, 20, 30, 0.7)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 4
          }}>
            <Typography component="h1" variant="h3" fontWeight="bold" gutterBottom sx={{ color: '#00E5FF' }}>
              Create Account
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              Join Sport Together and find your team.
            </Typography>

            {error && <Alert severity="error" sx={{ width: '100%', mb: 3 }}>{error}</Alert>}

            <Box component="form" onSubmit={handleSignup} sx={{ width: '100%' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}><TextField required fullWidth label="Full Name" name="name" onChange={handleChange} /></Grid>
                <Grid item xs={12} sm={6}><TextField required fullWidth label="Username" name="username" onChange={handleChange} /></Grid>
                <Grid item xs={12} sm={6}><TextField required fullWidth label="Email Address" name="email" type="email" onChange={handleChange} /></Grid>
                <Grid item xs={12} sm={6}><TextField required fullWidth label="Password" name="password" type="password" onChange={handleChange} /></Grid>

                <Grid item xs={12} sm={4}><TextField fullWidth label="Age" name="age" type="number" onChange={handleChange} /></Grid>
                <Grid item xs={12} sm={4}><TextField fullWidth label="Height (cm)" name="height" type="number" onChange={handleChange} /></Grid>
                <Grid item xs={12} sm={4}><TextField fullWidth label="Weight (kg)" name="weight" type="number" onChange={handleChange} /></Grid>

                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Sex</InputLabel>
                    <Select name="sex" value={formData.sex} onChange={handleChange} label="Sex">
                      {SEX_OPTIONS.map((opt) => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth>
                    <InputLabel>Fitness Level</InputLabel>
                    <Select name="fitnessLevel" value={formData.fitnessLevel} onChange={handleChange} label="Fitness Level">
                      {FITNESS_LEVELS.map((level) => <MenuItem key={level} value={level}>{level}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Sport Preferences</InputLabel>
                    <Select multiple name="sportPreferences" value={formData.sportPreferences} onChange={handleSportChange} input={<OutlinedInput label="Sport Preferences" />}
                            renderValue={(selected) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                  {selected.map((val) => <Chip key={val} label={val} sx={{ bgcolor: 'rgba(0, 229, 255, 0.1)', color: '#00E5FF' }} size="small" />)}
                                </Box>
                            )}>
                      {SPORT_OPTIONS.map((sport) => <MenuItem key={sport} value={sport}>{sport}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12}>
                  <TextField fullWidth multiline rows={3} label="Personal Goals" name="personalGoals" onChange={handleChange} />
                </Grid>
              </Grid>

              <Button type="submit" fullWidth variant="contained" disabled={isLoading} sx={{
                mt: 5, mb: 3, py: 1.5, borderRadius: 8, bgcolor: '#00E5FF', color: 'black', fontWeight: 'bold', fontSize: '1.1rem',
                '&:hover': { bgcolor: '#00B3CC', boxShadow: '0 0 15px rgba(0, 229, 255, 0.4)' }
              }}>
                {isLoading ? "Signing up..." : "Sign Up"}
              </Button>

              <Typography variant="body2" color="text.secondary" align="center">
                Already have an account?{" "}
                <Box component={Link} to="/login" sx={{ color: '#A020F0', textDecoration: 'none', fontWeight: 'bold', '&:hover': { textDecoration: 'underline' } }}>
                  Log In
                </Box>
              </Typography>
            </Box>
          </Paper>
        </Container>
      </Box>
  );
}

export default Signup;