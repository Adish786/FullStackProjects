// src/components/Login.jsx
import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
  CircularProgress
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Login() {
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const { login, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    console.log('🔍 Login component - isAuthenticated:', isAuthenticated);
    if (isAuthenticated) {
      console.log('✅ User is authenticated, redirecting to dashboard...');
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!loginData.email || !loginData.password) {
      setError('Please fill in all fields');
      return;
    }

    console.log('📝 Submitting login form...');
    
    const result = await login(loginData.email, loginData.password);
    
    console.log('📊 Login result:', result);
    
    if (result.success) {
      console.log('🎉 Login successful in handleSubmit, waiting for redirect...');
      // The useEffect will handle the redirect when isAuthenticated becomes true
    } else {
      console.log('💥 Login failed in handleSubmit:', result.message);
      setError(result.message);
    }
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <CircularProgress size={60} style={{ color: 'white' }} />
      </div>
    );
  }

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
              Welcome Back
            </Typography>
            <Typography variant="body1" style={{ color: '#666' }}>
              Sign in to your account
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" style={{ marginBottom: '2rem' }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
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
              onChange={handleChange}
              type="email"
              disabled={loading}
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
              onChange={handleChange}
              disabled={loading}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              size="large"
              style={{ 
                marginTop: '1rem', 
                marginBottom: '1rem',
                padding: '12px',
                fontSize: '16px',
                backgroundColor: '#667eea'
              }}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>
          </Box>

          {/* Test credentials info */}
          <Box style={{ 
            backgroundColor: '#f8f9fa', 
            padding: '1rem', 
            borderRadius: '8px', 
            marginTop: '1rem',
            border: '1px solid #e9ecef'
          }}>
            <Typography variant="body2" style={{ color: '#666', textAlign: 'center' }}>
              <strong>Test Credentials:</strong><br />
              Email: admin@erp.com<br />
              Password: admin123
            </Typography>
          </Box>

          <Box style={{ textAlign: 'center', marginTop: '1rem' }}>
            <Typography variant="body2" style={{ color: '#666' }}>
              Don't have an account?{' '}
              <Link 
                component={RouterLink}
                to="/register"
                style={{ 
                  color: '#667eea', 
                  textDecoration: 'none',
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
                onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
              >
                Create one here
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </div>
  );
}

export default Login;