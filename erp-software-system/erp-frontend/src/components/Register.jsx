// src/components/Register.jsx
import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Link
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Register() {
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'SALES_EXECUTIVE'
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

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

    const result = await register({
      username: registerData.username,
      email: registerData.email,
      password: registerData.password,
      role: registerData.role
    });

    if (result.success) {
      setSuccess('Registration successful! You can now login with your credentials.');
      setRegisterData({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'SALES_EXECUTIVE'
      });
      // Switch to login after 2 seconds
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      setError(result.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Container component="main" maxWidth="sm">
        <Paper elevation={3} style={{ padding: '3rem', borderRadius: '16px' }}>
          <Box style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Typography component="h1" variant="h4" style={{ fontWeight: 700, color: '#333', marginBottom: '0.5rem' }}>
              Create Account
            </Typography>
            <Typography variant="body1" style={{ color: '#666' }}>
              Join our platform today
            </Typography>
          </Box>

          {success && (
            <Alert severity="success" style={{ marginBottom: '2rem' }}>
              {success}
            </Alert>
          )}
          {error && (
            <Alert severity="error" style={{ marginBottom: '2rem' }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
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
                  onChange={handleChange}
                  disabled={loading}
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
                  onChange={handleChange}
                  type="email"
                  disabled={loading}
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
                  onChange={handleChange}
                  disabled={loading}
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
                  onChange={handleChange}
                  disabled={loading}
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
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <MenuItem value="SALES_EXECUTIVE">Sales Executive</MenuItem>
                    <MenuItem value="PURCHASE_MANAGER">Purchase Manager</MenuItem>
                    <MenuItem value="INVENTORY_MANAGER">Inventory Manager</MenuItem>
                    <MenuItem value="ACCOUNTANT">Accountant</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              size="large"
              style={{ marginTop: '1rem', marginBottom: '1rem' }}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </Box>

          {/* Login Link */}
          <Box style={{ textAlign: 'center', marginTop: '1rem' }}>
            <Typography variant="body2" style={{ color: '#666' }}>
              Already have an account?{' '}
              <Link 
                component={RouterLink}
                to="/login"
                style={{ 
                  color: '#667eea', 
                  textDecoration: 'none',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
              >
                Sign in here
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </div>
  );
}

export default Register;