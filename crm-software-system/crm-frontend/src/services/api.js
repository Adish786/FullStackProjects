// api.js
import axios from 'axios';
import { getToken, canAccess, getUserRole, logout } from '../utils/auth';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Enhanced Request Interceptor with Permission Checking
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      
      // Check if user has permission for this endpoint
      const endpoint = config.url || '';
      const hasPermission = canAccess(endpoint);
      
      console.log(`🔐 Permission Check for ${config.method?.toUpperCase()} ${endpoint}:`, {
        hasPermission,
        userRole: getUserRole(),
        endpoint
      });

      if (!hasPermission) {
        console.warn(`🚫 User ${getUserRole()} lacks permission for ${endpoint}`);
        // We'll let the request proceed but expect a 403 from backend
      }
    } else {
      console.warn('⚠️ No token found for API request');
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Enhanced Response Interceptor with Better Error Handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Success: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    const { config, response } = error;
    
    console.error('❌ API Error:', {
      url: config?.url,
      method: config?.method,
      status: response?.status,
      statusText: response?.statusText,
      userRole: getUserRole(),
      endpoint: config?.url
    });

    if (response) {
      switch (response.status) {
        case 401:
          console.warn('🛑 401 Unauthorized - Token invalid or expired');
          logout();
          break;
          
        case 403:
          console.error('🚫 403 Forbidden - Permission denied', {
            endpoint: config?.url,
            userRole: getUserRole(),
            requiredRole: response.data?.requiredRole || 'Unknown',
            message: response.data?.message || 'No permission'
          });
          
          // Show user-friendly error message
          if (typeof window !== 'undefined' && !config._retry) {
            const userMessage = `Access denied. You don't have permission to access this resource. 
                               Your role: ${getUserRole() || 'None'}`;
            // You can use a toast notification here instead of alert
            alert(userMessage);
          }
          break;
          
        case 404:
          console.error('🔍 404 Not Found - Endpoint may not exist');
          break;
          
        case 500:
          console.error('💥 500 Server Error - Backend issue');
          break;
          
        default:
          console.error(`❌ HTTP ${response.status} Error`);
      }
    } else if (error.code === 'NETWORK_ERROR' || error.code === 'ECONNREFUSED') {
      console.error('🌐 Network Error - Backend may be down');
    }

    return Promise.reject(error);
  }
);

// Permission-aware API methods
const createPermissionAwareAPI = (basePath, allowedRoles = ['admin', 'manager', 'sales', 'user']) => ({
  getAll: (params = {}) => {
    if (!canAccess(basePath)) {
      return Promise.reject(new Error(`No permission to access ${basePath}`));
    }
    return api.get(basePath, { params });
  },
  
  getById: (id) => {
    if (!canAccess(basePath)) {
      return Promise.reject(new Error(`No permission to access ${basePath}`));
    }
    return api.get(`${basePath}/${id}`);
  },
  
  create: (data) => {
    if (!canAccess(basePath)) {
      return Promise.reject(new Error(`No permission to access ${basePath}`));
    }
    return api.post(basePath, data);
  },
  
  update: (id, data) => {
    if (!canAccess(basePath)) {
      return Promise.reject(new Error(`No permission to access ${basePath}`));
    }
    return api.put(`${basePath}/${id}`, data);
  },
  
  delete: (id) => {
    if (!canAccess(basePath)) {
      return Promise.reject(new Error(`No permission to access ${basePath}`));
    }
    return api.delete(`${basePath}/${id}`);
  }
});

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/login', credentials),
  register: (userData) => api.post('/register', userData),
  getProfile: () => api.get('/users/me'),
  refreshToken: () => api.post('/auth/refresh'),
};

