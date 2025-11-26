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
  Grid
} from '@mui/material';
import { Add, Edit, Delete, LocalShipping, ArrowBack, Visibility, Close, Inventory, CheckCircle, PendingActions } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Mock data and functions to replace missing dependencies
const useAuth = () => ({
  logout: () => console.log('Logout clicked')
});

const mockPurchaseOrders = [
  {
    id: 1,
    poNumber: 'PO-2024-001',
    supplier: {
      name: 'Tech Supplies Inc.',
      contact: 'supply@techsupplies.com',
      phone: '+1 (555) 111-2222'
    },
    product: {
      name: 'MacBook Pro 16"',
      sku: 'MBP-16-001'
    },
    quantity: 10,
    unitPrice: 2199.99,
    totalAmount: 21999.90,
    orderDate: '2024-01-15',
    expectedDelivery: '2024-01-25',
    status: 'ORDERED',
    notes: 'Urgent order for upcoming project'
  },
  {
    id: 2,
    poNumber: 'PO-2024-002',
    supplier: {
      name: 'Office Furniture Co.',
      contact: 'orders@officefurniture.com',
      phone: '+1 (555) 333-4444'
    },
    product: {
      name: 'Ergonomic Office Chair',
      sku: 'ERG-CH-002'
    },
    quantity: 5,
    unitPrice: 349.99,
    totalAmount: 1749.95,
    orderDate: '2024-01-14',
    expectedDelivery: '2024-01-20',
    status: 'RECEIVED',
    notes: 'Standard office setup'
  },
  {
    id: 3,
    poNumber: 'PO-2024-003',
    supplier: {
      name: 'Electronics Distributors',
      contact: 'sales@electronics-dist.com',
      phone: '+1 (555) 555-6666'
    },
    product: {
      name: 'Wireless Mechanical Keyboard',
      sku: 'WMK-003'
    },
    quantity: 25,
    unitPrice: 129.99,
    totalAmount: 3249.75,
    orderDate: '2024-01-13',
    expectedDelivery: '2024-01-18',
    status: 'DISPATCHED',
    notes: 'For retail inventory'
  },
  {
    id: 4,
    poNumber: 'PO-2024-004',
    supplier: {
      name: 'Global Tech Parts',
      contact: 'purchasing@globaltechparts.com',
      phone: '+1 (555) 777-8888'
    },
    product: {
      name: 'Noise Cancelling Headphones',
      sku: 'NCH-005'
    },
    quantity: 15,
    unitPrice: 299.99,
    totalAmount: 4499.85,
    orderDate: '2024-01-12',
    expectedDelivery: '2024-01-22',
    status: 'CANCELLED',
    notes: 'Cancelled due to budget constraints'
  },
  {
    id: 5,
    poNumber: 'PO-2024-005',
    supplier: {
      name: 'Premium Supplies Ltd.',
      contact: 'orders@premiumsupplies.com',
      phone: '+1 (555) 999-0000'
    },
    product: {
      name: 'Standing Desk Pro',
      sku: 'STD-DK-004'
    },
    quantity: 3,
    unitPrice: 599.99,
    totalAmount: 1799.97,
    orderDate: '2024-01-11',
    expectedDelivery: '2024-01-21',
    status: 'PARTIAL',
    notes: '2 units received, 1 pending'
  }
];

const axios = {
  get: () => Promise.resolve({ data: mockPurchaseOrders }),
  post: (url, data) => {
    const newOrder = { 
      ...data, 
      id: Date.now(),
      poNumber: `PO-2024-${String(Date.now()).slice(-3)}`,
      orderDate: new Date().toISOString().split('T')[0],
      totalAmount: data.quantity * data.unitPrice
    };
    return Promise.resolve({ data: newOrder });
  },
  put: (url, data) => Promise.resolve({ data }),
  delete: (url) => Promise.resolve({ data: {} })
};

