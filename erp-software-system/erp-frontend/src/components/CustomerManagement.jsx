import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Alert,
  Snackbar,
  Chip,
  CircularProgress,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Add, Edit, Delete, People, ArrowBack, Email, Phone, LocationOn, Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Mock data and functions to replace missing dependencies
const useAuth = () => ({
  logout: () => console.log('Logout clicked')
});

const mockCustomers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main Street, New York, NY 10001',
    gstin: '29ABCDE1234F1Z5',
    status: 'Active'
  },
  {
    id: 2,
    name: 'Acme Corporation',
    email: 'contact@acme.com',
    phone: '+1 (555) 987-6543',
    address: '456 Business Ave, Suite 100, San Francisco, CA 94105',
    gstin: '07FGHIJ5678K2M9',
    status: 'Active'
  },
  {
    id: 3,
    name: 'Sarah Wilson',
    email: 'sarah.wilson@email.com',
    phone: '+1 (555) 456-7890',
    address: '789 Oak Lane, Chicago, IL 60601',
    gstin: '',
    status: 'Active'
  },
  {
    id: 4,
    name: 'Global Tech Solutions',
    email: 'info@globaltech.com',
    phone: '+1 (555) 234-5678',
    address: '321 Tech Park, Boston, MA 02108',
    gstin: '17NOPQR9012S3T4',
    status: 'Active'
  }
];

const axios = {
  get: () => Promise.resolve({ data: mockCustomers }),
  post: (url, data) => {
    const newCustomer = { ...data, id: Date.now(), status: 'Active' };
    return Promise.resolve({ data: newCustomer });
  },
  put: (url, data) => Promise.resolve({ data: { ...data, status: 'Active' } }),
  delete: (url) => Promise.resolve({ data: {} })
};