// User API - Admin only
export const userAPI = {
  getAll: (params = {}) => {
    if (!canAccess('/api/users')) {
      return Promise.reject(new Error('Admin access required for user management'));
    }
    return api.get('/users', { params });
  },
  
  getById: (id) => {
    if (!canAccess('/api/users')) {
      return Promise.reject(new Error('Admin access required for user management'));
    }
    return api.get(`/users/${id}`);
  },
  
  create: (data) => {
    if (!canAccess('/api/users')) {
      return Promise.reject(new Error('Admin access required for user management'));
    }
    return api.post('/users', data);
  },
  
  update: (id, data) => {
    if (!canAccess('/api/users')) {
      return Promise.reject(new Error('Admin access required for user management'));
    }
    return api.put(`/users/${id}`, data);
  },
  
  delete: (id) => {
    if (!canAccess('/api/users')) {
      return Promise.reject(new Error('Admin access required for user management'));
    }
    return api.delete(`/users/${id}`);
  },
  
  updateRole: (id, role) => {
    if (!canAccess('/api/users')) {
      return Promise.reject(new Error('Admin access required for role management'));
    }
    return api.patch(`/users/${id}/role`, null, { params: { role } });
  },
  
  getByRole: (role) => {
    if (!canAccess('/api/users')) {
      return Promise.reject(new Error('Admin access required for user management'));
    }
    return api.get(`/users/role/${role}`);
  },
  
  checkEmail: (email) => api.get('/users/check-email', { params: { email } }),
  
  getStatistics: () => {
    if (!canAccess('/api/users')) {
      return Promise.reject(new Error('Admin access required for user statistics'));
    }
    return api.get('/users/statistics');
  },
  
  getSalesReps: () => api.get('/users/sales-representatives'),
};

// Customer API - Enhanced with permission checks
export const customerAPI = {
  getAll: (params = {}) => {
    if (canAccess('/api/customers')) {
      return Promise.reject(new Error('No permission to access customers'));
    }
    return api.get('/customers', { params });
  },
  
  getById: (id) => {
    if (canAccess('/api/customers')) {
      return Promise.reject(new Error('No permission to access customers'));
    }
    return api.get(`/customers/${id}`);
  },
  
  create: (data) => {
    if (canAccess('/api/customers')) {
      return Promise.reject(new Error('No permission to create customers'));
    }
    return api.post('/customers', data);
  },
  
  update: (id, data) => {
    if (canAccess('/api/customers')) {
      return Promise.reject(new Error('No permission to update customers'));
    }
    return api.put(`/customers/${id}`, data);
  },
  
  delete: (id) => {
    if (canAccess('/api/customers')) {
      return Promise.reject(new Error('No permission to delete customers'));
    }
    return api.delete(`/customers/${id}`);
  },
  
  getByStatus: (status) => {
    if (canAccess('/api/customers')) {
      return Promise.reject(new Error('No permission to access customers'));
    }
    return api.get(`/customers/status/${status}`);
  },
  
  getBySalesRep: (salesRepId) => {
    if (canAccess('/api/customers')) {
      return Promise.reject(new Error('No permission to access customers'));
    }
    return api.get(`/customers/sales-rep/${salesRepId}`);
  },
  
  getStatistics: () => {
    if (canAccess('/api/customers')) {
      return Promise.reject(new Error('No permission to access customer statistics'));
    }
    return api.get('/customers/statistics');
  },
  
  search: (query) => {
    if (canAccess('/api/customers')) {
      return Promise.reject(new Error('No permission to search customers'));
    }
    return api.get('/customers/search', { params: { q: query } });
  },
  
  bulkAssign: (customerIds, salesRepId) => {
    if (canAccess('/api/customers')) {
      return Promise.reject(new Error('No permission to bulk assign customers'));
    }
    return api.post('/customers/bulk-assign', { customerIds, salesRepId });
  },
  
  getUnassigned: () => {
    if (canAccess('/api/customers')) {
      return Promise.reject(new Error('No permission to access customers'));
    }
    return api.get('/customers/unassigned');
  },
  
  getAssigned: () => {
    if (canAccess('/api/customers')) {
      return Promise.reject(new Error('No permission to access customers'));
    }
    return api.get('/customers/assigned');
  },
};

