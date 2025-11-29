import axios from 'axios';
import { getToken } from '../utils/auth';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/login', credentials),
  register: (userData) => api.post('/register', userData),
  getProfile: () => api.get('/users/me'),
};

// User API
export const userAPI = {
  getAll: (params = {}) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
  updateRole: (id, role) => api.patch(`/users/${id}/role`, null, { params: { role } }),
  getByRole: (role) => api.get(`/users/role/${role}`),
  checkEmail: (email) => api.get('/users/check-email', { params: { email } }),
  getStatistics: () => api.get('/users/statistics'),
  getSalesReps: () => api.get('/users/sales-representatives'),
};

// Customer API
export const customerAPI = {
  getAll: () => api.get('/customers'),
  getById: (id) => api.get(`/customers/${id}`),
  create: (data) => api.post('/customers', data),
  update: (id, data) => api.put(`/customers/${id}`, data),
  delete: (id) => api.delete(`/customers/${id}`),
};

// Lead API
export const leadAPI = {
  getAll: () => api.get('/leads'),
  getById: (id) => api.get(`/leads/${id}`),
  create: (data) => api.post('/leads', data),
  update: (id, data) => api.put(`/leads/${id}`, data),
  delete: (id) => api.delete(`/leads/${id}`),
  updateStatus: (id, status) => api.patch(`/leads/${id}/status`, { status }),
  getByStatus: (status) => api.get(`/leads/status/${status}`),
  getStatistics: () => api.get('/leads/statistics'),
  convertToCustomer: (id) => api.post(`/leads/${id}/convert`),
  getBySalesRep: (salesRepId) => api.get(`/leads/sales-rep/${salesRepId}`),
  getNeedingFollowUp: () => api.get('/leads/needing-followup'),
};

// Task API
export const taskAPI = {
  getAll: (params = {}) => api.get('/tasks', { params }),
  getById: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
  updateStatus: (id, status) => api.patch(`/tasks/${id}/status`, { status }),
  getByAssignedUser: (userId) => api.get(`/tasks/assigned-to/${userId}`),
  getByStatus: (status) => api.get(`/tasks/status/${status}`),
  getByPriority: (priority) => api.get(`/tasks/priority/${priority}`),
  getOverdue: () => api.get('/tasks/overdue'),
  getDueToday: () => api.get('/tasks/due-today'),
  getStatistics: () => api.get('/tasks/statistics'),
  getMyTasks: () => api.get('/tasks/my-tasks'),
  getDueBetween: (startDate, endDate) => api.get('/tasks/due-between', { 
    params: { startDate, endDate } 
  }),
};

// Sale API
export const saleAPI = {
  getAll: (params = {}) => api.get('/sales', { params }),
  getById: (id) => api.get(`/sales/${id}`),
  create: (data) => api.post('/sales', data),
  update: (id, data) => api.put(`/sales/${id}`, data),
  delete: (id) => api.delete(`/sales/${id}`),
  updateStatus: (id, status) => api.patch(`/sales/${id}/status`, { status }),
  getByCustomer: (customerId) => api.get(`/sales/customer/${customerId}`),
  getStatistics: (startDate, endDate) => api.get('/sales/statistics', { 
    params: { startDate, endDate } 
  }),
  getTotalRevenue: (startDate, endDate) => api.get('/sales/total-revenue', {
    params: { startDate, endDate }
  }),
  getByStatus: (status) => api.get(`/sales/status/${status}`),
  bulkUpdateStatus: (saleIds, status) => api.post('/sales/bulk-status-update', {
    saleIds,
    status
  }),
  getTopPerformers: (limit = 10) => api.get('/sales/top-performers', {
    params: { limit }
  }),
  getMonthlyStats: (year) => api.get('/sales/monthly-stats', {
    params: { year }
  }),
};

// Dashboard API
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getRecentActivities: () => api.get('/dashboard/recent-activities'),
  getSalesChart: (period) => api.get('/dashboard/sales-chart', {
    params: { period }
  }),
  getLeadConversion: () => api.get('/dashboard/lead-conversion'),
};

// Export individual methods for components that need direct access
export const apiMethods = {
  // Auth
  login: (credentials) => api.post('/login', credentials),
  register: (userData) => api.post('/register', userData),
  
  // Users
  getUsers: (params) => api.get('/users', { params }),
  createUser: (data) => api.post('/users', data),
  
  // Customers
  getCustomers: () => api.get('/customers'),
  createCustomer: (data) => api.post('/customers', data),
  
  // Leads
  getLeads: () => api.get('/leads'),
  createLead: (data) => api.post('/leads', data),
  
  // Tasks
  getTasks: (params) => api.get('/tasks', { params }),
  createTask: (data) => api.post('/tasks', data),
  
  // Sales
  getSales: (params) => api.get('/sales', { params }),
  createSale: (data) => api.post('/sales', data),
};

export default api;