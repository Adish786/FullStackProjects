import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Pagination,
  CircularProgress,
  Alert,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  Grid,
  Avatar,
  Fade,
  Slide,
  LinearProgress,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Visibility,
  LocalShipping,
  Receipt,
  Person,
  Email,
  CalendarToday,
  Payment,
  Inventory,
  Refresh,
  Download,
  Print,
} from '@mui/icons-material';
import { orderAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './OrderList.css';

// Dummy orders data for fallback
const dummyOrders = [
  {
    id: 1001,
    user: { name: 'John Doe', email: 'john@example.com' },
    orderDate: '2024-01-15T10:30:00',
    totalAmount: 89.97,
    status: 'DELIVERED',
    paymentStatus: 'COMPLETED',
    orderItems: [
      { book: { title: 'The Great Gatsby' }, quantity: 1, price: 12.99 },
      { book: { title: 'To Kill a Mockingbird' }, quantity: 2, price: 14.99 }
    ],
    shippingAddress: '123 Main St, New York, NY 10001'
  },
  {
    id: 1002,
    user: { name: 'Jane Smith', email: 'jane@example.com' },
    orderDate: '2024-01-14T14:20:00',
    totalAmount: 45.50,
    status: 'SHIPPED',
    paymentStatus: 'COMPLETED',
    orderItems: [
      { book: { title: 'Clean Code' }, quantity: 1, price: 35.99 }
    ],
    shippingAddress: '456 Oak Ave, Los Angeles, CA 90210'
  },
  {
    id: 1003,
    user: { name: 'Bob Johnson', email: 'bob@example.com' },
    orderDate: '2024-01-13T09:15:00',
    totalAmount: 67.25,
    status: 'PROCESSING',
    paymentStatus: 'PENDING',
    orderItems: [
      { book: { title: 'Sapiens' }, quantity: 1, price: 18.99 },
      { book: { title: 'The Hobbit' }, quantity: 1, price: 13.75 }
    ],
    shippingAddress: '789 Pine Rd, Chicago, IL 60601'
  },
  {
    id: 1004,
    user: { name: 'Alice Brown', email: 'alice@example.com' },
    orderDate: '2024-01-12T16:45:00',
    totalAmount: 22.99,
    status: 'PENDING',
    paymentStatus: 'PENDING',
    orderItems: [
      { book: { title: 'Steve Jobs Biography' }, quantity: 1, price: 22.99 }
    ],
    shippingAddress: '321 Elm St, Houston, TX 77002'
  },
  {
    id: 1005,
    user: { name: 'Charlie Wilson', email: 'charlie@example.com' },
    orderDate: '2024-01-11T11:20:00',
    totalAmount: 156.75,
    status: 'CANCELLED',
    paymentStatus: 'REFUNDED',
    orderItems: [
      { book: { title: 'The Da Vinci Code' }, quantity: 3, price: 11.99 },
      { book: { title: 'The Hidden Life of Trees' }, quantity: 2, price: 16.50 }
    ],
    shippingAddress: '654 Maple Dr, Phoenix, AZ 85001'
  }
];

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [useDummyData, setUseDummyData] = useState(false);
  const [filterStatus, setFilterStatus] = useState('ALL');

  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const statusFilters = [
    { value: 'ALL', label: 'All Orders', color: 'default' },
    { value: 'PENDING', label: 'Pending', color: 'default' },
    { value: 'PROCESSING', label: 'Processing', color: 'warning' },
    { value: 'SHIPPED', label: 'Shipped', color: 'info' },
    { value: 'DELIVERED', label: 'Delivered', color: 'success' },
    { value: 'CANCELLED', label: 'Cancelled', color: 'error' },
  ];

  const fetchOrders = async (pageNum = 0) => {
    setLoading(true);
    setError('');
    
    // Use dummy data if backend is not available
    if (useDummyData) {
      setTimeout(() => {
        let filteredOrders = [...dummyOrders];
        
        // Apply status filter
        if (filterStatus !== 'ALL') {
          filteredOrders = filteredOrders.filter(order => order.status === filterStatus);
        }
        
        // For customers, show only their orders
        if (user?.role === 'CUSTOMER') {
          filteredOrders = filteredOrders.filter(order => 
            order.user.email === user.email
          );
        }
        
        setOrders(filteredOrders);
        setTotalPages(1);
        setLoading(false);
      }, 1000);
      return;
    }

    try {
      const response = user?.role === 'ADMIN' 
        ? await orderAPI.getAll(pageNum, 10)
        : await orderAPI.getUserOrders(pageNum, 10);
      
      setOrders(response.data.content || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError('Failed to fetch orders from server. Using demo data instead.');
      setUseDummyData(true);
      fetchOrders(pageNum); // Retry with dummy data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const handlePageChange = (event, value) => {
    const newPage = value - 1;
    setPage(newPage);
    fetchOrders(newPage);
  };

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setDetailDialogOpen(true);
  };

  const handleRefresh = () => {
    fetchOrders(page);
  };

  const handleExport = () => {
    console.log('Exporting orders...');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'DELIVERED': return 'success';
      case 'SHIPPED': return 'info';
      case 'PROCESSING': return 'warning';
      case 'PENDING': return 'default';
      case 'CANCELLED': return 'error';
      default: return 'default';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'COMPLETED': return 'success';
      case 'PENDING': return 'warning';
      case 'FAILED': return 'error';
      case 'REFUNDED': return 'info';
      default: return 'default';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'DELIVERED': return '🎉';
      case 'SHIPPED': return '🚚';
      case 'PROCESSING': return '⚙️';
      case 'PENDING': return '⏳';
      case 'CANCELLED': return '❌';
      default: return '📦';
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const toggleDataMode = () => {
    setUseDummyData(!useDummyData);
    setPage(0);
    setTimeout(() => fetchOrders(0), 100);
  };

  // Determine which columns to show based on screen size
  const showCustomerColumn = user?.role === 'ADMIN' && !isMobile;
  const showPaymentColumn = !isMobile;
  const showItemsColumn = !isMobile;
  const showDateColumn = !isMobile;

  return (
    <Container maxWidth="xl" className="order-list-container">
      {/* Header Section */}
      <Box className="order-list-header">
        <Slide direction="down" in={true} timeout={800}>
          <Box>
            <Receipt className="header-icon" />
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom 
              fontWeight="bold"
              className="header-title"
            >
              {user?.role === 'ADMIN' ? 'Order Management' : 'My Orders'}
            </Typography>
            <Typography 
              variant="h6" 
              color="text.secondary" 
              className="header-subtitle"
            >
              {user?.role === 'ADMIN' 
                ? 'Manage and track all customer orders' 
                : 'Track your book purchases and order history'
              }
            </Typography>
          </Box>
        </Slide>
      </Box>

      {/* Stats & Controls */}
      <Card 
        elevation={3} 
        className="stats-controls-card"
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={6}>
            <Box className="status-filters">
              {statusFilters.map((filter) => (
                <Chip
                  key={filter.value}
                  label={filter.label}
                  color={filterStatus === filter.value ? 'primary' : filter.color}
                  variant={filterStatus === filter.value ? 'filled' : 'outlined'}
                  onClick={() => setFilterStatus(filter.value)}
                  clickable
                  className="status-filter-chip"
                />
              ))}
            </Box>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box className="controls-section">
              <Tooltip title="Refresh Orders">
                <IconButton onClick={handleRefresh} color="primary">
                  <Refresh />
                </IconButton>
              </Tooltip>
              <Tooltip title="Export Orders">
                <IconButton onClick={handleExport} color="primary">
                  <Download />
                </IconButton>
              </Tooltip>
              <Button
                variant={useDummyData ? "contained" : "outlined"}
                color={useDummyData ? "secondary" : "primary"}
                onClick={toggleDataMode}
                size="small"
              >
                {useDummyData ? "Demo Mode" : "Live Mode"}
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Card>

      {/* Error Alert */}
      {error && (
        <Alert 
          severity="warning" 
          className="error-alert"
          action={
            <Button color="inherit" size="small" onClick={toggleDataMode}>
              {useDummyData ? 'Try Live Data' : 'Use Demo'}
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {/* Loading State */}
      {loading ? (
        <Box className="loading-container">
          <CircularProgress size={60} thickness={4} />
          <Typography variant="h6" color="text.secondary" className="loading-text">
            Loading orders...
          </Typography>
          <LinearProgress className="loading-progress" />
        </Box>
      ) : (
        /* Orders Table */
        <Fade in={!loading} timeout={1000}>
          <Box>
            {orders.length === 0 ? (
              <Card className="no-orders-card">
                <Typography variant="h5" color="text.secondary" className="no-orders-title">
                  📦 No Orders Found
                </Typography>
                <Typography variant="body1" color="text.secondary" className="no-orders-text">
                  {filterStatus !== 'ALL' 
                    ? `No ${filterStatus.toLowerCase()} orders found.` 
                    : 'No orders match your criteria.'
                  }
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={() => setFilterStatus('ALL')}
                >
                  View All Orders
                </Button>
              </Card>
            ) : (
              <>
                <TableContainer 
                  component={Paper} 
                  elevation={3}
                  className="table-container"
                >
                  <Table>
                    <TableHead>
                      <TableRow className="table-header">
                        <TableCell className="table-header-cell">Order ID</TableCell>
                        {showCustomerColumn && (
                          <TableCell className="table-header-cell customer-column">Customer</TableCell>
                        )}
                        {showDateColumn && (
                          <TableCell className="table-header-cell date-column">Date & Time</TableCell>
                        )}
                        <TableCell className="table-header-cell">Total Amount</TableCell>
                        <TableCell className="table-header-cell">Status</TableCell>
                        {showPaymentColumn && (
                          <TableCell className="table-header-cell payment-column">Payment</TableCell>
                        )}
                        {showItemsColumn && (
                          <TableCell className="table-header-cell items-column">Items</TableCell>
                        )}
                        <TableCell className="table-header-cell">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {orders.map((order, index) => (
                        <Fade in={true} timeout={500 + (index * 100)} key={order.id}>
                          <TableRow className="table-row">
                            <TableCell className="table-cell">
                              <Typography fontWeight="bold" color="primary">
                                #{order.id}
                              </Typography>
                            </TableCell>
                            {showCustomerColumn && (
                              <TableCell className="table-cell customer-column">
                                <Box className="customer-info">
                                  <Avatar className="customer-avatar">
                                    <Person sx={{ fontSize: 16 }} />
                                  </Avatar>
                                  <Box className="customer-details">
                                    <Typography className="customer-name">
                                      {order.user?.name}
                                    </Typography>
                                    <Typography className="customer-email">
                                      {order.user?.email}
                                    </Typography>
                                  </Box>
                                </Box>
                              </TableCell>
                            )}
                            {showDateColumn && (
                              <TableCell className="table-cell date-column">
                                <Box className="date-info">
                                  <CalendarToday sx={{ fontSize: 16, color: 'text.secondary' }} />
                                  <Box>
                                    <Typography className="date-text">
                                      {formatDate(order.orderDate)}
                                    </Typography>
                                  </Box>
                                </Box>
                              </TableCell>
                            )}
                            <TableCell className="table-cell">
                              <Typography className="amount-text">
                                {formatCurrency(order.totalAmount)}
                              </Typography>
                            </TableCell>
                            <TableCell className="table-cell">
                              <Chip 
                                icon={<span>{getStatusIcon(order.status)}</span>}
                                label={order.status} 
                                color={getStatusColor(order.status)}
                                variant="filled"
                                className="status-chip"
                              />
                            </TableCell>
                            {showPaymentColumn && (
                              <TableCell className="table-cell payment-column">
                                <Chip 
                                  label={order.paymentStatus} 
                                  color={getPaymentStatusColor(order.paymentStatus)}
                                  variant="outlined"
                                  className="payment-chip"
                                />
                              </TableCell>
                            )}
                            {showItemsColumn && (
                              <TableCell className="table-cell items-column">
                                <Box className="items-info">
                                  <Inventory sx={{ fontSize: 16, color: 'text.secondary' }} />
                                  <Typography className="items-text">
                                    {order.orderItems?.length || 0} item(s)
                                  </Typography>
                                </Box>
                              </TableCell>
                            )}
                            <TableCell className="table-cell">
                              <Tooltip title="View Order Details">
                                <IconButton 
                                  onClick={() => handleViewDetails(order)}
                                  color="primary"
                                  className="action-button"
                                >
                                  <Visibility />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        </Fade>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>

                {/* Pagination */}
                {totalPages > 1 && (
                  <Box className="pagination-container">
                    <Pagination
                      count={totalPages}
                      page={page + 1}
                      onChange={handlePageChange}
                      color="primary"
                      size={isMobile ? "small" : "large"}
                      showFirstButton
                      showLastButton
                      className="pagination"
                    />
                  </Box>
                )}
              </>
            )}
          </Box>
        </Fade>
      )}

      {/* Order Details Dialog */}
      <Dialog
        open={detailDialogOpen}
        onClose={() => setDetailDialogOpen(false)}
        maxWidth="md"
        fullWidth
        className="dialog-container"
      >
        {selectedOrder && (
          <>
            <DialogTitle className="dialog-title">
              <Typography variant="h5" fontWeight="bold">
                Order Details #{selectedOrder.id}
              </Typography>
            </DialogTitle>
            <DialogContent className="dialog-content">
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Order Information</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography><strong>Date:</strong> {formatDate(selectedOrder.orderDate)}</Typography>
                    <Typography><strong>Status:</strong> 
                      <Chip 
                        label={selectedOrder.status} 
                        color={getStatusColor(selectedOrder.status)}
                        size="small"
                        sx={{ ml: 1 }}
                      />
                    </Typography>
                    <Typography><strong>Payment:</strong> 
                      <Chip 
                        label={selectedOrder.paymentStatus} 
                        color={getPaymentStatusColor(selectedOrder.paymentStatus)}
                        size="small"
                        variant="outlined"
                        sx={{ ml: 1 }}
                      />
                    </Typography>
                    <Typography><strong>Total:</strong> {formatCurrency(selectedOrder.totalAmount)}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" gutterBottom>Customer Information</Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography><strong>Name:</strong> {selectedOrder.user?.name}</Typography>
                    <Typography><strong>Email:</strong> {selectedOrder.user?.email}</Typography>
                    <Typography><strong>Shipping Address:</strong> {selectedOrder.shippingAddress}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>Order Items</Typography>
                  {selectedOrder.orderItems?.map((item, index) => (
                    <Card key={index} className="order-item-card">
                      <Typography><strong>{item.book.title}</strong></Typography>
                      <Typography>Quantity: {item.quantity} × {formatCurrency(item.price)}</Typography>
                      <Typography><strong>Subtotal: {formatCurrency(item.quantity * item.price)}</strong></Typography>
                    </Card>
                  ))}
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions className="dialog-actions">
              <Button onClick={() => setDetailDialogOpen(false)}>Close</Button>
              <Button variant="contained" startIcon={<Print />}>Print Receipt</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default OrderList;