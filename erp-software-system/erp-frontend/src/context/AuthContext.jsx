import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Create the context
const AuthContext = createContext();

// Custom hook that follows React Fast Refresh rules
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userRole, setUserRole] = useState(localStorage.getItem('userRole'));
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail'));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      console.log('Sending login request to /api/auth/login');
      
      // FIXED: Use POST method and correct endpoint
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        username: email, // Using email as username for login
        password: password
      }, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Login successful:', response.data);
      
      const { token: newToken, role } = response.data;
      setToken(newToken);
      setUserRole(role);
      setUserEmail(email);
      
      localStorage.setItem('token', newToken);
      localStorage.setItem('userRole', role);
      localStorage.setItem('userEmail', email);
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      
      setLoading(false);
      return { success: true };
    } catch (error) {
      setLoading(false);
      console.error('Login error details:', error);
      
      if (error.code === 'ECONNREFUSED') {
        return { 
          success: false, 
          message: 'Backend server is not running. Please start the Spring Boot application.' 
        };
      } else if (error.response) {
        return { 
          success: false, 
          message: error.response.data || `Login failed: ${error.response.status}` 
        };
      } else if (error.request) {
        return { 
          success: false, 
          message: 'No response from server. Please check if backend is running.' 
        };
      } else {
        return { 
          success: false, 
          message: 'Login failed. Please try again.' 
        };
      }
    }
  };

  const register = async (userData) => {
    try {
      console.log('Sending registration request to /api/auth/register');
      
      // FIXED: Use correct endpoint
      const response = await axios.post('http://localhost:8080/api/auth/register', userData, {
        timeout: 10000,
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Registration successful:', response.data);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.code === 'ECONNREFUSED') {
        return { 
          success: false, 
          message: 'Backend server is not running. Please start the Spring Boot application.' 
        };
      } else if (error.response) {
        return { 
          success: false, 
          message: error.response.data || 'Registration failed' 
        };
      } else {
        return { 
          success: false, 
          message: 'Network error during registration' 
        };
      }
    }
  };

  const logout = () => {
    setToken(null);
    setUserRole(null);
    setUserEmail(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    delete axios.defaults.headers.common['Authorization'];
  };

  const value = {
    token,
    userRole,
    userEmail,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;