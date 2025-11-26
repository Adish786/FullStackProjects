// Authentication utility functions
export const getToken = () => localStorage.getItem('token');
export const setToken = (token) => localStorage.setItem('token', token);
export const removeToken = () => localStorage.removeItem('token');

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user) => localStorage.setItem('user', JSON.stringify(user));
export const removeCurrentUser = () => localStorage.removeItem('user');

export const isAuthenticated = () => {
  const token = getToken();
  return !!token;
};