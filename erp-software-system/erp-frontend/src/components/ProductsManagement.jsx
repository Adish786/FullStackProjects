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
  Fab,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Add, Edit, Delete, Inventory, ArrowBack, Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Mock data and functions
const useAuth = () => ({
  logout: () => console.log('Logout clicked')
});

const mockProducts = [
  {
    id: 1,
    name: 'MacBook Pro 16"',
    sku: 'MBP-16-001',
    category: 'Electronics',
    unitPrice: 2399.99,
    currentStock: 8,
    reorderLevel: 5
  },
  {
    id: 2,
    name: 'Ergonomic Office Chair',
    sku: 'ERG-CH-002',
    category: 'Furniture',
    unitPrice: 349.99,
    currentStock: 3,
    reorderLevel: 5
  },
  {
    id: 3,
    name: 'Wireless Mechanical Keyboard',
    sku: 'WMK-003',
    category: 'Electronics',
    unitPrice: 129.99,
    currentStock: 25,
    reorderLevel: 10
  },
  {
    id: 4,
    name: 'Standing Desk Pro',
    sku: 'STD-DK-004',
    category: 'Furniture',
    unitPrice: 599.99,
    currentStock: 2,
    reorderLevel: 3
  },
  {
    id: 5,
    name: 'Noise Cancelling Headphones',
    sku: 'NCH-005',
    category: 'Electronics',
    unitPrice: 299.99,
    currentStock: 15,
    reorderLevel: 8
  },
  {
    id: 6,
    name: 'Office Supplies Kit',
    sku: 'OSK-006',
    category: 'Stationery',
    unitPrice: 49.99,
    currentStock: 45,
    reorderLevel: 20
  }
];

const axios = {
  get: () => Promise.resolve({ data: mockProducts }),
  post: (url, data) => {
    const newProduct = { ...data, id: Date.now() };
    return Promise.resolve({ data: newProduct });
  },
  put: (url, data) => Promise.resolve({ data }),
  delete: (url) => Promise.resolve({ data: {} })
};

