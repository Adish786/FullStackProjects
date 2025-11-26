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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
  Fade,
  Slide,
  Divider,
  Chip,
  CircularProgress,
  Tooltip,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  PersonAdd,
  Person,
  Email,
  Lock,
  Security,
  ArrowBack,
  CheckCircle,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link as RouterLink, useLocation } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CUSTOMER',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    feedback: []
  });

  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Password strength checker
  const checkPasswordStrength = (password) => {
    const feedback = [];
    let score = 0;

    if (password.length >= 8) {
      score += 1;
      feedback.push({ text: '✓ At least 8 characters', valid: true });
    } else {
      feedback.push({ text: '✗ At least 8 characters', valid: false });
    }

    if (/[A-Z]/.test(password)) {
      score += 1;
      feedback.push({ text: '✓ Uppercase letter', valid: true });
    } else {
      feedback.push({ text: '✗ Uppercase letter', valid: false });
    }

    if (/[a-z]/.test(password)) {
      score += 1;
      feedback.push({ text: '✓ Lowercase letter', valid: true });
    } else {
      feedback.push({ text: '✗ Lowercase letter', valid: false });
    }

    if (/[0-9]/.test(password)) {
      score += 1;
      feedback.push({ text: '✓ Number', valid: true });
    } else {
      feedback.push({ text: '✗ Number', valid: false });
    }

    if (/[^A-Za-z0-9]/.test(password)) {
      score += 1;
      feedback.push({ text: '✓ Special character', valid: true });
    } else {
      feedback.push({ text: '✗ Special character', valid: false });
    }

    return { score, feedback };
  };

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Check password strength in real-time
    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const handleTogglePassword = () => {
    setShowPassword(!showPassword);
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError('Please enter your full name');
      return false;
    }

    if (!formData.email.trim()) {
      setError('Please enter your email address');
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address');
      return false;
    }

    if (!formData.password) {
      setError('Please enter a password');
      return false;
    }

    if (passwordStrength.score < 3) {
      setError('Please choose a stronger password');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    const result = await register(formData);
    
    if (result.success) {
      navigate('/login', { 
        state: { 
          message: 'Registration successful! Please login to continue.',
          email: formData.email 
        } 
      });
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength.score === 0) return 'default';
    if (passwordStrength.score <= 2) return 'error';
    if (passwordStrength.score <= 3) return 'warning';
    return 'success';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength.score === 0) return 'Enter password';
    if (passwordStrength.score <= 2) return 'Weak';
    if (passwordStrength.score <= 3) return 'Good';
    return 'Strong';
  };

  const fillDemoData = (role) => {
    const demoData = {
      name: role === 'admin' ? 'Bookstore Admin' : 'John Customer',
      email: role === 'admin' ? 'admin@bookstore.com' : 'customer@bookstore.com',
      password: 'SecurePass123!',
      role: role === 'admin' ? 'ADMIN' : 'CUSTOMER'
    };
    setFormData(demoData);
    setPasswordStrength(checkPasswordStrength(demoData.password));
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
      <Slide direction="up" in={true} timeout={800}>
        <Paper 
          elevation={8} 
          sx={{ 
            p: { xs: 3, sm: 5 },
            width: '100%',
            maxWidth: 500,
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
                width: 70,
                height: 70,
                backgroundColor: 'primary.main',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                boxShadow: '0 6px 20px rgba(46, 125, 50, 0.3)'
              }}
            >
              <PersonAdd sx={{ fontSize: 35, color: 'white' }} />
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
              Join Our Community
            </Typography>
            <Typography 
              variant="body1" 
              color="text.secondary"
              sx={{ opacity: 0.8 }}
            >
              Create your Bookstore account and start your reading journey
            </Typography>
          </Box>

          {/* Demo Data Buttons */}
          <Box sx={{ mb: 3, display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={() => fillDemoData('customer')}
              sx={{ flex: 1, borderRadius: 2 }}
            >
              Demo Customer
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={() => fillDemoData('admin')}
              sx={{ flex: 1, borderRadius: 2 }}
            >
              Demo Admin
            </Button>
          </Box>

          {/* Error Message */}
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'error.light',
                display: 'flex',
                alignItems: 'center'
              }}
              icon={<ErrorIcon />}
            >
              {error}
            </Alert>
          )}

          {/* Registration Form */}
          <Fade in={true} timeout={1200}>
            <form onSubmit={handleSubmit}>
              {/* Name Field */}
              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                margin="normal"
                required
                autoComplete="name"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Person sx={{ color: 'text.secondary', opacity: 0.7 }} />
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

              {/* Email Field */}
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

              {/* Password Field */}
              <TextField
                fullWidth
                label="Password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                margin="normal"
                required
                autoComplete="new-password"
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

              {/* Password Strength Indicator */}
              {formData.password && (
                <Box sx={{ mt: 1, mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="caption" color="text.secondary">
                      Password Strength:
                    </Typography>
                    <Chip 
                      label={getPasswordStrengthText()}
                      color={getPasswordStrengthColor()}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                  
                  {/* Password Requirements */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    {passwordStrength.feedback.map((item, index) => (
                      <Typography 
                        key={index}
                        variant="caption" 
                        sx={{ 
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                          color: item.valid ? 'success.main' : 'text.secondary',
                          fontSize: '0.7rem'
                        }}
                      >
                        {item.valid ? <CheckCircle sx={{ fontSize: 14 }} /> : '○'} {item.text}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              )}

              {/* Role Selection */}
              <FormControl fullWidth margin="normal">
                <InputLabel>Account Type</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  label="Account Type"
                  onChange={handleChange}
                  startAdornment={
                    <InputAdornment position="start">
                      <Security sx={{ color: 'text.secondary', opacity: 0.7, mr: 1 }} />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="CUSTOMER">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Person />
                      <Box>
                        <Typography variant="body2">Customer</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Browse and purchase books
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                  <MenuItem value="ADMIN">
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Security />
                      <Box>
                        <Typography variant="body2">Admin</Typography>
                        <Typography variant="caption" color="text.secondary">
                          Manage books and orders
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                </Select>
              </FormControl>

              {/* Submit Button */}
              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                size="large"
                startIcon={loading ? null : <PersonAdd />}
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
                    <CircularProgress size={20} sx={{ mr: 1, color: 'white' }} />
                    Creating Account...
                  </Box>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
          </Fade>

          {/* Divider */}
          <Divider sx={{ my: 3, opacity: 0.5 }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>

          {/* Additional Links */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Already have an account?
            </Typography>
            
            <Button
              component={RouterLink}
              to="/login"
              variant="outlined"
              fullWidth
              startIcon={<ArrowBack />}
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
              Sign In to Existing Account
            </Button>

            {/* Additional Links */}
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center', gap: 2 }}>
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
        </Paper>
      </Slide>
    </Container>
  );
};

export default Register;