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

// Options matching your Spring Boot backend enums
const SEX_OPTIONS = ["MALE", "FEMALE", "OTHER"];
const FITNESS_LEVELS = ["BEGINNER", "INTERMEDIATE", "ADVANCED", "EXPERT"];
// Change "SOCCER" to "FOOTBALL" to match your Java SportPreference enum
const SPORT_OPTIONS = ["TENNIS", "FOOTBALL", "BASKETBALL", "CRICKET", "RUNNING", "CYCLING", "SWIMMING", "BADMINTON"];
function Signup() {

  const navigate = useNavigate();
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

    const cleanedData = {
      ...formData,
      age: formData.age === "" ? null : parseInt(formData.age, 10),
      height: formData.height === "" ? null : parseFloat(formData.height),
      weight: formData.weight === "" ? null : parseFloat(formData.weight),
      sportPreferences: formData.sportPreferences.length > 0 ? formData.sportPreferences : []
    };

    try {
      const response = await fetch("http://localhost:8080/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cleanedData),
      });


      console.log(response.formData())
      // Check if the request was successful
      if (response.ok) {
        navigate("/login");
        return; // Stop execution here
      }

      // If we reach here, there was an error (400, 500, etc.)
      // We read the body ONCE here
      const errorData = await response.text();
      setError(errorData || "Registration failed. Please check your inputs.");

    } catch (err) {
      console.error("Signup error:", err);
      setError("Network error. Is the Spring Boot server running?");
    } finally {
      setIsLoading(false);
    }
  };

  return (
      <Container component="main" maxWidth="md" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', py: 4 }}>
        <Paper elevation={6} sx={{ p: { xs: 3, md: 5 }, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 4 }}>
          <Typography component="h1" variant="h4" fontWeight="bold" gutterBottom color="primary">
            Create Account
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
            Join Sport Together and find your team.
          </Typography>

          {error && (
              <Alert severity="error" sx={{ width: '100%', mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
          )}

          <Box component="form" onSubmit={handleSignup} sx={{ width: '100%' }}>
            <Grid container spacing={2}>
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

              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Age" name="age" type="number" value={formData.age} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Height (cm)" name="height" type="number" value={formData.height} onChange={handleChange} />
              </Grid>
              <Grid item xs={12} sm={4}>
                <TextField fullWidth label="Weight (kg)" name="weight" type="number" value={formData.weight} onChange={handleChange} />
              </Grid>

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

              <Grid item xs={12}>
                <TextField fullWidth multiline rows={3} label="Personal Goals" name="personalGoals" value={formData.personalGoals} onChange={handleChange} inputProps={{ maxLength: 500 }} helperText={`${formData.personalGoals.length}/500`} />
              </Grid>
            </Grid>

            <Button type="submit" fullWidth variant="contained" size="large" disabled={isLoading} sx={{ mt: 4, mb: 2, py: 1.5, borderRadius: 2 }}>
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