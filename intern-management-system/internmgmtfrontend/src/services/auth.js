// Authentication service
const AuthService = {
  // Store token in localStorage
  setToken: (token) => {
    localStorage.setItem('token', token);
  },

  // Get token from localStorage
  getToken: () => {
    return localStorage.getItem('token');
  },

  // Remove token from localStorage (logout)
  removeToken: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Store user data
  setUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Get user data
  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  // Get authorization header for API calls
  getAuthHeader: () => {
    const token = AuthService.getToken();
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
};

export default AuthService;