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
  Divider,
  InputAdornment,
  IconButton,
  Fade,
} from '@mui/material';
import {
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  PersonAdd,
  Login as LoginIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Get success message from registration
  const successMessage = location.state?.message;

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    const result = await login(formData);
    
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  // Demo credentials for testing
  const fillDemoCredentials = (role) => {
    if (role === 'admin') {
      setFormData({
        email: 'admin@bookstore.com',
        password: 'admin123'
      });
    } else {
      setFormData({
        email: 'customer@bookstore.com',
        password: 'customer123'
      });
    }
  };

  return (
    <Container 
      maxWidth="sm" 
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        py: 4
      }}
    >
      <Fade in={true} timeout={800}>
        <Paper 
          elevation={8} 
          sx={{ 
            p: { xs: 3, sm: 5 },
            width: '100%',
            maxWidth: 450,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}
        >
          {/* Header Section */}
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Box
              sx={{
                width: 60,
                height: 60,
                backgroundColor: 'primary.main',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)'
              }}
            >
              <LoginIcon sx={{ fontSize: 30, color: 'white' }} />
            </Box>
            <Typography 
              variant="h4" 
              component="h1" 
              gutterBottom 
              fontWeight="bold"
              sx={{
                background: 'linear-gradient(45deg, #2E7D32, #4CAF50)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
              }}
            >
              Welcome Back
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ opacity: 0.8 }}
            >
              Sign in to your Bookstore account
            </Typography>
          </Box>

          {/* Success Message from Registration */}
          {successMessage && (
            <Alert 
              severity="success" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'success.light'
              }}
            >
              {successMessage}
            </Alert>
          )}

          {/* Error Message */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'error.light'
              }}
            >
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
              autoComplete="email"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Email sx={{ color: 'text.secondary', opacity: 0.7 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  },
                  '&.Mui-focused': {
                    boxShadow: '0 2px 12px rgba(46, 125, 50, 0.2)',
                  }
                }
              }}
            />
            
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
              autoComplete="current-password"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: 'text.secondary', opacity: 0.7 }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePassword}
                      edge="end"
                      sx={{ color: 'text.secondary', opacity: 0.7 }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  },
                  '&.Mui-focused': {
                    boxShadow: '0 2px 12px rgba(46, 125, 50, 0.2)',
                  }
                }
              }}
            />

            {/* Demo Credentials Section */}
            <Box sx={{ mt: 2, mb: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: 'block' }}>
                Try demo accounts:
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => fillDemoCredentials('customer')}
                  sx={{ 
                    flex: 1,
                    fontSize: '0.75rem',
                    py: 0.5
                  }}
                >
                  Customer
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => fillDemoCredentials('admin')}
                  sx={{ 
                    flex: 1,
                    fontSize: '0.75rem',
                    py: 0.5
                  }}
                >
                  Admin
                </Button>
              </Box>
            </Box>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              size="large"
              startIcon={loading ? null : <LoginIcon />}
              sx={{
                mt: 3,
                mb: 2,
                py: 1.5,
                borderRadius: 2,
                fontSize: '1.1rem',
                fontWeight: 'bold',
                textTransform: 'none',
                background: 'linear-gradient(45deg, #2E7D32, #4CAF50)',
                boxShadow: '0 4px 15px rgba(46, 125, 50, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 20px rgba(46, 125, 50, 0.4)',
                },
                '&:disabled': {
                  background: 'grey.300',
                  transform: 'none',
                  boxShadow: 'none',
                }
              }}
            >
              {loading ? (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Box 
                    sx={{ 
                      width: 20, 
                      height: 20, 
                      border: '2px solid transparent',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite',
                      mr: 1
                    }}
                  />
                  Signing in...
                </Box>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Divider */}
          <Divider sx={{ my: 3, opacity: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>

          {/* Additional Links Section */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Don't have an account?
            </Typography>
            
            <Button
              component={RouterLink}
              to="/register"
              variant="outlined"
              fullWidth
              startIcon={<PersonAdd />}
              sx={{
                py: 1.2,
                borderRadius: 2,
                fontSize: '1rem',
                fontWeight: 'bold',
                textTransform: 'none',
                borderColor: 'primary.main',
                color: 'primary.main',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: 'primary.main',
                  color: 'white',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(46, 125, 50, 0.3)',
                }
              }}
            >
              Create New Account
            </Button>

            {/* Additional Help Links */}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
              <Link
                component={RouterLink}
                to="/forgot-password"
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                  '&:hover': {
                    color: 'primary.main',
                    textDecoration: 'underline',
                  }
                }}
              >
                Forgot Password?
              </Link>
              <Typography variant="body2" color="text.secondary">
                •
              </Typography>
              <Link
                component={RouterLink}
                to="/"
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                  '&:hover': {
                    color: 'primary.main',
                    textDecoration: 'underline',
                  }
                }}
              >
                Back to Home
              </Link>
            </Box>
          </Box>

          {/* CSS Animation for spinner */}
          <style>
            {`
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}
          </style>
        </Paper>
      </Fade>
    </Container>
  );
};

export default Login;