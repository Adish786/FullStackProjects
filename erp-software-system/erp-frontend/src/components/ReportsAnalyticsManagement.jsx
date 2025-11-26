import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Card,
  CardContent,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  useTheme,
  useMediaQuery,
  CircularProgress,
  LinearProgress
} from '@mui/material';
import { Assessment, ArrowBack, TrendingUp, ShoppingCart, People, Inventory, Close, Download, Email, BarChart } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Mock data and functions to replace missing dependencies
const useAuth = () => ({
  logout: () => console.log('Logout clicked')
});

function ReportsAnalyticsManagement() {
  const [timeRange, setTimeRange] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState(null);
  
  const { logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Mock data for reports
  const mockReportData = {
    monthly: {
      revenue: 45230,
      orders: 156,
      customers: 89,
      products: 234,
      growth: {
        revenue: 18.3,
        orders: 12.5,
        customers: 8.7,
        products: 15.2
      },
      topProducts: [
        { name: 'iPhone 15 Pro', sales: 45, revenue: 67500, growth: 25 },
        { name: 'MacBook Air', sales: 32, revenue: 51200, growth: 18 },
        { name: 'AirPods Pro', sales: 78, revenue: 23400, growth: 32 },
        { name: 'iPad Air', sales: 23, revenue: 18400, growth: 12 },
        { name: 'Apple Watch', sales: 56, revenue: 22400, growth: 21 }
      ],
      categories: [
        { name: 'Electronics', revenue: 125000, percentage: 65 },
        { name: 'Accessories', revenue: 35000, percentage: 18 },
        { name: 'Furniture', revenue: 20000, percentage: 10 },
        { name: 'Other', revenue: 12000, percentage: 7 }
      ]
    },
    quarterly: {
      revenue: 135690,
      orders: 468,
      customers: 267,
      products: 702,
      growth: {
        revenue: 22.1,
        orders: 18.6,
        customers: 14.3,
        products: 20.8
      },
      topProducts: [
        { name: 'iPhone 15 Pro', sales: 135, revenue: 202500, growth: 28 },
        { name: 'MacBook Air', sales: 96, revenue: 153600, growth: 22 },
        { name: 'AirPods Pro', sales: 234, revenue: 70200, growth: 35 },
        { name: 'iPad Air', sales: 69, revenue: 55200, growth: 15 },
        { name: 'Apple Watch', sales: 168, revenue: 67200, growth: 24 }
      ],
      categories: [
        { name: 'Electronics', revenue: 375000, percentage: 68 },
        { name: 'Accessories', revenue: 95000, percentage: 17 },
        { name: 'Furniture', revenue: 50000, percentage: 9 },
        { name: 'Other', revenue: 30000, percentage: 6 }
      ]
    },
    yearly: {
      revenue: 542760,
      orders: 1872,
      customers: 1068,
      products: 2808,
      growth: {
        revenue: 25.7,
        orders: 21.3,
        customers: 17.8,
        products: 23.5
      },
      topProducts: [
        { name: 'iPhone 15 Pro', sales: 540, revenue: 810000, growth: 31 },
        { name: 'MacBook Air', sales: 384, revenue: 614400, growth: 26 },
        { name: 'AirPods Pro', sales: 936, revenue: 280800, growth: 38 },
        { name: 'iPad Air', sales: 276, revenue: 220800, growth: 18 },
        { name: 'Apple Watch', sales: 672, revenue: 268800, growth: 27 }
      ],
      categories: [
        { name: 'Electronics', revenue: 1500000, percentage: 70 },
        { name: 'Accessories', revenue: 350000, percentage: 16 },
        { name: 'Furniture', revenue: 180000, percentage: 8 },
        { name: 'Other', revenue: 120000, percentage: 6 }
      ]
    }
  };

  useEffect(() => {
    fetchReportData();
  }, [timeRange]);

  const fetchReportData = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setReportData(mockReportData[timeRange]);
    } catch (error) {
      console.error('Error fetching report data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = (type) => {
    console.log(`Exporting ${type} report for ${timeRange}`);
    // Implement export functionality
  };

  const handleEmailReport = () => {
    console.log(`Emailing report for ${timeRange}`);
    // Implement email functionality
  };

  const StatCard = ({ title, value, icon, color, growth }) => (
    <Card sx={{ height: '100%', transition: 'all 0.3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 } }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
          <Box sx={{ flex: 1 }}>
            <Typography color="text.secondary" gutterBottom variant="body2" fontWeight="500">
              {title}
            </Typography>
            <Typography variant="h4" component="div" fontWeight="700" color={color} sx={{ mb: 1 }}>
              {typeof value === 'number' && title.includes('Revenue') ? `$${value.toLocaleString()}` : value.toLocaleString()}
            </Typography>
            {growth && (
              <Chip 
                label={`+${growth}%`} 
                size="small" 
                color="success" 
                variant="outlined"
                sx={{ fontWeight: 600 }}
              />
            )}
          </Box>
          <Box sx={{ color: color, opacity: 0.8, ml: 2 }}>
            {React.cloneElement(icon, { sx: { fontSize: 40 } })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );

  const CategoryProgress = ({ category }) => (
    <Box sx={{ mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
        <Typography variant="body2" fontWeight="500">
          {category.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {category.percentage}%
        </Typography>
      </Box>
      <LinearProgress 
        variant="determinate" 
        value={category.percentage} 
        sx={{ 
          height: 8,
          borderRadius: 4,
          backgroundColor: '#f0f0f0',
          '& .MuiLinearProgress-bar': {
            backgroundColor: getCategoryColor(category.name),
            borderRadius: 4
          }
        }}
      />
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        ${category.revenue.toLocaleString()}
      </Typography>
    </Box>
  );

  const getCategoryColor = (categoryName) => {
    const colors = {
      'Electronics': '#1976d2',
      'Accessories': '#2e7d32',
      'Furniture': '#ed6c02',
      'Other': '#9c27b0'
    };
    return colors[categoryName] || '#757575';
  };

  const getPerformanceColor = (growth) => {
    if (growth >= 25) return 'success';
    if (growth >= 15) return 'primary';
    if (growth >= 5) return 'warning';
    return 'default';
  };

  if (!reportData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

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
          <Assessment sx={{ mr: 2, color: 'primary.main' }} />
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Reports & Analytics
          </Typography>
          
          <FormControl variant="outlined" size="small" sx={{ minWidth: 140, mr: 2 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              label="Time Range"
            >
              <MenuItem value="monthly">Monthly</MenuItem>
              <MenuItem value="quarterly">Quarterly</MenuItem>
              <MenuItem value="yearly">Yearly</MenuItem>
            </Select>
          </FormControl>

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
            Analytics Dashboard
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Button
              variant="outlined"
              startIcon={<Download />}
              onClick={() => handleExportReport('pdf')}
              size="large"
            >
              Export PDF
            </Button>
            <Button
              variant="outlined"
              startIcon={<Email />}
              onClick={handleEmailReport}
              size="large"
            >
              Email Report
            </Button>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
            <CircularProgress size={60} />
          </Box>
        ) : (
          <>
            {/* Key Metrics */}
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Total Revenue"
                  value={reportData.revenue}
                  icon={<TrendingUp />}
                  color="#1976d2"
                  growth={reportData.growth.revenue}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Total Orders"
                  value={reportData.orders}
                  icon={<ShoppingCart />}
                  color="#2e7d32"
                  growth={reportData.growth.orders}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Total Customers"
                  value={reportData.customers}
                  icon={<People />}
                  color="#ed6c02"
                  growth={reportData.growth.customers}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <StatCard
                  title="Products Sold"
                  value={reportData.products}
                  icon={<Inventory />}
                  color="#9c27b0"
                  growth={reportData.growth.products}
                />
              </Grid>
            </Grid>

            <Grid container spacing={3} sx={{ flex: 1 }}>
              {/* Top Products */}
              <Grid item xs={12} md={8}>
                <Paper 
                  elevation={2} 
                  sx={{ 
                    height: '100%',
                    display: 'flex', 
                    flexDirection: 'column',
                    borderRadius: 2
                  }}
                >
                  <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <Typography variant="h5" gutterBottom fontWeight="700" sx={{ mb: 3 }}>
                      Top Selling Products ({timeRange.charAt(0).toUpperCase() + timeRange.slice(1)})
                    </Typography>
                    <TableContainer sx={{ flex: 1 }}>
                      <Table>
                        <TableHead>
                          <TableRow>
                            <TableCell><strong>Product Name</strong></TableCell>
                            <TableCell align="center"><strong>Units Sold</strong></TableCell>
                            <TableCell align="right"><strong>Revenue</strong></TableCell>
                            <TableCell align="center"><strong>Growth</strong></TableCell>
                            <TableCell align="center"><strong>Performance</strong></TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {reportData.topProducts.map((product, index) => (
                            <TableRow 
                              key={index}
                              sx={{ 
                                '&:hover': { backgroundColor: '#f8f9fa' },
                                transition: 'all 0.2s'
                              }}
                            >
                              <TableCell>
                                <Typography fontWeight="600">{product.name}</Typography>
                              </TableCell>
                              <TableCell align="center">
                                <Chip 
                                  label={product.sales} 
                                  color="primary" 
                                  variant="outlined"
                                  sx={{ fontWeight: 600 }}
                                />
                              </TableCell>
                              <TableCell align="right">
                                <Typography fontWeight="700" color="primary">
                                  ${product.revenue.toLocaleString()}
                                </Typography>
                              </TableCell>
                              <TableCell align="center">
                                <Chip 
                                  label={`+${product.growth}%`} 
                                  color="success"
                                  size="small"
                                  variant="outlined"
                                  sx={{ fontWeight: 600 }}
                                />
                              </TableCell>
                              <TableCell align="center">
                                <Chip 
                                  label={index === 0 ? "Best Seller" : `Rank #${index + 1}`} 
                                  color={getPerformanceColor(product.growth)}
                                  size="small"
                                  sx={{ fontWeight: 600, minWidth: 100 }}
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </CardContent>
                </Paper>
              </Grid>

              {/* Right Sidebar */}
              <Grid item xs={12} md={4}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {/* Sales Summary */}
                  <Paper elevation={2} sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom fontWeight="700" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BarChart />
                        Sales Summary
                      </Typography>
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                          Average Order Value
                        </Typography>
                        <Typography variant="h6" fontWeight="700" color="primary">
                          ${Math.round(reportData.revenue / reportData.orders).toLocaleString()}
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                          Conversion Rate
                        </Typography>
                        <Typography variant="h6" fontWeight="700">
                          {((reportData.orders / reportData.customers) * 100).toFixed(1)}%
                        </Typography>
                      </Box>
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="body2" color="text.secondary">
                          Customer Retention
                        </Typography>
                        <Typography variant="h6" fontWeight="700" color="#2e7d32">
                          {((reportData.customers / (reportData.customers * 1.2)) * 100).toFixed(1)}%
                        </Typography>
                      </Box>
                    </CardContent>
                  </Paper>

                  {/* Revenue by Category */}
                  <Paper elevation={2} sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom fontWeight="700">
                        Revenue by Category
                      </Typography>
                      {reportData.categories.map((category, index) => (
                        <CategoryProgress key={index} category={category} />
                      ))}
                    </CardContent>
                  </Paper>

                  {/* Quick Reports */}
                  <Paper elevation={2} sx={{ borderRadius: 2 }}>
                    <CardContent>
                      <Typography variant="h6" gutterBottom fontWeight="700">
                        Quick Reports
                      </Typography>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Button 
                          variant="outlined" 
                          fullWidth 
                          onClick={() => handleExportReport('sales')}
                          startIcon={<Assessment />}
                        >
                          Sales Report
                        </Button>
                        <Button 
                          variant="outlined" 
                          fullWidth 
                          onClick={() => handleExportReport('inventory')}
                          startIcon={<Inventory />}
                        >
                          Inventory Report
                        </Button>
                        <Button 
                          variant="outlined" 
                          fullWidth 
                          onClick={() => handleExportReport('customer')}
                          startIcon={<People />}
                        >
                          Customer Report
                        </Button>
                        <Button 
                          variant="outlined" 
                          fullWidth 
                          onClick={() => handleExportReport('financial')}
                          startIcon={<TrendingUp />}
                        >
                          Financial Summary
                        </Button>
                      </Box>
                    </CardContent>
                  </Paper>
                </Box>
              </Grid>
            </Grid>
          </>
        )}
      </Box>
    </Box>
  );
}

export default ReportsAnalyticsManagement;