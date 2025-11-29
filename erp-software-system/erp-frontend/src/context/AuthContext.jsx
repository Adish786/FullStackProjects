// src/context/AuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Initialize auth state from localStorage
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const token = localStorage.getItem('token');
        const userRole = localStorage.getItem('userRole');
        const userEmail = localStorage.getItem('userEmail');

        console.log('🔄 Initializing auth state:', { token, userRole, userEmail });

        if (token && userRole && userEmail) {
          setUser({
            token,
            role: userRole,
            email: userEmail
          });
          console.log('✅ User authenticated from localStorage');
        } else {
          console.log('❌ No valid auth data in localStorage');
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
        // Clear invalid storage
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userEmail');
      } finally {
        setLoading(false);
        console.log('🏁 Auth initialization complete');
      }
    };

    initializeAuth();
  }, []);

  const login = async (email, password) => {
    try {
      setError('');
      setLoading(true);
      
      console.log('🔄 Attempting login with:', { email, password });
      
      // Use the auto login method
      const response = await authAPI.loginAuto(email, password);
      
      if (response.data) {
        const { token, role } = response.data;
        
        console.log('✅ Login successful:', { token, role });
        
        // Store auth data
        localStorage.setItem('token', token);
        localStorage.setItem('userRole', role);
        localStorage.setItem('userEmail', email);
        
        // Update user state
        setUser({
          token,
          role,
          email: email
        });
        
        console.log('📝 User state updated, isAuthenticated:', !!token);
        
        return { success: true, data: response.data };
      } else {
        throw new Error('No response data received');
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      
      let errorMessage = 'Login failed';
      
      if (error.response) {
        errorMessage = error.response.data?.message || 
                      error.response.data || 
                      `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = 'Network error: Unable to connect to server';
      } else {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      return { 
        success: false, 
        message: errorMessage,
        status: error.response?.status 
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setError('');
      setLoading(true);
      
      const response = await authAPI.register(userData);
      
      if (response.data) {
        return { success: true, message: 'Registration successful' };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 
                          error.response?.data || 
                          'Registration failed';
      setError(errorMessage);
      return { success: false, message: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log('🚪 Logging out user');
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userEmail');
    setUser(null);
    setError('');
  };

  const clearError = () => {
    setError('');
  };

  const value = {
    user,
    login,
    register,
    logout,
    loading,
    error,
    clearError,
    isAuthenticated: !!user?.token,
    userRole: user?.role,
    userEmail: user?.email
  };

  console.log('🔄 AuthContext value updated:', { 
    isAuthenticated: !!user?.token,
    userRole: user?.role,
    loading 
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;