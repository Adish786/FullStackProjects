// src/services/api.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 Making ${config.method?.toUpperCase()} request to: ${config.url}`, config.data);
    console.log('📋 Headers:', config.headers);
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('🔑 Token attached to request');
    }
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ Response received: ${response.status}`, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Response error:', {
      status: error.response?.status,
      data: error.response?.data,
      headers: error.response?.headers,
      url: error.config?.url,
      method: error.config?.method,
      requestData: error.config?.data
    });

    if (error.response?.status === 401) {
      console.log('🔒 Unauthorized - redirecting to login');
      localStorage.removeItem('token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('userEmail');
      window.location.href = '/login';
    }
    
    if (error.response?.status === 403) {
      console.log('🚫 Forbidden - check permissions or CORS');
    }

    return Promise.reject(error);
  }
);

// Enhanced Auth API with email support
export const authAPI = {
  // Method 1: JSON with explicit content type - using email
  login: (email, password) => {
    const credentials = {
      username: email, // Map email to username for backend
      password: password
    };
    console.log('📨 Sending login request with JSON:', credentials);
    return api.post('/auth/login', credentials, {
      headers: {
        'Content-Type': 'application/json'
      },
      transformRequest: [(data) => {
        console.log('📤 Transformed request data:', data);
        return JSON.stringify(data);
      }]
    });
  },

  // Method 2: Form Data with proper encoding - using email
  loginFormData: (email, password) => {
    const formData = new URLSearchParams();
    formData.append('username', email); // Map email to username for backend
    formData.append('password', password);
    
    console.log('📨 Sending login request with FormData:', formData.toString());
    
    return api.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
  },

  // Method 3: Try different approaches - using email
  loginAuto: async (email, password) => {
    try {
      console.log('🔄 Attempt 1: Trying JSON login...');
      return await authAPI.login(email, password);
    } catch (error) {
      console.log('❌ JSON login failed:', error.response?.status);
      
      if (error.response?.status === 400 || error.response?.status === 415) {
        console.log('🔄 Attempt 2: Trying FormData login...');
        return await authAPI.loginFormData(email, password);
      }
      
      // If it's a 403, try without any specific content type
      if (error.response?.status === 403) {
        console.log('🔄 Attempt 3: Trying raw data login...');
        const credentials = {
          username: email, // Map email to username for backend
          password: password
        };
        return await api.post('/auth/login', credentials);
      }
      
      throw error;
    }
  },

  register: (userData) => api.post('/auth/register', userData, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
};

// Products API endpoints
export const productsAPI = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  create: (product) => api.post('/products', product),
  update: (id, product) => api.put(`/products/${id}`, product),
  delete: (id) => api.delete(`/products/${id}`),
  getByCategory: (category) => api.get(`/products/category/${category}`),
  search: (query) => api.get(`/products/search?q=${query}`),
  getLowStock: () => api.get('/products/low-stock'),
  checkSku: (sku) => api.get(`/products/check-sku?sku=${sku}`),
};

// Customers API endpoints
export const customersAPI = {
  getAll: () => api.get('/customers'),
  getById: (id) => api.get(`/customers/${id}`),
  create: (customer) => api.post('/customers', customer),
  update: (id, customer) => api.put(`/customers/${id}`, customer),
  delete: (id) => api.delete(`/customers/${id}`),
  search: (query) => api.get(`/customers/search?query=${query}`),
  getByType: (type) => api.get(`/customers/type/${type}`),
  updateStatus: (id, status) => api.patch(`/customers/${id}/status?status=${status}`),
  getActiveCount: () => api.get('/customers/stats/active-count'),
};

// Export the base api instance for manual testing
export { api };