function PurchaseOrdersManagement() {
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });
  const [formData, setFormData] = useState({
    supplier: '',
    supplierContact: '',
    supplierPhone: '',
    product: '',
    productSku: '',
    quantity: '',
    unitPrice: '',
    expectedDelivery: '',
    status: 'ORDERED',
    notes: ''
  });
  const [formErrors, setFormErrors] = useState({});
  
  const { logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const suppliers = [
    { name: 'Tech Supplies Inc.', contact: 'supply@techsupplies.com', phone: '+1 (555) 111-2222' },
    { name: 'Office Furniture Co.', contact: 'orders@officefurniture.com', phone: '+1 (555) 333-4444' },
    { name: 'Electronics Distributors', contact: 'sales@electronics-dist.com', phone: '+1 (555) 555-6666' },
    { name: 'Global Tech Parts', contact: 'purchasing@globaltechparts.com', phone: '+1 (555) 777-8888' },
    { name: 'Premium Supplies Ltd.', contact: 'orders@premiumsupplies.com', phone: '+1 (555) 999-0000' }
  ];

  const products = [
    { name: 'MacBook Pro 16"', sku: 'MBP-16-001' },
    { name: 'Ergonomic Office Chair', sku: 'ERG-CH-002' },
    { name: 'Wireless Mechanical Keyboard', sku: 'WMK-003' },
    { name: 'Standing Desk Pro', sku: 'STD-DK-004' },
    { name: 'Noise Cancelling Headphones', sku: 'NCH-005' }
  ];

  useEffect(() => {
    fetchPurchaseOrders();
  }, []);

  const fetchPurchaseOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/purchase-orders');
      setPurchaseOrders(response.data);
    } catch (error) {
      showSnackbar('Error fetching purchase orders', 'error');
      console.error('Error fetching purchase orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.supplier.trim()) errors.supplier = 'Supplier is required';
    if (!formData.product.trim()) errors.product = 'Product is required';
    if (!formData.quantity || formData.quantity <= 0) errors.quantity = 'Valid quantity is required';
    if (!formData.unitPrice || formData.unitPrice <= 0) errors.unitPrice = 'Valid unit price is required';
    if (!formData.expectedDelivery) errors.expectedDelivery = 'Expected delivery date is required';

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
      await axios.post('http://localhost:8080/api/purchase-orders', {
        ...formData,
        quantity: parseInt(formData.quantity),
        unitPrice: parseFloat(formData.unitPrice)
      });
      showSnackbar('Purchase order created successfully');
      setOpen(false);
      resetForm();
      fetchPurchaseOrders();
    } catch (error) {
      showSnackbar('Error creating purchase order', 'error');
      console.error('Error creating purchase order:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setLoading(true);
      await axios.put(`http://localhost:8080/api/purchase-orders/${orderId}/status`, { status: newStatus });
      showSnackbar('Order status updated successfully');
      fetchPurchaseOrders();
    } catch (error) {
      showSnackbar('Error updating order status', 'error');
      console.error('Error updating order status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this purchase order?')) {
      try {
        setLoading(true);
        await axios.delete(`http://localhost:8080/api/purchase-orders/${id}`);
        showSnackbar('Purchase order deleted successfully');
        fetchPurchaseOrders();
      } catch (error) {
        showSnackbar('Error deleting purchase order', 'error');
        console.error('Error deleting purchase order:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setDetailsOpen(true);
  };

  const resetForm = () => {
    setFormData({
      supplier: '',
      supplierContact: '',
      supplierPhone: '',
      product: '',
      productSku: '',
      quantity: '',
      unitPrice: '',
      expectedDelivery: '',
      status: 'ORDERED',
      notes: ''
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

  const handleSupplierChange = (supplierName) => {
    const selectedSupplier = suppliers.find(s => s.name === supplierName);
    setFormData(prev => ({
      ...prev,
      supplier: supplierName,
      supplierContact: selectedSupplier?.contact || '',
      supplierPhone: selectedSupplier?.phone || ''
    }));
  };

  const handleProductChange = (productName) => {
    const selectedProduct = products.find(p => p.name === productName);
    setFormData(prev => ({
      ...prev,
      product: productName,
      productSku: selectedProduct?.sku || ''
    }));
  };

  const getStatusColor = (status) => {
    const colors = {
      ORDERED: 'warning',
      DISPATCHED: 'info',
      RECEIVED: 'success',
      PARTIAL: 'secondary',
      CANCELLED: 'error'
    };
    return colors[status] || 'default';
  };

  const getStatusIcon = (status) => {
    const icons = {
      ORDERED: <PendingActions fontSize="small" />,
      DISPATCHED: <LocalShipping fontSize="small" />,
      RECEIVED: <CheckCircle fontSize="small" />,
      PARTIAL: <Inventory fontSize="small" />,
      CANCELLED: <Close fontSize="small" />
    };
    return icons[status];
  };

  const getStatusText = (status) => {
    const texts = {
      ORDERED: 'Ordered',
      DISPATCHED: 'Dispatched',
      RECEIVED: 'Received',
      PARTIAL: 'Partial',
      CANCELLED: 'Cancelled'
    };
    return texts[status];
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
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
          <LocalShipping sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Purchase Orders Management
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
            Purchase Orders
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
              backgroundColor: '#9c27b0',
              boxShadow: 3,
              '&:hover': {
                backgroundColor: '#7b1fa2',
                boxShadow: 6,
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.2s'
            }}
          >
            Create PO
          </Button>
        </Box>

        {/* Purchase Orders Table */}
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
                    <TableCell sx={{ width: '15%' }}>PO Number</TableCell>
                    <TableCell sx={{ width: '20%' }}>Supplier</TableCell>
                    <TableCell sx={{ width: '15%' }}>Product</TableCell>
                    <TableCell sx={{ width: '10%' }}>Quantity</TableCell>
                    <TableCell sx={{ width: '15%' }}>Total Amount</TableCell>
                    <TableCell sx={{ width: '15%' }}>Status</TableCell>
                    <TableCell sx={{ width: '10%' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {purchaseOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} align="center" sx={{ py: 8 }}>
                        <Typography variant="h6" color="textSecondary" gutterBottom>
                          No purchase orders found
                        </Typography>
                        <Typography color="textSecondary" sx={{ mb: 3 }}>
                          Get started by creating your first purchase order
                        </Typography>
                        <Button
                          variant="contained"
                          startIcon={<Add />}
                          onClick={() => setOpen(true)}
                          sx={{ backgroundColor: '#9c27b0' }}
                        >
                          Create PO
                        </Button>
                      </TableCell>
                    </TableRow>
                  ) : (
                    purchaseOrders.map((order) => (
                      <TableRow 
                        key={order.id}
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
                          <Typography variant="subtitle1" fontWeight="600" color="primary">
                            {order.poNumber}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography fontWeight="600" sx={{ mb: 0.5 }}>
                              {order.supplier?.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {order.supplier?.contact}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography fontWeight="500">
                              {order.product?.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              SKU: {order.product?.sku}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={order.quantity} 
                            color="primary" 
                            variant="outlined"
                            sx={{ fontWeight: 600 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="subtitle1" fontWeight="700" color="primary">
                            {formatCurrency(order.totalAmount)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <FormControl size="small" sx={{ minWidth: 140 }}>
                            <Select
                              value={order.status}
                              onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                              sx={{ 
                                height: 32,
                                '& .MuiSelect-select': {
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 1
                                }
                              }}
                              renderValue={(value) => (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  {getStatusIcon(value)}
                                  {getStatusText(value)}
                                </Box>
                              )}
                            >
                              <MenuItem value="ORDERED">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <PendingActions fontSize="small" />
                                  Ordered
                                </Box>
                              </MenuItem>
                              <MenuItem value="DISPATCHED">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <LocalShipping fontSize="small" />
                                  Dispatched
                                </Box>
                              </MenuItem>
                              <MenuItem value="RECEIVED">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <CheckCircle fontSize="small" />
                                  Received
                                </Box>
                              </MenuItem>
                              <MenuItem value="PARTIAL">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Inventory fontSize="small" />
                                  Partial
                                </Box>
                              </MenuItem>
                              <MenuItem value="CANCELLED">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Close fontSize="small" />
                                  Cancelled
                                </Box>
                              </MenuItem>
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <IconButton 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetails(order);
                              }} 
                              color="info"
                              size="small"
                              sx={{ 
                                backgroundColor: 'info.light',
                                '&:hover': { backgroundColor: 'info.main' }
                              }}
                            >
                              <Visibility sx={{ color: 'white', fontSize: 18 }} />
                            </IconButton>
                            <IconButton 
                              onClick={(e) => {
                                e.stopPropagation();
                                // Handle edit functionality
                                console.log('Edit order:', order.id);
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
                                handleDelete(order.id);
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

      {/* Create Purchase Order Dialog */}
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
            Create Purchase Order
          </Typography>
          <IconButton onClick={handleCloseDialog}>
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth error={!!formErrors.supplier}>
              <InputLabel>Supplier</InputLabel>
              <Select
                value={formData.supplier}
                label="Supplier"
                onChange={(e) => handleSupplierChange(e.target.value)}
                size="medium"
              >
                {suppliers.map((supplier) => (
                  <MenuItem key={supplier.name} value={supplier.name}>
                    {supplier.name}
                  </MenuItem>
                ))}
              </Select>
              {formErrors.supplier && (
                <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                  {formErrors.supplier}
                </Typography>
              )}
            </FormControl>

            <FormControl fullWidth error={!!formErrors.product}>
              <InputLabel>Product</InputLabel>
              <Select
                value={formData.product}
                label="Product"
                onChange={(e) => handleProductChange(e.target.value)}
                size="medium"
              >
                {products.map((product) => (
                  <MenuItem key={product.name} value={product.name}>
                    {product.name} ({product.sku})
                  </MenuItem>
                ))}
              </Select>
              {formErrors.product && (
                <Typography variant="caption" color="error" sx={{ ml: 2, mt: 0.5 }}>
                  {formErrors.product}
                </Typography>
              )}
            </FormControl>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
              <TextField
                label="Quantity"
                type="number"
                fullWidth
                required
                value={formData.quantity}
                onChange={(e) => handleInputChange('quantity', e.target.value)}
                error={!!formErrors.quantity}
                helperText={formErrors.quantity}
                size="medium"
                inputProps={{ min: "1" }}
              />
              <TextField
                label="Unit Price"
                type="number"
                fullWidth
                required
                value={formData.unitPrice}
                onChange={(e) => handleInputChange('unitPrice', e.target.value)}
                error={!!formErrors.unitPrice}
                helperText={formErrors.unitPrice}
                size="medium"
                inputProps={{ 
                  step: "0.01",
                  min: "0"
                }}
              />
            </Box>

            <TextField
              label="Expected Delivery"
              type="date"
              fullWidth
              required
              InputLabelProps={{ shrink: true }}
              value={formData.expectedDelivery}
              onChange={(e) => handleInputChange('expectedDelivery', e.target.value)}
              error={!!formErrors.expectedDelivery}
              helperText={formErrors.expectedDelivery}
              size="medium"
            />

            <TextField
              label="Notes"
              fullWidth
              multiline
              rows={2}
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
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
            sx={{ 
              px: 4,
              backgroundColor: '#9c27b0',
              '&:hover': {
                backgroundColor: '#7b1fa2'
              }
            }}
          >
            {loading ? <CircularProgress size={24} /> : 'Create Purchase Order'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Order Details Dialog */}
      <Dialog 
        open={detailsOpen} 
        onClose={() => setDetailsOpen(false)} 
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{
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
            Purchase Order Details - {selectedOrder?.poNumber}
          </Typography>
          <IconButton onClick={() => setDetailsOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          {selectedOrder && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Supplier Information */}
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="600">
                    Supplier Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Supplier Name
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        {selectedOrder.supplier?.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Contact Email
                      </Typography>
                      <Typography variant="body1">
                        {selectedOrder.supplier?.contact}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Phone
                      </Typography>
                      <Typography variant="body1">
                        {selectedOrder.supplier?.phone}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Order Date
                      </Typography>
                      <Typography variant="body1">
                        {new Date(selectedOrder.orderDate).toLocaleDateString()}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>

              {/* Order Information */}
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="600">
                    Order Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Product
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        {selectedOrder.product?.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        SKU: {selectedOrder.product?.sku}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Typography variant="body2" color="text.secondary">
                        Quantity
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        {selectedOrder.quantity}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={3}>
                      <Typography variant="body2" color="text.secondary">
                        Unit Price
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        {formatCurrency(selectedOrder.unitPrice)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Expected Delivery
                      </Typography>
                      <Typography variant="body1">
                        {selectedOrder.expectedDelivery ? 
                          new Date(selectedOrder.expectedDelivery).toLocaleDateString() : 
                          'Not set'
                        }
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Total Amount
                      </Typography>
                      <Typography variant="h6" fontWeight="600" color="primary">
                        {formatCurrency(selectedOrder.totalAmount)}
                      </Typography>
                    </Grid>
                    {selectedOrder.notes && (
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary">
                          Notes
                        </Typography>
                        <Typography variant="body1">
                          {selectedOrder.notes}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
          <Button 
            onClick={() => setDetailsOpen(false)}
            size="large"
            sx={{ px: 4 }}
          >
            Close
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

export default PurchaseOrdersManagement;