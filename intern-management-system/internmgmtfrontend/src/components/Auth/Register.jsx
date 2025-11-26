import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  TextField,
  Button,
  Paper,
  Typography,
  Alert,
  Container,
  InputAdornment,
  IconButton,
  CircularProgress,
  Stepper,
  Step,
  StepLabel
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person,
  Lock,
  Email,
  Badge,
  HowToReg
} from '@mui/icons-material';
import { authAPI } from '../../services/api';  
import AuthService from '../../services/auth'; 
import './Register.css';

const Register = ({ onRegister }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'USER'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();

  const steps = ['Personal Info', 'Account Details', 'Confirmation'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validateStep = (step) => {
    switch (step) {
      case 0:
        return formData.firstName.trim() && formData.lastName.trim();
      case 1:
        return formData.email && formData.password && formData.confirmPassword;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prev) => prev + 1);
      setError('');
    } else {
      setError('Please fill all required fields');
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...registrationData } = formData;
      const response = await authAPI.register(registrationData);
      
      setSuccess('Registration successful! Redirecting to login...');
      
      // Auto login after registration
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div className="step-content">
            <Typography variant="h6" className="step-title">
              Personal Information
            </Typography>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="form-field"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person className="input-icon" />
                  </InputAdornment>
                ),
              }}
              placeholder="Enter your first name"
            />
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="form-field"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person className="input-icon" />
                  </InputAdornment>
                ),
              }}
              placeholder="Enter your last name"
            />
          </div>
        );

      case 1:
        return (
          <div className="step-content">
            <Typography variant="h6" className="step-title">
              Account Details
            </Typography>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="form-field"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email className="input-icon" />
                  </InputAdornment>
                ),
              }}
              placeholder="Enter your email"
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              required
              className="form-field"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock className="input-icon" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      className="password-toggle"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              placeholder="Create a password (min. 6 characters)"
            />
            <TextField
              fullWidth
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="form-field"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock className="input-icon" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      edge="end"
                      className="password-toggle"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              placeholder="Confirm your password"
            />
          </div>
        );

      case 2:
        return (
          <div className="step-content">
            <Typography variant="h6" className="step-title">
              Review Information
            </Typography>
            <div className="review-section">
              <div className="review-item">
                <Typography variant="body2" className="review-label">
                  Name:
                </Typography>
                <Typography variant="body1" className="review-value">
                  {formData.firstName} {formData.lastName}
                </Typography>
              </div>
              <div className="review-item">
                <Typography variant="body2" className="review-label">
                  Email:
                </Typography>
                <Typography variant="body1" className="review-value">
                  {formData.email}
                </Typography>
              </div>
              <div className="review-item">
                <Typography variant="body2" className="review-label">
                  Role:
                </Typography>
                <Typography variant="body1" className="review-value">
                  {formData.role}
                </Typography>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="register-container">
      <Container maxWidth="sm" className="register-wrapper">
        <Paper elevation={6} className="register-paper">
          {/* Header */}
          <div className="register-header">
            <div className="logo-section">
              <Badge className="logo-icon" />
              <Typography variant="h4" className="logo-text">
                InternMgmt
              </Typography>
            </div>
            <Typography variant="h5" className="register-title">
              Create Account
            </Typography>
            <Typography variant="body1" className="register-subtitle">
              Join us to manage your interns efficiently
            </Typography>
          </div>

          {/* Stepper */}
          <Stepper activeStep={activeStep} className="register-stepper">
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {/* Alerts */}
          {error && (
            <Alert severity="error" className="error-alert">
              {error}
            </Alert>
          )}
          {success && (
            <Alert severity="success" className="success-alert">
              {success}
            </Alert>
          )}

          {/* Registration Form */}
          <Box component="form" onSubmit={handleSubmit} className="register-form">
            {renderStepContent(activeStep)}

            {/* Navigation Buttons */}
            <div className="form-actions">
              {activeStep > 0 && (
                <Button
                  onClick={handleBack}
                  className="back-button"
                  disabled={loading}
                >
                  Back
                </Button>
              )}
              
              <div className="action-spacer" />
              
              {activeStep < steps.length - 1 ? (
                <Button
                  onClick={handleNext}
                  variant="contained"
                  className="next-button"
                >
                  Next
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="contained"
                  disabled={loading}
                  className="register-button"
                  startIcon={loading ? <CircularProgress size={20} /> : <HowToReg />}
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
              )}
            </div>
          </Box>

          {/* Footer */}
          <div className="register-footer">
            <Typography variant="body2" className="footer-text">
              Already have an account?{' '}
              <Link to="/login" className="footer-link">
                Sign in here
              </Link>
            </Typography>
          </div>
        </Paper>
      </Container>
    </div>
  );
};

export default Register;