function ProductsManagement() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: '',
    unitPrice: '',
    currentStock: '',
    reorderLevel: ''
  });
  const [formErrors, setFormErrors] = useState({});
  
  const { logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const categories = ['Electronics', 'Furniture', 'Clothing', 'Books', 'Stationery', 'Other'];

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/products');
      setProducts(response.data);
    } catch (error) {
      showSnackbar('Error fetching products', 'error');
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = 'Product name is required';
    if (!formData.sku.trim()) errors.sku = 'SKU is required';
    if (!formData.category.trim()) errors.category = 'Category is required';
    if (!formData.unitPrice || formData.unitPrice <= 0) errors.unitPrice = 'Valid price is required';
    if (!formData.currentStock || formData.currentStock < 0) errors.currentStock = 'Valid stock quantity is required';
    if (!formData.reorderLevel || formData.reorderLevel < 0) errors.reorderLevel = 'Valid reorder level is required';

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
      if (editingProduct) {
        await axios.put(`http://localhost:8080/api/products/${editingProduct.id}`, {
          ...formData,
          unitPrice: parseFloat(formData.unitPrice),
          currentStock: parseInt(formData.currentStock),
          reorderLevel: parseInt(formData.reorderLevel)
        });
        showSnackbar('Product updated successfully');
      } else {
        await axios.post('http://localhost:8080/api/products', {
          ...formData,
          unitPrice: parseFloat(formData.unitPrice),
          currentStock: parseInt(formData.currentStock),
          reorderLevel: parseInt(formData.reorderLevel)
        });
        showSnackbar('Product created successfully');
      }
      setOpen(false);
      resetForm();
      fetchProducts();
    } catch (error) {
      showSnackbar('Error saving product', 'error');
      console.error('Error saving product:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      sku: product.sku || '',
      category: product.category || '',
      unitPrice: product.unitPrice || '',
      currentStock: product.currentStock || '',
      reorderLevel: product.reorderLevel || ''
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        setLoading(true);
        await axios.delete(`http://localhost:8080/api/products/${id}`);
        showSnackbar('Product deleted successfully');
        fetchProducts();
      } catch (error) {
        showSnackbar('Error deleting product', 'error');
        console.error('Error deleting product:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      sku: '',
      category: '',
      unitPrice: '',
      currentStock: '',
      reorderLevel: ''
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
          <Inventory sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Product Catalog
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
            Products
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
              boxShadow: 3,
              '&:hover': {
                boxShadow: 6,
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.2s'
            }}
          >
            Add Product
          </Button>
        </Box>

        {/* Products Table */}
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
                    <TableCell sx={{ width: '25%' }}>Product Name</TableCell>
                    <TableCell sx={{ width: '15%' }}>SKU</TableCell>
                    <TableCell sx={{ width: '15%' }}>Category</TableCell>
                    <TableCell sx={{ width: '12%' }}>Price</TableCell>
                    <TableCell sx={{ width: '10%' }}>Stock</TableCell>
                    <TableCell sx={{ width: '13%' }}>Status</TableCell>
                    <TableCell sx={{ width: '10%' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {products.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                        <Typography variant="h6" color="textSecondary" gutterBottom>
                          No products found
                        </Typography>
                        <Typography color="textSecondary" sx={{ mb: 3 }}>
                          Get started by adding your first product
                        </Typography>
                        <Button
                          variant="contained"
                          startIcon={<Add />}
                          onClick={() => setOpen(true)}
                        >
                          Add Product
                        </Button>
                      </TableCell>
                    </TableRow>
                  ) : (
                    products.map((product) => (
                      <TableRow 
                        key={product.id}
                        sx={{ 
                          '&:hover': { 
                            backgroundColor: '#f8fafc',
                            transform: 'scale(1)',
                          },
                          backgroundColor: product.currentStock <= product.reorderLevel ? 
                            '#fef2f2' : 'inherit',
                          transition: 'all 0.2s',
                          cursor: 'pointer',
                          '&:last-child td': { borderBottom: 0 }
                        }}
                      >
                        <TableCell>
                          <Typography variant="subtitle1" fontWeight="600">
                            {product.name}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={product.sku} 
                            size="small" 
                            variant="outlined"
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={product.category} 
                            size="small"
                            color="default"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle1" fontWeight="700" color="primary">
                            ${parseFloat(product.unitPrice).toFixed(2)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography 
                            variant="subtitle1" 
                            fontWeight="700" 
                            color={
                              product.currentStock <= product.reorderLevel ? 
                              'error' : 'success.main'
                            }
                          >
                            {product.currentStock}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={
                              product.currentStock <= product.reorderLevel ? 
                              'Low Stock' : 'In Stock'
                            }
                            color={
                              product.currentStock <= product.reorderLevel ? 
                              'error' : 'success'
                            }
                            size="small"
                            sx={{ fontWeight: 600, minWidth: 100 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(product);
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
                                handleDelete(product.id);
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

      {/* Add/Edit Product Dialog - Full Screen on Mobile */}
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
            {editingProduct ? 'Edit Product' : 'Add New Product'}
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
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              error={!!formErrors.name}
              helperText={formErrors.name}
              size="medium"
            />
            <TextField
              label="SKU"
              fullWidth
              required
              value={formData.sku}
              onChange={(e) => handleInputChange('sku', e.target.value)}
              error={!!formErrors.sku}
              helperText={formErrors.sku}
              size="medium"
            />
            <FormControl fullWidth error={!!formErrors.category}>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                label="Category"
                onChange={(e) => handleInputChange('category', e.target.value)}
                size="medium"
              >
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.category && (
                <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                  {formErrors.category}
                </Typography>
              )}
            </FormControl>
            <TextField
              label="Unit Price"
              type="number"
              fullWidth
              required
              value={formData.unitPrice}
              onChange={(e) => handleInputChange('unitPrice', e.target.value)}
              error={!!formErrors.unitPrice}
              helperText={formErrors.unitPrice}
              inputProps={{ 
                step: "0.01",
                min: "0"
              }}
              size="medium"
            />
            <TextField
              label="Current Stock"
              type="number"
              fullWidth
              required
              value={formData.currentStock}
              onChange={(e) => handleInputChange('currentStock', e.target.value)}
              error={!!formErrors.currentStock}
              helperText={formErrors.currentStock}
              inputProps={{ 
                min: "0"
              }}
              size="medium"
            />
            <TextField
              label="Reorder Level"
              type="number"
              fullWidth
              required
              value={formData.reorderLevel}
              onChange={(e) => handleInputChange('reorderLevel', e.target.value)}
              error={!!formErrors.reorderLevel}
              helperText={formErrors.reorderLevel}
              inputProps={{ 
                min: "0"
              }}
              size="medium"
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
            sx={{ px: 4 }}
          >
            {loading ? <CircularProgress size={24} /> : editingProduct ? 'Update Product' : 'Create Product'}
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

export default ProductsManagement;