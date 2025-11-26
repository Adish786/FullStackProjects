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
  CardContent
} from '@mui/material';
import { Add, Edit, Delete, ShoppingCart, ArrowBack, Visibility, Close, LocalShipping, CheckCircle, PendingActions } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Mock data and functions to replace missing dependencies
const useAuth = () => ({
  logout: () => console.log('Logout clicked')
});

const mockOrders = [
  {
    id: 1,
    orderNumber: 'SO-2024-001',
    customer: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1 (555) 123-4567'
    },
    orderDate: '2024-01-15',
    totalAmount: 1549.97,
    status: 'PENDING',
    items: [
      { product: 'MacBook Pro 16"', quantity: 1, price: 1299.99 },
      { product: 'Wireless Mouse', quantity: 1, price: 49.99 },
      { product: 'Laptop Sleeve', quantity: 1, price: 199.99 }
    ]
  },
  {
    id: 2,
    orderNumber: 'SO-2024-002',
    customer: {
      name: 'Acme Corporation',
      email: 'contact@acme.com',
      phone: '+1 (555) 987-6543'
    },
    orderDate: '2024-01-14',
    totalAmount: 299.99,
    status: 'APPROVED',
    items: [
      { product: 'Noise Cancelling Headphones', quantity: 1, price: 299.99 }
    ]
  },
  {
    id: 3,
    orderNumber: 'SO-2024-003',
    customer: {
      name: 'Sarah Wilson',
      email: 'sarah.wilson@email.com',
      phone: '+1 (555) 456-7890'
    },
    orderDate: '2024-01-13',
    totalAmount: 949.98,
    status: 'DISPATCHED',
    items: [
      { product: 'Standing Desk Pro', quantity: 1, price: 599.99 },
      { product: 'Ergonomic Office Chair', quantity: 1, price: 349.99 }
    ]
  },
  {
    id: 4,
    orderNumber: 'SO-2024-004',
    customer: {
      name: 'Global Tech Solutions',
      email: 'info@globaltech.com',
      phone: '+1 (555) 234-5678'
    },
    orderDate: '2024-01-12',
    totalAmount: 199.99,
    status: 'DELIVERED',
    items: [
      { product: 'Wireless Mechanical Keyboard', quantity: 1, price: 129.99 },
      { product: 'Mouse Pad', quantity: 1, price: 19.99 },
      { product: 'USB-C Hub', quantity: 1, price: 49.99 }
    ]
  },
  {
    id: 5,
    orderNumber: 'SO-2024-005',
    customer: {
      name: 'Tech Startup Inc',
      email: 'orders@techstartup.com',
      phone: '+1 (555) 345-6789'
    },
    orderDate: '2024-01-11',
    totalAmount: 749.99,
    status: 'CANCELLED',
    items: [
      { product: 'Gaming Monitor', quantity: 1, price: 749.99 }
    ]
  }
];

const axios = {
  get: () => Promise.resolve({ data: mockOrders }),
  put: (url, data) => Promise.resolve({ data }),
  delete: (url) => Promise.resolve({ data: {} })
};

function SalesOrdersManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });
  
  const { logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/api/sales-orders');
      setOrders(response.data);
    } catch (error) {
      showSnackbar('Error fetching sales orders', 'error');
      console.error('Error fetching sales orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      setLoading(true);
      await axios.put(`http://localhost:8080/api/sales-orders/${orderId}/status`, { status: newStatus });
      showSnackbar('Order status updated successfully');
      fetchOrders();
    } catch (error) {
      showSnackbar('Error updating order status', 'error');
      console.error('Error updating order status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this order?')) {
      try {
        setLoading(true);
        await axios.delete(`http://localhost:8080/api/sales-orders/${id}`);
        showSnackbar('Order deleted successfully');
        fetchOrders();
      } catch (error) {
        showSnackbar('Error deleting order', 'error');
        console.error('Error deleting order:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setOpen(true);
  };

  const getStatusColor = (status) => {
    const colors = {
      PENDING: 'warning',
      APPROVED: 'info',
      DISPATCHED: 'primary',
      DELIVERED: 'success',
      CANCELLED: 'error'
    };
    return colors[status] || 'default';
  };

  const getStatusIcon = (status) => {
    const icons = {
      PENDING: <PendingActions fontSize="small" />,
      APPROVED: <CheckCircle fontSize="small" />,
      DISPATCHED: <LocalShipping fontSize="small" />,
      DELIVERED: <CheckCircle fontSize="small" />,
      CANCELLED: <Close fontSize="small" />
    };
    return icons[status];
  };

  const getStatusText = (status) => {
    const texts = {
      PENDING: 'Pending',
      APPROVED: 'Approved',
      DISPATCHED: 'Dispatched',
      DELIVERED: 'Delivered',
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
          <ShoppingCart sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Sales Orders Management
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
            Sales Orders
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => navigate?.('/sales/create') || console.log('Create order')}
            size="large"
            sx={{ 
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 600,
              borderRadius: 2,
              backgroundColor: '#ed6c02',
              boxShadow: 3,
              '&:hover': {
                backgroundColor: '#d45a00',
                boxShadow: 6,
                transform: 'translateY(-2px)'
              },
              transition: 'all 0.2s'
            }}
          >
            Create Order
          </Button>
        </Box>

        {/* Orders Table */}
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
                    <TableCell sx={{ width: '15%' }}>Order ID</TableCell>
                    <TableCell sx={{ width: '20%' }}>Customer</TableCell>
                    <TableCell sx={{ width: '15%' }}>Order Date</TableCell>
                    <TableCell sx={{ width: '15%' }}>Total Amount</TableCell>
                    <TableCell sx={{ width: '20%' }}>Status</TableCell>
                    <TableCell sx={{ width: '15%' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center" sx={{ py: 8 }}>
                        <Typography variant="h6" color="textSecondary" gutterBottom>
                          No sales orders found
                        </Typography>
                        <Typography color="textSecondary" sx={{ mb: 3 }}>
                          Get started by creating your first sales order
                        </Typography>
                        <Button
                          variant="contained"
                          startIcon={<Add />}
                          onClick={() => navigate?.('/sales/create') || console.log('Create order')}
                          sx={{ backgroundColor: '#ed6c02' }}
                        >
                          Create Order
                        </Button>
                      </TableCell>
                    </TableRow>
                  ) : (
                    orders.map((order) => (
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
                            {order.orderNumber}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography fontWeight="600" sx={{ mb: 0.5 }}>
                              {order.customer?.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {order.customer?.email}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {order.customer?.phone}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" fontWeight="500">
                            {new Date(order.orderDate).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </Typography>
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
                              <MenuItem value="PENDING">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <PendingActions fontSize="small" />
                                  Pending
                                </Box>
                              </MenuItem>
                              <MenuItem value="APPROVED">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <CheckCircle fontSize="small" />
                                  Approved
                                </Box>
                              </MenuItem>
                              <MenuItem value="DISPATCHED">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <LocalShipping fontSize="small" />
                                  Dispatched
                                </Box>
                              </MenuItem>
                              <MenuItem value="DELIVERED">
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <CheckCircle fontSize="small" />
                                  Delivered
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

      {/* Order Details Dialog */}
      <Dialog 
        open={open} 
        onClose={() => setOpen(false)} 
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
            Order Details - {selectedOrder?.orderNumber}
          </Typography>
          <IconButton onClick={() => setOpen(false)}>
            <Close />
          </IconButton>
        </DialogTitle>
        
        <DialogContent sx={{ p: 3 }}>
          {selectedOrder && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Customer Information */}
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="600">
                    Customer Information
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Name
                      </Typography>
                      <Typography variant="body1" fontWeight="500">
                        {selectedOrder.customer?.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Email
                      </Typography>
                      <Typography variant="body1">
                        {selectedOrder.customer?.email}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="text.secondary">
                        Phone
                      </Typography>
                      <Typography variant="body1">
                        {selectedOrder.customer?.phone}
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

              {/* Order Items */}
              <Card variant="outlined">
                <CardContent>
                  <Typography variant="h6" gutterBottom fontWeight="600">
                    Order Items
                  </Typography>
                  <TableContainer>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Product</TableCell>
                          <TableCell align="right">Quantity</TableCell>
                          <TableCell align="right">Price</TableCell>
                          <TableCell align="right">Total</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {selectedOrder.items?.map((item, index) => (
                          <TableRow key={index}>
                            <TableCell>{item.product}</TableCell>
                            <TableCell align="right">{item.quantity}</TableCell>
                            <TableCell align="right">{formatCurrency(item.price)}</TableCell>
                            <TableCell align="right">{formatCurrency(item.quantity * item.price)}</TableCell>
                          </TableRow>
                        ))}
                        <TableRow>
                          <TableCell colSpan={3} align="right">
                            <Typography variant="h6" fontWeight="600">
                              Total Amount:
                            </Typography>
                          </TableCell>
                          <TableCell align="right">
                            <Typography variant="h6" fontWeight="600" color="primary">
                              {formatCurrency(selectedOrder.totalAmount)}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </TableContainer>
                </CardContent>
              </Card>
            </Box>
          )}
        </DialogContent>
        
        <DialogActions sx={{ p: 3, borderTop: 1, borderColor: 'divider' }}>
          <Button 
            onClick={() => setOpen(false)}
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

export default SalesOrdersManagement;