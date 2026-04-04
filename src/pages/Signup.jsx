import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Container,
  Grid,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  OutlinedInput,
  Chip,
  Alert
} from "@mui/material";

// Enums matching your Spring Boot backend
const SEX_OPTIONS = ["MALE", "FEMALE", "OTHER"];
const FITNESS_LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"];
const SPORT_OPTIONS = ["TENNIS", "SOCCER", "BASKETBALL", "CRICKET", "RUNNING", "CYCLING", "SWIMMING", "BADMINTON"];

function Signup() {
  const navigate = useNavigate();

  // Added error and loading states for a better user experience
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    age: "",
    height: "",
    weight: "",
    sex: "",
    fitnessLevel: "",
    sportPreferences: [],
    personalGoals: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSportChange = (event) => {
    const { target: { value } } = event;
    setFormData((prev) => ({
      ...prev,
      sportPreferences: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Connect to your Spring Boot backend
      // Make sure the port matches your application.properties (usually 8080)
      const response = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        // Convert the React state object directly into the JSON your @RequestBody expects
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        // If registration is successful (HTTP 200 OK), go to login
        navigate("/login");
      } else {
        // If the backend returns a Bad Request (e.g., "Username already taken")
        const errorText = await response.text();
        setError(errorText || "Registration failed. Please check your inputs.");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("Network error. Is the Spring Boot server running?");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="md" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
      <Paper elevation={6} sx={{ p: { xs: 3, md: 5 }, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h4" fontWeight="bold" gutterBottom color="primary">
          Create Account
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          Join Sport Together and find your team.
        </Typography>

        {/* Display backend errors here */}
        {error && (
          <Alert severity="error" sx={{ width: '100%', mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSignup} sx={{ width: '100%' }}>
          <Grid container spacing={2}>
            {/* Account Basics */}
            <Grid item xs={12} sm={6}>
              <TextField required fullWidth label="Full Name" name="name" value={formData.name} onChange={handleChange} autoFocus />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField required fullWidth label="Username" name="username" value={formData.username} onChange={handleChange} inputProps={{ minLength: 3, maxLength: 20 }} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField required fullWidth label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField required fullWidth label="Password" name="password" type="password" value={formData.password} onChange={handleChange} inputProps={{ minLength: 6 }} />
            </Grid>

            {/* Physical Attributes */}
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Age" name="age" type="number" value={formData.age} onChange={handleChange} inputProps={{ min: 10, max: 100 }} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Height (cm)" name="height" type="number" value={formData.height} onChange={handleChange} inputProps={{ step: "0.1", min: 0 }} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField fullWidth label="Weight (kg)" name="weight" type="number" value={formData.weight} onChange={handleChange} inputProps={{ step: "0.1", min: 0 }} />
            </Grid>

            {/* Demographics & Fitness */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Sex</InputLabel>
                <Select name="sex" value={formData.sex} onChange={handleChange} label="Sex">
                  {SEX_OPTIONS.map((option) => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Fitness Level</InputLabel>
                <Select name="fitnessLevel" value={formData.fitnessLevel} onChange={handleChange} label="Fitness Level">
                  {FITNESS_LEVELS.map((level) => (
                    <MenuItem key={level} value={level}>{level}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Sport Preferences */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Sport Preferences</InputLabel>
                <Select
                  multiple
                  name="sportPreferences"
                  value={formData.sportPreferences}
                  onChange={handleSportChange}
                  input={<OutlinedInput label="Sport Preferences" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} color="primary" variant="outlined" size="small" />
                      ))}
                    </Box>
                  )}
                >
                  {SPORT_OPTIONS.map((sport) => (
                    <MenuItem key={sport} value={sport}>{sport}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>

            {/* Personal Goals */}
            <Grid item xs={12}>
              <TextField fullWidth multiline rows={3} label="Personal Goals" name="personalGoals" value={formData.personalGoals} onChange={handleChange} inputProps={{ maxLength: 500 }} helperText={`${formData.personalGoals.length}/500`} />
            </Grid>
          </Grid>

          <Button type="submit" fullWidth variant="contained" size="large" disabled={isLoading} sx={{ mt: 4, mb: 2, py: 1.5 }}>
            {isLoading ? "Signing up..." : "Sign Up"}
          </Button>
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{" "}
              <Box component={Link} to="/login" sx={{ color: 'primary.main', textDecoration: 'none', '&:hover': { textDecoration: 'underline' } }}>
                Log In
              </Box>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}

export default Signup;