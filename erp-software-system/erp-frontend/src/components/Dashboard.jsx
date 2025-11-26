import React from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  AppBar,
  Toolbar,
  Button,
  Card,
  CardContent,
  Chip,
  Avatar,
  Divider,
  Stack
} from '@mui/material';
import {
  Inventory,
  People,
  ShoppingCart,
  Receipt,
  TrendingUp,
  Assessment,
  Security,
  ExitToApp,
  Dashboard as DashboardIcon,
  Store,
  LocalShipping
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const { userRole, userEmail, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Mock data for dashboard stats
  const stats = {
    totalProducts: 156,
    totalCustomers: 89,
    pendingOrders: 12,
    monthlyRevenue: '$45,230',
    lowStockItems: 8,
    completedOrders: 234
  };

  // Dashboard cards data
  const dashboardCards = [
    {
      title: 'Products Management',
      description: 'Manage your product catalog, inventory, and pricing',
      icon: <Inventory sx={{ fontSize: 40 }} />,
      path: '/products',
      color: '#1976d2',
      stats: `${stats.totalProducts} Products`
    },
    {
      title: 'Customer Management',
      description: 'Manage customer information and relationships',
      icon: <People sx={{ fontSize: 40 }} />,
      path: '/customers',
      color: '#2e7d32',
      stats: `${stats.totalCustomers} Customers`
    },
    {
      title: 'Sales Orders',
      description: 'Create and manage sales orders and invoices',
      icon: <ShoppingCart sx={{ fontSize: 40 }} />,
      path: '/sales',
      color: '#ed6c02',
      stats: `${stats.pendingOrders} Pending`
    },
    {
      title: 'Purchase Orders',
      description: 'Manage purchase orders and supplier relationships',
      icon: <LocalShipping sx={{ fontSize: 40 }} />,
      path: '/purchases',
      color: '#9c27b0',
      stats: 'Manage Suppliers'
    },
    {
      title: 'Inventory',
      description: 'Track stock levels and manage inventory',
      icon: <Store sx={{ fontSize: 40 }} />,
      path: '/inventory',
      color: '#d32f2f',
      stats: `${stats.lowStockItems} Low Stock`
    },
    {
      title: 'Reports & Analytics',
      description: 'View sales reports and business analytics',
      icon: <Assessment sx={{ fontSize: 40 }} />,
      path: '/reports',
      color: '#0288d1',
      stats: `${stats.monthlyRevenue} Revenue`
    }
  ];

  // Get role color
  const getRoleColor = (role) => {
    const colors = {
      ADMIN: '#f44336',
      SALES_EXECUTIVE: '#2196f3',
      PURCHASE_MANAGER: '#ff9800',
      INVENTORY_MANAGER: '#4caf50',
      ACCOUNTANT: '#9c27b0'
    };
    return colors[role] || '#666';
  };

  return (
    <Box sx={{ flexGrow: 1, minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <AppBar 
        position="static" 
        elevation={2}
        sx={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          mb: 3
        }}
      >
        <Toolbar>
          <DashboardIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            ERP System Dashboard
          </Typography>
          
          <Stack direction="row" spacing={2} alignItems="center">
            <Chip
              avatar={<Avatar sx={{ bgcolor: getRoleColor(userRole) }}><Security /></Avatar>}
              label={userRole?.replace('_', ' ') || 'User'}
              variant="outlined"
              sx={{ color: 'white', borderColor: 'white' }}
            />
            <Typography variant="body2" sx={{ color: 'white' }}>
              {userEmail}
            </Typography>
            <Button
              color="inherit"
              startIcon={<ExitToApp />}
              onClick={handleLogout}
              sx={{
                border: '1px solid rgba(255,255,255,0.3)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)'
                }
              }}
            >
              Logout
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mb: 4 }}>
        {/* Welcome Section */}
        <Paper
          elevation={2}
          sx={{
            p: 4,
            mb: 4,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: 2
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography variant="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                Welcome back!
              </Typography>
              <Typography variant="h6" sx={{ opacity: 0.9, mb: 2 }}>
                Here's what's happening with your business today.
              </Typography>
              <Stack direction="row" spacing={2}>
                <Chip 
                  label={`${stats.completedOrders} Orders`} 
                  sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} 
                />
                <Chip 
                  label={`${stats.monthlyRevenue} Revenue`} 
                  sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} 
                />
                <Chip 
                  label={`${stats.lowStockItems} Alerts`} 
                  sx={{ backgroundColor: 'rgba(255,255,255,0.2)', color: 'white' }} 
                />
              </Stack>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
              <TrendingUp sx={{ fontSize: 120, opacity: 0.8 }} />
            </Grid>
          </Grid>
        </Paper>

        {/* Quick Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                textAlign: 'center',
                backgroundColor: '#1976d2',
                color: 'white',
                borderRadius: 2
              }}
            >
              <Inventory sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {stats.totalProducts}
              </Typography>
              <Typography variant="body2">
                Total Products
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                textAlign: 'center',
                backgroundColor: '#2e7d32',
                color: 'white',
                borderRadius: 2
              }}
            >
              <People sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {stats.totalCustomers}
              </Typography>
              <Typography variant="body2">
                Customers
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                textAlign: 'center',
                backgroundColor: '#ed6c02',
                color: 'white',
                borderRadius: 2
              }}
            >
              <ShoppingCart sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {stats.pendingOrders}
              </Typography>
              <Typography variant="body2">
                Pending Orders
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Paper
              elevation={2}
              sx={{
                p: 3,
                textAlign: 'center',
                backgroundColor: '#9c27b0',
                color: 'white',
                borderRadius: 2
              }}
            >
              <Receipt sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h4" fontWeight="bold">
                {stats.monthlyRevenue}
              </Typography>
              <Typography variant="body2">
                Monthly Revenue
              </Typography>
            </Paper>
          </Grid>
        </Grid>

        {/* Main Dashboard Cards */}
        <Typography variant="h5" gutterBottom sx={{ mb: 3, fontWeight: 'bold', color: '#333' }}>
          Quick Access
        </Typography>
        
        <Grid container spacing={3}>
          {dashboardCards.map((card, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                elevation={3}
                sx={{
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 6,
                    backgroundColor: '#fafafa'
                  },
                  border: `1px solid #e0e0e0`,
                  borderRadius: 2
                }}
                onClick={() => card.path && navigate(card.path)}
              >
                <CardContent sx={{ p: 3, textAlign: 'center' }}>
                  <Box
                    sx={{
                      color: card.color,
                      mb: 2
                    }}
                  >
                    {card.icon}
                  </Box>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    {card.title}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary" 
                    sx={{ mb: 2, minHeight: 40 }}
                  >
                    {card.description}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Chip
                    label={card.stats}
                    size="small"
                    sx={{
                      backgroundColor: card.color,
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Recent Activity Section */}
        <Paper
          elevation={2}
          sx={{
            p: 3,
            mt: 4,
            borderRadius: 2
          }}
        >
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Recent Activity
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 2, borderLeft: '4px solid #1976d2', backgroundColor: '#f8f9fa' }}>
                <Typography variant="body2" fontWeight="bold">
                  New product added
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  iPhone 15 Pro Max was added to inventory
                </Typography>
                <Typography variant="caption" display="block" color="text.secondary">
                  2 hours ago
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ p: 2, borderLeft: '4px solid #2e7d32', backgroundColor: '#f8f9fa' }}>
                <Typography variant="body2" fontWeight="bold">
                  Order completed
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Order #ORD-001234 has been shipped
                </Typography>
                <Typography variant="caption" display="block" color="text.secondary">
                  5 hours ago
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}

export default Dashboard;