// utils/auth.js

// Token management
export const getToken = () => {
  return localStorage.getItem('token');
};

export const setToken = (token) => {
  localStorage.setItem('token', token);
};

export const removeToken = () => {
  localStorage.removeItem('token');
};

// User management
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user) => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const removeCurrentUser = () => {
  localStorage.removeItem('user');
};

// Authentication status
export const isAuthenticated = () => {
  return !!getToken();
};

// Get user role
export const getUserRole = () => {
  const user = getCurrentUser();
  return user ? user.role : null;
};

// Get user email
export const getUserEmail = () => {
  const user = getCurrentUser();
  return user ? user.email : null;
};

// Complete logout
export const logout = () => {
  removeToken();
  removeCurrentUser();
  window.location.href = '/login';
};

// Check if user has specific role
export const hasRole = (role) => {
  const userRole = getUserRole();
  return userRole === role;
};


export const hasAnyRole = (roles) => {
  const userRole = getUserRole();
  return roles.includes(userRole);
};


export const debugAuth = () => {
  const token = getToken();
  const user = getCurrentUser();
  
  console.log('🔍 Auth Debug Info:', {
    token: token ? `${token.substring(0, 20)}...` : 'No token',
    user: user,
    userRole: getUserRole(),
    isAuthenticated: isAuthenticated()
  });
  
  return { token, user, userRole: getUserRole() };
};

// Call this before making API calls
debugAuth();