function CustomerManagement() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    gstin: ''
  });
  const [formErrors, setFormErrors] = useState({});
  
  const { logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/customers');
      setCustomers(response.data);
    } catch (error) {
      showSnackbar('Error fetching customers', 'error');
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = 'Customer name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.phone.trim()) errors.phone = 'Phone number is required';
    if (!formData.address.trim()) errors.address = 'Address is required';
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }

    // GSTIN validation (if provided)
    if (formData.gstin && formData.gstin.trim() !== '') {
      const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
      if (!gstinRegex.test(formData.gstin)) {
        errors.gstin = 'Please enter a valid GSTIN';
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      showSnackbar('Please fix form errors', 'error');
      return;
    }

    try {
      setLoading(true);
      if (editingCustomer) {
        await axios.put(`http://localhost:8080/api/customers/${editingCustomer.id}`, formData);
        showSnackbar('Customer updated successfully');
      } else {
        await axios.post('http://localhost:8080/api/customers', formData);
        showSnackbar('Customer created successfully');
      }
      setOpen(false);
      resetForm();
      fetchCustomers();
    } catch (error) {
      showSnackbar('Error saving customer', 'error');
      console.error('Error saving customer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name || '',
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || '',
      gstin: customer.gstin || ''
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this customer?')) {
      try {
        setLoading(true);
        await axios.delete(`http://localhost:8080/api/customers/${id}`);
        showSnackbar('Customer deleted successfully');
        fetchCustomers();
      } catch (error) {
        showSnackbar('Error deleting customer', 'error');
        console.error('Error deleting customer:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setEditingCustomer(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      address: '',
      gstin: ''
    });
    setFormErrors({});
  };

  const handleCloseDialog = () => {
    setOpen(false);
    resetForm();
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear error when user starts typing
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <Box sx={{ 
      height: '100vh', 
      display: 'flex', 
      flexDirection: 'column',
      backgroundColor: '#f8fafc'
    }}>
      {/* Header */}
      <AppBar 
        position="static" 
        elevation={1}
        sx={{ 
          backgroundColor: 'white',
          color: 'text.primary',
          borderBottom: 1,
          borderColor: 'divider'
        }}
      >
        <Toolbar sx={{ minHeight: '80px !important' }}>
          <IconButton 
            onClick={() => navigate?.('/dashboard') || console.log('Navigate to dashboard')} 
            sx={{ mr: 2, color: 'primary.main' }}
          >
            <ArrowBack />
          </IconButton>
          <People sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Customer Management
          </Typography>
          <Button 
            color="inherit" 
            onClick={() => navigate?.('/dashboard') || console.log('Navigate to dashboard')}
            sx={{ color: 'text.primary', mr: 2 }}
          >
            Dashboard
          </Button>
          <Button 
            color="inherit" 
            onClick={logout}
            sx={{ color: 'text.primary' }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ 
        flex: 1, 
        p: 3, 
        display: 'flex', 
        flexDirection: 'column',
        gap: 3
      }}>
        {/* Header Section */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Typography variant="h3" component="h1" sx={{ fontWeight: 700, color: 'text.primary' }}>
            Customers
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpen(true)}
            size="large"
            sx={{ 
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: 2,
              backgroundColor: '#2e7d32',
              boxShadow: 3,
              '&:hover': {
                backgroundColor: '#1b5e20',
                boxShadow: 6,
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.2s'
            }}
          >
            Add Customer
          </Button>
        </Box>

        {/* Customers Table */}
        <Paper 
          elevation={2} 
          sx={{ 
            flex: 1, 
            display: 'flex', 
            flexDirection: 'column',
            borderRadius: 2,
            overflow: 'hidden'
          }}
        >
          {loading ? (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              flex: 1 
            }}>
              <CircularProgress size={60} />
            </Box>
          ) : (
            <TableContainer sx={{ flex: 1, maxHeight: '100%' }}>
              <Table 
                stickyHeader
                sx={{ 
                  minWidth: 800,
                  '& .MuiTableCell-head': {
                    backgroundColor: '#f8fafc',
                    fontWeight: 700,
                    fontSize: '1rem',
                    py: 2
                  },
                  '& .MuiTableCell-body': {
                    py: 2
                  }
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: '20%' }}>Customer Name</TableCell>
                    <TableCell sx={{ width: '25%' }}>Contact Info</TableCell>
                    <TableCell sx={{ width: '25%' }}>Address</TableCell>
                    <TableCell sx={{ width: '15%' }}>GSTIN</TableCell>
                    <TableCell sx={{ width: '10%' }}>Status</TableCell>
                    <TableCell sx={{ width: '5%' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                        <Typography variant="h6" color="textSecondary" gutterBottom>
                          No customers found
                        </Typography>
                        <Typography color="textSecondary" sx={{ mb: 3 }}>
                          Get started by adding your first customer
                        </Typography>
                        <Button
                          variant="contained"
                          startIcon={<Add />}
                          onClick={() => setOpen(true)}
                          sx={{ backgroundColor: '#2e7d32' }}
                        >
                          Add Customer
                        </Button>
                      </TableCell>
                    </TableRow>
                  ) : (
                    customers.map((customer) => (
                      <TableRow 
                        key={customer.id}
                        sx={{ 
                          '&:hover': { 
                            backgroundColor: '#f8fafc',
                          },
                          transition: 'all 0.2s',
                          cursor: 'pointer',
                          '&:last-child td': { borderBottom: 0 }
                        }}
                      >
                        <TableCell>
                          <Typography variant="subtitle1" fontWeight="600">
                            {customer.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Email fontSize="small" color="action" />
                              <Typography variant="body2" noWrap>
                                {customer.email}
                              </Typography>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <Phone fontSize="small" color="action" />
                              <Typography variant="body2">
                                {customer.phone}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                            <LocationOn fontSize="small" color="action" sx={{ mt: 0.25 }} />
                            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.4 }}>
                              {customer.address}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {customer.gstin ? (
                            <Chip 
                              label={customer.gstin} 
                              size="small" 
                              variant="outlined"
                              sx={{ fontWeight: 600, backgroundColor: '#e8f5e8' }}
                            />
                          ) : (
                            <Chip 
                              label="Not provided" 
                              size="small" 
                              variant="outlined" 
                              color="default"
                            />
                          )}
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={customer.status} 
                            color="success" 
                            size="small"
                            sx={{ fontWeight: 600, minWidth: 80 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(customer);
                              }} 
                              color="primary"
                              size="small"
                              sx={{ 
                                backgroundColor: 'primary.light',
                                '&:hover': { backgroundColor: 'primary.main' }
                              }}
                            >
                              <Edit sx={{ color: 'white', fontSize: 18 }} />
                            </IconButton>
                            <IconButton 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(customer.id);
                              }} 
                              color="error"
                              size="small"
                              sx={{ 
                                backgroundColor: 'error.light',
                                '&:hover': { backgroundColor: 'error.main' }
                              }}
                            >
                              <Delete sx={{ color: 'white', fontSize: 18 }} />
                            </IconButton>
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>

      {/* Add/Edit Customer Dialog - Full Screen on Mobile */}
      <Dialog 
        open={open} 
        onClose={handleCloseDialog} 
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
          component: 'form',
          onSubmit: handleSubmit,
          sx: { 
            borderRadius: isMobile ? 0 : 2,
            m: isMobile ? 0 : 2
          }
        }}
      >
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          borderBottom: 1,
          borderColor: 'divider',
          pb: 2
        }}>
          <Typography variant="h5" fontWeight="600">
            {editingCustomer ? 'Edit Customer' : 'Add New Customer'}
          </Typography>
          <IconButton onClick={handleCloseDialog}>
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              autoFocus
              label="Customer Name"
              fullWidth
              required
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={!!formErrors.name}
              helperText={formErrors.name}
              size="medium"
            />
            <TextField
              label="Email Address"
              type="email"
              fullWidth
              required
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              error={!!formErrors.email}
              helperText={formErrors.email}
              size="medium"
            />
            <TextField
              label="Phone Number"
              fullWidth
              required
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
              error={!!formErrors.phone}
              helperText={formErrors.phone}
              size="medium"
            />
            <TextField
              label="Address"
              fullWidth
              multiline
              rows={3}
              required
              value={formData.address}
              onChange={(e) => handleInputChange('address', e.target.value)}
              error={!!formErrors.address}
              helperText={formErrors.address}
              size="medium"
            />
            <TextField
              label="GSTIN (Optional)"
              fullWidth
              value={formData.gstin}
              onChange={(e) => handleInputChange('gstin', e.target.value.toUpperCase())}
              error={!!formErrors.gstin}
              helperText={formErrors.gstin || "Format: 29ABCDE1234F1Z5"}
              size="medium"
              inputProps={{ maxLength: 15 }}
            />
          </Box>
        </DialogContent>
        
        <DialogActions sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
          <Button 
            onClick={handleCloseDialog}
            size="large"
            sx={{ px: 4 }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            disabled={loading}
            size="large"
            sx={{ 
              px: 4,
              backgroundColor: '#2e7d32',
              '&:hover': {
                backgroundColor: '#1b5e20'
              }
            }}
          >
            {loading ? <CircularProgress size={24} /> : editingCustomer ? 'Update Customer' : 'Create Customer'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ 
            fontSize: '1rem',
            borderRadius: 2
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default CustomerManagement;