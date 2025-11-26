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
  useMediaQuery,
  Card,
  CardContent,
  Grid,
  LinearProgress
} from '@mui/material';
import { Add, Edit, Delete, Store, ArrowBack, Warning, CheckCircle, Close, Inventory, Remove } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Mock data and functions to replace missing dependencies
const useAuth = () => ({
  logout: () => console.log('Logout clicked')
});

const mockInventory = [
  {
    id: 1,
    product: {
      name: 'MacBook Pro 16"',
      sku: 'MBP-16-001',
      category: 'Electronics'
    },
    currentStock: 8,
    minStockLevel: 5,
    location: 'Warehouse A',
    aisle: 'A-12',
    shelf: 'S3',
    lastUpdated: '2024-01-15'
  },
  {
    id: 2,
    product: {
      name: 'Ergonomic Office Chair',
      sku: 'ERG-CH-002',
      category: 'Furniture'
    },
    currentStock: 3,
    minStockLevel: 5,
    location: 'Warehouse B',
    aisle: 'B-08',
    shelf: 'S1',
    lastUpdated: '2024-01-14'
  },
  {
    id: 3,
    product: {
      name: 'Wireless Mechanical Keyboard',
      sku: 'WMK-003',
      category: 'Electronics'
    },
    currentStock: 25,
    minStockLevel: 10,
    location: 'Warehouse A',
    aisle: 'A-15',
    shelf: 'S2',
    lastUpdated: '2024-01-13'
  },
  {
    id: 4,
    product: {
      name: 'Standing Desk Pro',
      sku: 'STD-DK-004',
      category: 'Furniture'
    },
    currentStock: 2,
    minStockLevel: 3,
    location: 'Warehouse B',
    aisle: 'B-12',
    shelf: 'S4',
    lastUpdated: '2024-01-12'
  },
  {
    id: 5,
    product: {
      name: 'Noise Cancelling Headphones',
      sku: 'NCH-005',
      category: 'Electronics'
    },
    currentStock: 0,
    minStockLevel: 8,
    location: 'Warehouse A',
    aisle: 'A-18',
    shelf: 'S1',
    lastUpdated: '2024-01-11'
  },
  {
    id: 6,
    product: {
      name: 'Office Supplies Kit',
      sku: 'OSK-006',
      category: 'Stationery'
    },
    currentStock: 45,
    minStockLevel: 20,
    location: 'Warehouse C',
    aisle: 'C-03',
    shelf: 'S2',
    lastUpdated: '2024-01-10'
  }
];

const axios = {
  get: () => Promise.resolve({ data: mockInventory }),
  put: (url, data) => Promise.resolve({ data }),
  delete: (url) => Promise.resolve({ data: {} })
};

