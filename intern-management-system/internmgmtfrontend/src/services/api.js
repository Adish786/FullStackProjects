import axios from 'axios';
import AuthService from './auth';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = AuthService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      AuthService.removeToken();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
};

// Batch API
export const batchAPI = {
  getAll: () => api.get('/batches'),
  create: (startDate) => api.post('/batches', null, { params: { startDate } }),
  getById: (id) => api.get(`/batches/${id}`),
};

// Intern API
export const internAPI = {
  getAll: () => api.get('/interns'),
  create: (intern) => api.post('/interns', intern),
  update: (id, intern) => api.put(`/interns/${id}`, intern),
  delete: (id) => api.delete(`/interns/${id}`),
  getByBatch: (batchId) => api.get(`/interns/batch/${batchId}`),
};

export default api;