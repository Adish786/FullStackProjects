import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Link
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [activeTab, setActiveTab] = useState(0);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'SALES_EXECUTIVE'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { login, loading } = useAuth();
  const navigate = useNavigate();

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setError('');
    setSuccess('');
  };

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic validation
    if (!loginData.email || !loginData.password) {
      setError('Please fill in all fields');
      return;
    }

    // Use email as username for login (backend expects username)
    const result = await login(loginData.email, loginData.password);
    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.message);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!registerData.username || !registerData.email || !registerData.password || !registerData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (registerData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: registerData.username,
          email: registerData.email,
          password: registerData.password,
          role: registerData.role
        }),
      });

      const data = await response.text();

      if (response.ok) {
        setSuccess('Registration successful! Please login with your credentials.');
        setActiveTab(0); // Switch to login tab
        setRegisterData({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: 'SALES_EXECUTIVE'
        });
      } else {
        setError(data || 'Registration failed');
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Registration error:', error);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ padding: 4, width: '100%' }}>
          <Typography component="h1" variant="h4" align="center" gutterBottom color="primary">
            ERP System
          </Typography>
          <Typography component="h2" variant="h6" align="center" gutterBottom color="text.secondary">
            Inventory & Sales Management
          </Typography>
          
          {/* Tabs for Login/Register */}
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
            <Tabs value={activeTab} onChange={handleTabChange} centered>
              <Tab label="Login" />
              <Tab label="Register" />
            </Tabs>
          </Box>

          {/* Success Message */}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
          
          {/* Error Message */}
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          {/* Login Form */}
          {activeTab === 0 && (
            <Box component="form" onSubmit={handleLoginSubmit} sx={{ mt: 1 }}>
              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                value={loginData.email}
                onChange={handleLoginChange}
                type="email"
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={loginData.password}
                onChange={handleLoginChange}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                disabled={loading}
                size="large"
              >
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
              <Box textAlign="center">
                <Link 
                  component="button" 
                  type="button" 
                  variant="body2"
                  onClick={() => setActiveTab(1)}
                >
                  Don't have an account? Sign up
                </Link>
              </Box>
            </Box>
          )}

          {/* Registration Form */}
          {activeTab === 1 && (
            <Box component="form" onSubmit={handleRegisterSubmit} sx={{ mt: 1 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    value={registerData.username}
                    onChange={handleRegisterChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    value={registerData.email}
                    onChange={handleRegisterChange}
                    type="email"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                    value={registerData.password}
                    onChange={handleRegisterChange}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    name="confirmPassword"
                    label="Confirm Password"
                    type="password"
                    id="confirmPassword"
                    value={registerData.confirmPassword}
                    onChange={handleRegisterChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="role-label">Role</InputLabel>
                    <Select
                      labelId="role-label"
                      id="role"
                      name="role"
                      value={registerData.role}
                      label="Role"
                      onChange={handleRegisterChange}
                    >
                      <MenuItem value="SALES_EXECUTIVE">Sales Executive</MenuItem>
                      <MenuItem value="PURCHASE_MANAGER">Purchase Manager</MenuItem>
                      <MenuItem value="INVENTORY_MANAGER">Inventory Manager</MenuItem>
                      <MenuItem value="ACCOUNTANT">Accountant</MenuItem>
                    </Select>
                  </FormControl>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    Note: Admin accounts can only be created by existing administrators
                  </Typography>
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                size="large"
              >
                Create Account
              </Button>
              <Box textAlign="center">
                <Link 
                  component="button" 
                  type="button" 
                  variant="body2"
                  onClick={() => setActiveTab(0)}
                >
                  Already have an account? Sign in
                </Link>
              </Box>
            </Box>
          )}
        </Paper>

        {/* Demo Accounts Info */}
        <Paper elevation={1} sx={{ padding: 2, mt: 3, width: '100%', backgroundColor: '#f5f5f5' }}>
          <Typography variant="h6" gutterBottom align="center">
            Demo Accounts
          </Typography>
          <Typography variant="body2" align="center" color="text.secondary">
            Use these credentials for testing (register first or use backend defaults)
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}

export default Login;