function InventoryManagement() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });
  const [formData, setFormData] = useState({
    product: '',
    currentStock: '',
    minStockLevel: '',
    location: '',
    aisle: '',
    shelf: ''
  });
  const [formErrors, setFormErrors] = useState({});
  
  const { logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const locations = ['Warehouse A', 'Warehouse B', 'Warehouse C', 'Store Front', 'Backroom'];
  const aisles = ['A-01', 'A-12', 'A-15', 'A-18', 'B-08', 'B-12', 'C-03', 'C-07'];
  const shelves = ['S1', 'S2', 'S3', 'S4', 'S5'];

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/inventory');
      setInventory(response.data);
    } catch (error) {
      showSnackbar('Error fetching inventory', 'error');
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.product.trim()) errors.product = 'Product is required';
    if (!formData.currentStock || formData.currentStock < 0) errors.currentStock = 'Valid current stock is required';
    if (!formData.minStockLevel || formData.minStockLevel < 0) errors.minStockLevel = 'Valid minimum stock level is required';
    if (!formData.location.trim()) errors.location = 'Location is required';
    if (!formData.aisle.trim()) errors.aisle = 'Aisle is required';
    if (!formData.shelf.trim()) errors.shelf = 'Shelf is required';

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
      if (editingItem) {
        await axios.put(`http://localhost:8080/api/inventory/${editingItem.id}`, {
          ...formData,
          currentStock: parseInt(formData.currentStock),
          minStockLevel: parseInt(formData.minStockLevel)
        });
        showSnackbar('Inventory item updated successfully');
      } else {
        await axios.post('http://localhost:8080/api/inventory', {
          ...formData,
          currentStock: parseInt(formData.currentStock),
          minStockLevel: parseInt(formData.minStockLevel)
        });
        showSnackbar('Inventory item added successfully');
      }
      setOpen(false);
      resetForm();
      fetchInventory();
    } catch (error) {
      showSnackbar('Error saving inventory item', 'error');
      console.error('Error saving inventory item:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStockUpdate = async (itemId, newQuantity) => {
    try {
      setLoading(true);
      await axios.put(`http://localhost:8080/api/inventory/${itemId}/stock`, { 
        quantity: Math.max(0, newQuantity) 
      });
      showSnackbar('Stock updated successfully');
      fetchInventory();
    } catch (error) {
      showSnackbar('Error updating stock', 'error');
      console.error('Error updating stock:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      product: item.product?.name || '',
      currentStock: item.currentStock || '',
      minStockLevel: item.minStockLevel || '',
      location: item.location || '',
      aisle: item.aisle || '',
      shelf: item.shelf || ''
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this inventory item?')) {
      try {
        setLoading(true);
        await axios.delete(`http://localhost:8080/api/inventory/${id}`);
        showSnackbar('Inventory item deleted successfully');
        fetchInventory();
      } catch (error) {
        showSnackbar('Error deleting inventory item', 'error');
        console.error('Error deleting inventory item:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setEditingItem(null);
    setFormData({
      product: '',
      currentStock: '',
      minStockLevel: '',
      location: '',
      aisle: '',
      shelf: ''
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
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const getStockStatus = (current, min) => {
    if (current === 0) return { status: 'Out of Stock', color: 'error', icon: <Warning /> };
    if (current <= min) return { status: 'Low Stock', color: 'warning', icon: <Warning /> };
    return { status: 'In Stock', color: 'success', icon: <CheckCircle /> };
  };

  const getStockPercentage = (current, min) => {
    const optimal = min * 3;
    return Math.min((current / optimal) * 100, 100);
  };

  const getProgressColor = (percentage, status) => {
    if (status === 'Out of Stock') return '#f44336';
    if (status === 'Low Stock') return '#ff9800';
    if (percentage >= 80) return '#4caf50';
    if (percentage >= 50) return '#2196f3';
    return '#ff9800';
  };

  const lowStockItems = inventory.filter(item => item.currentStock <= item.minStockLevel && item.currentStock > 0);
  const outOfStockItems = inventory.filter(item => item.currentStock === 0);
  const healthyStockItems = inventory.filter(item => item.currentStock > item.minStockLevel);

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
          <Store sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Inventory Management
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
            Inventory Overview
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
              backgroundColor: '#d32f2f',
              boxShadow: 3,
              '&:hover': {
                backgroundColor: '#b71c1c',
                boxShadow: 6,
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.2s'
            }}
          >
            Add to Inventory
          </Button>
        </Box>

        {/* Summary Cards */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ backgroundColor: '#4caf50', color: 'white' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Healthy Stock
                </Typography>
                <Typography variant="h3" fontWeight="700">
                  {healthyStockItems.length}
                </Typography>
                <Typography variant="body2">
                  Items with sufficient stock
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ backgroundColor: '#ff9800', color: 'white' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Low Stock
                </Typography>
                <Typography variant="h3" fontWeight="700">
                  {lowStockItems.length}
                </Typography>
                <Typography variant="body2">
                  Items needing restock
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Card sx={{ backgroundColor: '#f44336', color: 'white' }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Out of Stock
                </Typography>
                <Typography variant="h3" fontWeight="700">
                  {outOfStockItems.length}
                </Typography>
                <Typography variant="body2">
                  Items out of stock
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Inventory Table */}
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
                    <TableCell sx={{ width: '20%' }}>Product</TableCell>
                    <TableCell sx={{ width: '10%' }}>SKU</TableCell>
                    <TableCell sx={{ width: '10%' }}>Current Stock</TableCell>
                    <TableCell sx={{ width: '10%' }}>Min Level</TableCell>
                    <TableCell sx={{ width: '15%' }}>Stock Status</TableCell>
                    <TableCell sx={{ width: '15%' }}>Location</TableCell>
                    <TableCell sx={{ width: '15%' }}>Stock Level</TableCell>
                    <TableCell sx={{ width: '5%' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {inventory.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                        <Typography variant="h6" color="textSecondary" gutterBottom>
                          No inventory items found
                        </Typography>
                        <Typography color="textSecondary" sx={{ mb: 3 }}>
                          Get started by adding your first inventory item
                        </Typography>
                        <Button
                          variant="contained"
                          startIcon={<Add />}
                          onClick={() => setOpen(true)}
                          sx={{ backgroundColor: '#d32f2f' }}
                        >
                          Add to Inventory
                        </Button>
                      </TableCell>
                    </TableRow>
                  ) : (
                    inventory.map((item) => {
                      const stockStatus = getStockStatus(item.currentStock, item.minStockLevel);
                      const stockPercentage = getStockPercentage(item.currentStock, item.minStockLevel);
                      
                      return (
                        <TableRow 
                          key={item.id}
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
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                              <Typography variant="subtitle1" fontWeight="600">
                                {item.product?.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {item.product?.category}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Chip 
                              label={item.product?.sku} 
                              size="small" 
                              variant="outlined"
                              sx={{ fontWeight: 600 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Typography 
                              variant="subtitle1" 
                              fontWeight="700" 
                              color={
                                item.currentStock <= item.minStockLevel ? 
                                'error' : 'success.main'
                              }
                            >
                              {item.currentStock}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body1" fontWeight="500">
                              {item.minStockLevel}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              icon={stockStatus.icon}
                              label={stockStatus.status}
                              color={stockStatus.color}
                              size="small"
                              sx={{ fontWeight: 600, minWidth: 120 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                              <Typography variant="body2" fontWeight="500">
                                {item.location}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {item.aisle} - {item.shelf}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell sx={{ width: 150 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                              <LinearProgress 
                                variant="determinate" 
                                value={stockPercentage} 
                                sx={{ 
                                  flexGrow: 1,
                                  height: 8,
                                  borderRadius: 4,
                                  backgroundColor: '#f0f0f0',
                                  '& .MuiLinearProgress-bar': {
                                    backgroundColor: getProgressColor(stockPercentage, stockStatus.status)
                                  }
                                }}
                              />
                              <Typography variant="body2" color="text.secondary" sx={{ minWidth: 35 }}>
                                {Math.round(stockPercentage)}%
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box sx={{ display: 'flex', gap: 0.5 }}>
                              <IconButton 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStockUpdate(item.id, item.currentStock + 1);
                                }} 
                                color="success"
                                size="small"
                                sx={{ 
                                  backgroundColor: 'success.light',
                                  '&:hover': { backgroundColor: 'success.main' }
                                }}
                              >
                                <Add sx={{ color: 'white', fontSize: 16 }} />
                              </IconButton>
                              <IconButton 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStockUpdate(item.id, Math.max(0, item.currentStock - 1));
                                }} 
                                color="warning"
                                size="small"
                                sx={{ 
                                  backgroundColor: 'warning.light',
                                  '&:hover': { backgroundColor: 'warning.main' }
                                }}
                              >
                                <Remove sx={{ color: 'white', fontSize: 16 }} />
                              </IconButton>
                              <IconButton 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEdit(item);
                                }} 
                                color="primary"
                                size="small"
                                sx={{ 
                                  backgroundColor: 'primary.light',
                                  '&:hover': { backgroundColor: 'primary.main' }
                                }}
                              >
                                <Edit sx={{ color: 'white', fontSize: 16 }} />
                              </IconButton>
                            </Box>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Paper>
      </Box>

      {/* Add/Edit Inventory Dialog */}
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
            {editingItem ? 'Edit Inventory Item' : 'Add to Inventory'}
          </Typography>
          <IconButton onClick={handleCloseDialog}>
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              autoFocus
              label="Product Name"
              fullWidth
              required
              value={formData.product}
              onChange={(e) => handleInputChange('product', e.target.value)}
              error={!!formErrors.product}
              helperText={formErrors.product}
              size="medium"
            />
            
            <Box sx={{ display: 'flex', gap: 2, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
              <TextField
                label="Current Stock"
                type="number"
                fullWidth
                required
                value={formData.currentStock}
                onChange={(e) => handleInputChange('currentStock', e.target.value)}
                error={!!formErrors.currentStock}
                helperText={formErrors.currentStock}
                size="medium"
                inputProps={{ min: "0" }}
              />
              <TextField
                label="Minimum Stock Level"
                type="number"
                fullWidth
                required
                value={formData.minStockLevel}
                onChange={(e) => handleInputChange('minStockLevel', e.target.value)}
                error={!!formErrors.minStockLevel}
                helperText={formErrors.minStockLevel}
                size="medium"
                inputProps={{ min: "0" }}
              />
            </Box>

            <FormControl fullWidth error={!!formErrors.location}>
              <InputLabel>Location</InputLabel>
              <Select
                value={formData.location}
                label="Location"
                onChange={(e) => handleInputChange('location', e.target.value)}
                size="medium"
              >
                {locations.map((location) => (
                  <MenuItem key={location} value={location}>
                    {location}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.location && (
                <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                  {formErrors.location}
                </Typography>
              )}
            </FormControl>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
              <FormControl fullWidth error={!!formErrors.aisle}>
                <InputLabel>Aisle</InputLabel>
                <Select
                  value={formData.aisle}
                  label="Aisle"
                  onChange={(e) => handleInputChange('aisle', e.target.value)}
                  size="medium"
                >
                  {aisles.map((aisle) => (
                    <MenuItem key={aisle} value={aisle}>
                      {aisle}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.aisle && (
                  <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                    {formErrors.aisle}
                  </Typography>
                )}
              </FormControl>

              <FormControl fullWidth error={!!formErrors.shelf}>
                <InputLabel>Shelf</InputLabel>
                <Select
                  value={formData.shelf}
                  label="Shelf"
                  onChange={(e) => handleInputChange('shelf', e.target.value)}
                  size="medium"
                >
                  {shelves.map((shelf) => (
                    <MenuItem key={shelf} value={shelf}>
                      {shelf}
                    </MenuItem>
                  ))}
                </Select>
                {formErrors.shelf && (
                  <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                    {formErrors.shelf}
                  </Typography>
                )}
              </FormControl>
            </Box>
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
              backgroundColor: '#d32f2f',
              '&:hover': {
                backgroundColor: '#b71c1c'
              }
            }}
          >
            {loading ? <CircularProgress size={24} /> : editingItem ? 'Update Item' : 'Add Item'}
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

export default InventoryManagement;