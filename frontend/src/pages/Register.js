import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  MenuItem,
  Grid,
  Fade,
  useTheme,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import { PersonAdd, Person, MedicalServices, Business, ArrowForward, ArrowBack } from '@mui/icons-material';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [role, setRole] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    firstName: '',
    lastName: '',
    phone: '',
    dateOfBirth: '',
    gender: 'Male',
    specialization: '',
    licenseNumber: '',
    department: '',
    name: '',
    registrationNumber: ''
  });
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    if (activeStep === 0 && !role) {
      setError('Please select a role to continue');
      return;
    }
    setError('');
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await register(role, formData);
    if (result.success && result.user) {
      navigate(`/${result.user.role}`);
    } else {
      setError(result.message);
    }
  };

  const roleOptions = [
    {
      value: 'patient',
      label: 'Patient',
      description: 'Book appointments and view your medical history.',
      icon: <Person sx={{ fontSize: 40 }} />,
      color: theme.palette.success.main
    },
    {
      value: 'doctor',
      label: 'Doctor',
      description: 'Manage appointments, patients, and medical records.',
      icon: <MedicalServices sx={{ fontSize: 40 }} />,
      color: theme.palette.primary.main
    },
    {
      value: 'hospital',
      label: 'Hospital',
      description: 'Administer the entire hospital system.',
      icon: <Business sx={{ fontSize: 40 }} />,
      color: theme.palette.warning.main
    },
  ];

  const steps = ['Choose Role', 'Account Details', 'Personal/Professional Info'];

  const renderRoleSelection = () => (
    <Grid container spacing={3}>
      {roleOptions.map((option) => (
        <Grid item xs={12} sm={4} key={option.value}>
          <Paper
            elevation={role === option.value ? 4 : 1}
            onClick={() => {
              setRole(option.value);
              setError('');
            }}
            sx={{
              p: 3,
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              cursor: 'pointer',
              border: '2px solid',
              borderColor: role === option.value ? option.color : theme.palette.divider,
              background: role === option.value ? theme.palette.background.paper : theme.palette.background.default,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: theme.shadows[4],
                background: theme.palette.background.paper,
              }
            }}
          >
            <Box sx={{ color: option.color, mb: 2 }}>
              {option.icon}
            </Box>
            <Typography variant="h6" gutterBottom color={role === option.value ? 'text.primary' : 'text.secondary'}>
              {option.label}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {option.description}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );

  const renderAccountDetails = () => (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          label="Email Address"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          label="Password"
          name="password"
          type="password"
          value={formData.password}
          onChange={handleChange}
          helperText="Must be at least 6 characters"
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          required
          fullWidth
          label="Phone Number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
        />
      </Grid>
    </Grid>
  );

  const renderSpecificDetails = () => {
    switch (role) {
      case 'patient':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Date of Birth"
                name="dateOfBirth"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={formData.dateOfBirth}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                required
                fullWidth
                label="Gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
              >
                <MenuItem value="Male">Male</MenuItem>
                <MenuItem value="Female">Female</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        );
      case 'doctor':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Specialization"
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="License Number"
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Department"
                name="department"
                value={formData.department}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        );
      case 'hospital':
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Hospital Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                label="Registration Number"
                name="registrationNumber"
                value={formData.registrationNumber}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
        );
      default:
        return null;
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        py: 4,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background decoration */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          left: -100,
          width: 400,
          height: 400,
          borderRadius: '50%',
          filter: 'blur(80px)',
          background: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.secondary.light} 100%)`,
          opacity: 0.2,
          zIndex: 0,
        }}
      />

      <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
        <Fade in={true} timeout={800}>
          <Paper
            elevation={2}
            sx={{
              p: { xs: 3, sm: 5 },
              background: theme.palette.background.paper,
              border: `1px solid ${theme.palette.divider}`
            }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box
                sx={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  bgcolor: 'primary.main',
                  mb: 2,
                  boxShadow: `0 8px 16px ${theme.palette.primary.main}40`,
                }}
              >
                <PersonAdd sx={{ fontSize: 30, color: 'white' }} />
              </Box>
              <Typography variant="h4" gutterBottom>
                Create Account
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Join our advanced healthcare platform
              </Typography>
            </Box>

            <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 5 }}>
              {steps.map((label) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              ))}
            </Stepper>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            <Box component="form" onSubmit={handleSubmit}>
              <Box sx={{ minHeight: 400 }}>
                {activeStep === 0 && renderRoleSelection()}
                {activeStep === 1 && renderAccountDetails()}
                {activeStep === 2 && renderSpecificDetails()}
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
                <Button
                  disabled={activeStep === 0}
                  onClick={handleBack}
                  startIcon={<ArrowBack />}
                >
                  Back
                </Button>

                {activeStep === steps.length - 1 ? (
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    endIcon={<PersonAdd />}
                  >
                    Create Account
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    endIcon={<ArrowForward />}
                  >
                    Next Step
                  </Button>
                )}
              </Box>

              <Box textAlign="center" sx={{ mt: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Already have an account?{' '}
                  <Link
                    to="/login"
                    style={{
                      textDecoration: 'none',
                      color: theme.palette.primary.main,
                      fontWeight: 600,
                    }}
                  >
                    Login here
                  </Link>
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default Register;
