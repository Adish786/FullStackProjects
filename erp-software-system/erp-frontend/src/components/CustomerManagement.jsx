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
  useTheme,
  useMediaQuery
} from '@mui/material';

import { Add, Edit, Delete, People, ArrowBack, Email, Phone, LocationOn, Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Mock Auth
const useAuth = () => ({
  logout: () => console.log('Logout clicked')
});

// Mock Data
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
    address: '456 Business Ave, San Francisco, CA 94105',
    gstin: '07FGHIJ5678K2M9',
    status: 'Active'
  }
];

const axios = {
  get: () => Promise.resolve({ data: mockCustomers }),
  post: (url, data) => Promise.resolve({ data: { ...data, id: Date.now(), status: 'Active' } }),
  put: (url, data) => Promise.resolve({ data: { ...data, status: 'Active' } }),
  delete: () => Promise.resolve({ data: {} })
};

function CustomerManagement() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', address: '', gstin: '' });
  const [formErrors, setFormErrors] = useState({});

  const { logout } = useAuth();
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // ✅ Navigation Fix
  const handleBackToDashboard = () => navigate('/dashboard');
  const handleNavigateToDashboard = () => navigate('/dashboard');

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

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      errors.email = 'Invalid email';
    }

    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (formData.gstin && !gstRegex.test(formData.gstin)) {
      errors.gstin = 'Invalid GSTIN format';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showSnackbar('Please fix errors', 'error');
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
    } catch {
      showSnackbar('Error saving customer', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (customer) => {
    setEditingCustomer(customer);
    setFormData(customer);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this customer?')) return;

    try {
      setLoading(true);
      await axios.delete(`http://localhost:8080/api/customers/${id}`);
      showSnackbar('Customer deleted');
      fetchCustomers();
    } catch {
      showSnackbar('Error deleting customer', 'error');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEditingCustomer(null);
    setFormData({ name: '', email: '', phone: '', address: '', gstin: '' });
    setFormErrors({});
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f8fafc' }}>
      
      {/* Header */}
      <AppBar position="static" elevation={1} sx={{ backgroundColor: 'white', color: 'text.primary' }}>
        <Toolbar sx={{ minHeight: '80px !important' }}>
          
          {/* BACK BUTTON FIXED */}
          <IconButton onClick={handleBackToDashboard} sx={{ mr: 2, color: 'primary.main' }}>
            <ArrowBack />
          </IconButton>

          <People sx={{ mr: 2, color: 'primary.main' }} />

          <Typography variant="h5" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Customer Management
          </Typography>

          {/* DASHBOARD BUTTON FIXED */}
          <Button onClick={handleNavigateToDashboard} sx={{ mr: 2, color: 'text.primary' }}>
            Dashboard
          </Button>

          <Button onClick={logout} sx={{ color: 'text.primary' }}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Box sx={{ flex: 1, p: 3 }}>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 700 }}>
            Customers
          </Typography>

          <Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)} sx={{ backgroundColor: '#2e7d32' }}>
            Add Customer
          </Button>
        </Box>

        {/* Table */}
        <Paper sx={{ mt: 3 }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
              <CircularProgress size={60} />
            </Box>
          ) : (
            <TableContainer sx={{ maxHeight: '70vh' }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Customer Name</TableCell>
                    <TableCell>Contact</TableCell>
                    <TableCell>Address</TableCell>
                    <TableCell>GSTIN</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {customers.map((c) => (
                    <TableRow key={c.id} hover>

                      <TableCell>
                        <Typography fontWeight={600}>{c.name}</Typography>
                      </TableCell>

                      <TableCell>
                        <Email fontSize="small" /> {c.email}
                        <br />
                        <Phone fontSize="small" /> {c.phone}
                      </TableCell>

                      <TableCell>
                        <LocationOn fontSize="small" /> {c.address}
                      </TableCell>

                      <TableCell>
                        {c.gstin ? <Chip label={c.gstin} /> : <Chip label="Not Provided" />}
                      </TableCell>

                      <TableCell>
                        <Chip color="success" label="Active" />
                      </TableCell>

                      <TableCell>
                        <IconButton onClick={() => handleEdit(c)} color="primary">
                          <Edit />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(c.id)} color="error">
                          <Delete />
                        </IconButton>
                      </TableCell>

                    </TableRow>
                  ))}
                </TableBody>

              </Table>
            </TableContainer>
          )}
        </Paper>

      </Box>

      {/* Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{ component: 'form', onSubmit: handleSubmit }}
      >
        <DialogTitle>
          {editingCustomer ? 'Edit Customer' : 'Add Customer'}
          <IconButton onClick={() => setOpen(false)} sx={{ float: 'right' }}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent>

          <TextField
            label="Customer Name"
            fullWidth
            required
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            error={!!formErrors.name}
            helperText={formErrors.name}
            sx={{ mt: 2 }}
          />

          <TextField
            label="Email"
            fullWidth
            required
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            error={!!formErrors.email}
            helperText={formErrors.email}
            sx={{ mt: 2 }}
          />

          <TextField
            label="Phone"
            fullWidth
            required
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            error={!!formErrors.phone}
            helperText={formErrors.phone}
            sx={{ mt: 2 }}
          />

          <TextField
            label="Address"
            fullWidth
            required
            multiline
            rows={3}
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            error={!!formErrors.address}
            helperText={formErrors.address}
            sx={{ mt: 2 }}
          />

          <TextField
            label="GSTIN (Optional)"
            fullWidth
            value={formData.gstin}
            onChange={(e) => handleInputChange('gstin', e.target.value.toUpperCase())}
            error={!!formErrors.gstin}
            helperText={formErrors.gstin || 'Format: 29ABCDE1234F1Z5'}
            inputProps={{ maxLength: 15 }}
            sx={{ mt: 2 }}
          />

        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : editingCustomer ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>

    </Box>
  );
}

export default CustomerManagement;
