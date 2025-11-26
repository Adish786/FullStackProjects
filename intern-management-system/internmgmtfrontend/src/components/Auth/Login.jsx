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
  CircularProgress
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  Person,
  Lock,
  Login as LoginIcon
} from '@mui/icons-material';
import { authAPI } from '../../services/api';
import AuthService from '../../services/auth';
import './Login.css';

// ✅ Renamed the component to avoid conflict with Login icon
const LoginPage = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const response = await authAPI.login(formData);
      const { token, user } = response.data;

      AuthService.setToken(token);
      AuthService.setUser(user);

      if (onLogin) {
        onLogin(user);
      }

      navigate('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-container">
      <Container maxWidth="sm" className="login-wrapper">
        <Paper elevation={6} className="login-paper">
          <div className="login-header">
            <div className="logo-section">
              <Person className="logo-icon" />
              <Typography variant="h4" className="logo-text">
                InternMgmt
              </Typography>
            </div>
            <Typography variant="h5" className="login-title">
              Welcome Back
            </Typography>
            <Typography variant="body1" className="login-subtitle">
              Sign in to your account to continue
            </Typography>
          </div>

          {error && (
            <Alert severity="error" className="error-alert">
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} className="login-form">
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
                    <Person className="input-icon" />
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
                      onClick={handleTogglePassword}
                      edge="end"
                      className="password-toggle"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              placeholder="Enter your password"
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              className="login-button"
              startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Button>
          </Box>

          <div className="login-footer">
            <Typography variant="body2" className="footer-text">
              Don't have an account?{' '}
              <Link to="/register" className="footer-link">
                Create one here
              </Link>
            </Typography>
          </div>
        </Paper>
      </Container>
    </div>
  );
};

export default LoginPage;