// Lead API with permission checks
export const leadAPI = {
  getAll: () => {
    if (canAccess('/api/leads')) {
      return Promise.reject(new Error('No permission to access leads'));
    }
    return api.get('/leads');
  },
  
  getById: (id) => {
    if (canAccess('/api/leads')) {
      return Promise.reject(new Error('No permission to access leads'));
    }
    return api.get(`/leads/${id}`);
  },
  
  create: (data) => {
    if (canAccess('/api/leads')) {
      return Promise.reject(new Error('No permission to create leads'));
    }
    return api.post('/leads', data);
  },
  
  update: (id, data) => {
    if (canAccess('/api/leads')) {
      return Promise.reject(new Error('No permission to update leads'));
    }
    return api.put(`/leads/${id}`, data);
  },
  
  delete: (id) => {
    if (canAccess('/api/leads')) {
      return Promise.reject(new Error('No permission to delete leads'));
    }
    return api.delete(`/leads/${id}`);
  },
  
  updateStatus: (id, status) => {
    if (canAccess('/api/leads')) {
      return Promise.reject(new Error('No permission to update leads'));
    }
    return api.patch(`/leads/${id}/status`, { status });
  },
  
  getByStatus: (status) => {
    if (canAccess('/api/leads')) {
      return Promise.reject(new Error('No permission to access leads'));
    }
    return api.get(`/leads/status/${status}`);
  },
  
  getStatistics: () => {
    if (canAccess('/api/leads')) {
      return Promise.reject(new Error('No permission to access lead statistics'));
    }
    return api.get('/leads/statistics');
  },
  
  convertToCustomer: (id) => {
    if (canAccess('/api/leads') || !canAccess('/api/customers')) {
      return Promise.reject(new Error('No permission to convert leads to customers'));
    }
    return api.post(`/leads/${id}/convert`);
  },
  
  getBySalesRep: (salesRepId) => {
    if (canAccess('/api/leads')) {
      return Promise.reject(new Error('No permission to access leads'));
    }
    return api.get(`/leads/sales-rep/${salesRepId}`);
  },
  
  getNeedingFollowUp: () => {
    if (canAccess('/api/leads')) {
      return Promise.reject(new Error('No permission to access leads'));
    }
    return api.get('/leads/needing-followup');
  },
};

// Task API with permission checks
export const taskAPI = {
  getAll: (params = {}) => {
    if (canAccess('/api/tasks')) {
      return Promise.reject(new Error('No permission to access tasks'));
    }
    return api.get('/tasks', { params });
  },
  
  getById: (id) => {
    if (canAccess('/api/tasks')) {
      return Promise.reject(new Error('No permission to access tasks'));
    }
    return api.get(`/tasks/${id}`);
  },
  
  create: (data) => {
    if (canAccess('/api/tasks')) {
      return Promise.reject(new Error('No permission to create tasks'));
    }
    return api.post('/tasks', data);
  },
  
  update: (id, data) => {
    if (canAccess('/api/tasks')) {
      return Promise.reject(new Error('No permission to update tasks'));
    }
    return api.put(`/tasks/${id}`, data);
  },
  
  delete: (id) => {
    if (canAccess('/api/tasks')) {
      return Promise.reject(new Error('No permission to delete tasks'));
    }
    return api.delete(`/tasks/${id}`);
  },
  
  // ... other task methods with similar permission checks
};

// Sale API with permission checks
export const saleAPI = {
  getAll: (params = {}) => {
    if (canAccess('/api/sales')) {
      return Promise.reject(new Error('No permission to access sales'));
    }
    return api.get('/sales', { params });
  },
  
  getById: (id) => {
    if (canAccess('/api/sales')) {
      return Promise.reject(new Error('No permission to access sales'));
    }
    return api.get(`/sales/${id}`);
  },
  
  create: (data) => {
    if (canAccess('/api/sales')) {
      return Promise.reject(new Error('No permission to create sales'));
    }
    return api.post('/sales', data);
  },
  
  update: (id, data) => {
    if (canAccess('/api/sales')) {
      return Promise.reject(new Error('No permission to update sales'));
    }
    return api.put(`/sales/${id}`, data);
  },
  
  delete: (id) => {
    if (canAccess('/api/sales')) {
      return Promise.reject(new Error('No permission to delete sales'));
    }
    return api.delete(`/sales/${id}`);
  },
  
  // ... other sale methods with similar permission checks
};

// Dashboard API - Available to all authenticated users
export const dashboardAPI = {
  getStats: () => api.get('/dashboard/stats'),
  getRecentActivities: () => api.get('/dashboard/recent-activities'),
  getSalesChart: (period) => api.get('/dashboard/sales-chart', { params: { period } }),
  getLeadConversion: () => api.get('/dashboard/lead-conversion'),
};

// Helper function to check if user can perform action
export const checkPermission = (endpoint) => {
  return canAccess(endpoint);
};

// Export with enhanced error handling
export default api;