import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
};

export const bookAPI = {
  getAll: (page = 0, size = 12) => api.get(`/books?page=${page}&size=${size}`),
  getById: (id) => api.get(`/books/${id}`),
  create: (bookData) => api.post('/books', bookData),
  update: (id, bookData) => api.put(`/books/${id}`, bookData),
  delete: (id) => api.delete(`/books/${id}`),
  search: (query, page = 0, size = 12) => 
    api.get(`/books/search?query=${query}&page=${page}&size=${size}`),
  getByGenre: (genre, page = 0, size = 12) =>
    api.get(`/books/genre/${genre}?page=${page}&size=${size}`),
};

export const orderAPI = {
  getAll: (page = 0, size = 10) => api.get(`/orders?page=${page}&size=${size}`),
  getById: (id) => api.get(`/orders/${id}`),
  create: (orderData) => api.post('/orders', orderData),
  updateStatus: (id, status) => api.put(`/orders/${id}/status`, { status }),
  getUserOrders: (page = 0, size = 10) => api.get(`/orders/my-orders?page=${page}&size=${size}`),
};

export default api;