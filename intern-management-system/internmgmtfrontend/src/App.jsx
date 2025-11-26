import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  useMediaQuery,
  useTheme,
  Fab,
  Dialog,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
  Menu,
  MenuItem,
  Avatar
} from '@mui/material';
import {
  Menu as MenuIcon,
  Group,
  PersonAdd,
  Add,
  BatchPrediction,
  ViewList,
  Dashboard,
  Assignment,
  Logout,
  AccountCircle
} from '@mui/icons-material';
import BatchForm from './components/BatchForm';
import InternForm from './components/InternForm';
import InternList from './components/InternList';
import BatchList from './components/BatchList';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import PrivateRoute from './components/Auth/PrivateRoute';
import AuthService from './services/auth';
import './App.css';


const App = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [showInternForm, setShowInternForm] = useState(false);
  const [showBatchForm, setShowBatchForm] = useState(false);
  const [editIntern, setEditIntern] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isSmallMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = () => {
    const authenticated = AuthService.isAuthenticated();
    setIsAuthenticated(authenticated);
    if (authenticated) {
      setUser(AuthService.getUser());
    }
  };

  const handleLogin = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
  };

  const handleLogout = () => {
    AuthService.removeToken();
    setIsAuthenticated(false);
    setUser(null);
    setUserMenuAnchor(null);
  };

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
    setEditIntern(null);
    if (isMobile) {
      setMobileDrawerOpen(false);
    }
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  const handleEditIntern = (intern) => {
    setEditIntern(intern);
    setCurrentTab(1);
    if (isMobile) {
      setShowInternForm(true);
    }
  };

  const handleInternCreated = (internData) => {
    handleRefresh();
    setEditIntern(null);
    if (isMobile && showInternForm) {
      setShowInternForm(false);
    }
  };

  const handleBatchCreated = (batchData) => {
    handleRefresh();
    if (isMobile && showBatchForm) {
      setShowBatchForm(false);
    }
  };

  const handleCloseForms = () => {
    setShowInternForm(false);
    setShowBatchForm(false);
    setEditIntern(null);
  };

  const handleUserMenuOpen = (event) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const menuItems = [
    { label: 'Dashboard', icon: <Dashboard />, value: 0 },
    { label: 'Add Intern', icon: <PersonAdd />, value: 1 },
    { label: 'Intern List', icon: <ViewList />, value: 2 },
    { label: 'Batch List', icon: <BatchPrediction />, value: 3 },
  ];

  const renderDesktopTabs = () => (
    <Tabs 
      value={currentTab} 
      onChange={handleTabChange}
      className="desktop-tabs"
      indicatorColor="primary"
      textColor="primary"
    >
      <Tab 
        icon={<Dashboard />} 
        label="Dashboard" 
        className="tab-item"
      />
      <Tab 
        icon={<PersonAdd />} 
        label="Add Intern" 
        className="tab-item"
      />
      <Tab 
        icon={<ViewList />} 
        label="Intern List" 
        className="tab-item"
      />
      <Tab 
        icon={<BatchPrediction />} 
        label="Batch List" 
        className="tab-item"
      />
    </Tabs>
  );

  const renderMobileDrawer = () => (
    <Drawer
      anchor="left"
      open={mobileDrawerOpen}
      onClose={() => setMobileDrawerOpen(false)}
      className="mobile-drawer"
    >
      <div className="drawer-header">
        <Typography variant="h6" className="drawer-title">
          Intern Management
        </Typography>
      </div>
      <List className="drawer-list">
        {menuItems.map((item) => (
          <ListItem
            key={item.value}
            button
            onClick={() => handleTabChange(null, item.value)}
            className={`drawer-item ${currentTab === item.value ? 'active' : ''}`}
          >
            <ListItemIcon className="drawer-icon">
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );

  const renderMobileBottomNav = () => (
    <Paper elevation={3} className="mobile-bottom-nav">
      <BottomNavigation
        value={currentTab}
        onChange={handleTabChange}
        showLabels
        className="bottom-navigation"
      >
        <BottomNavigationAction 
          label="Dashboard" 
          icon={<Dashboard />} 
          className="bottom-nav-item"
        />
        <BottomNavigationAction 
          label="Interns" 
          icon={<Group />} 
          className="bottom-nav-item"
        />
        <BottomNavigationAction 
          label="Batches" 
          icon={<BatchPrediction />} 
          className="bottom-nav-item"
        />
      </BottomNavigation>
    </Paper>
  );

  const renderMobileFAB = () => {
    if (currentTab === 1 || currentTab === 2) {
      return (
        <Fab
          color="primary"
          className="mobile-fab"
          onClick={() => setShowInternForm(true)}
        >
          <PersonAdd />
        </Fab>
      );
    }
    if (currentTab === 3) {
      return (
        <Fab
          color="primary"
          className="mobile-fab"
          onClick={() => setShowBatchForm(true)}
        >
          <Add />
        </Fab>
      );
    }
    return null;
  };

  const renderContent = () => {
    switch (currentTab) {
      case 0: // Dashboard
        return (
          <div className="dashboard-container">
            <div className="dashboard-header">
              <Typography variant="h3" className="dashboard-title">
                Welcome, {user?.firstName}!
              </Typography>
              <Typography variant="h6" className="dashboard-subtitle">
                Manage your interns and batches efficiently
              </Typography>
            </div>
            
            <div className="dashboard-grid">
              <div className="dashboard-card primary" onClick={() => setCurrentTab(1)}>
                <PersonAdd className="dashboard-icon" />
                <Typography variant="h5" className="dashboard-card-title">
                  Add Intern
                </Typography>
                <Typography variant="body2" className="dashboard-card-description">
                  Register new interns and assign them to batches
                </Typography>
              </div>
              
              <div className="dashboard-card secondary" onClick={() => setCurrentTab(2)}>
                <ViewList className="dashboard-icon" />
                <Typography variant="h5" className="dashboard-card-title">
                  View Interns
                </Typography>
                <Typography variant="body2" className="dashboard-card-description">
                  Browse and manage all registered interns
                </Typography>
              </div>
              
              <div className="dashboard-card tertiary" onClick={() => setCurrentTab(3)}>
                <BatchPrediction className="dashboard-icon" />
                <Typography variant="h5" className="dashboard-card-title">
                  Manage Batches
                </Typography>
                <Typography variant="body2" className="dashboard-card-description">
                  Create and view batches with intern assignments
                </Typography>
              </div>
              
              <div className="dashboard-card accent" onClick={() => { setCurrentTab(1); setShowBatchForm(true); }}>
                <Add className="dashboard-icon" />
                <Typography variant="h5" className="dashboard-card-title">
                  Quick Actions
                </Typography>
                <Typography variant="body2" className="dashboard-card-description">
                  Create new batches and manage assignments
                </Typography>
              </div>
            </div>
          </div>
        );

      case 1: // Add Intern
        return isMobile ? (
          <div className="mobile-placeholder">
            <PersonAdd className="placeholder-icon" />
            <Typography variant="h6" className="placeholder-title">
              Add Intern
            </Typography>
            <Typography variant="body2" className="placeholder-description">
              Tap the + button below to add a new intern
            </Typography>
          </div>
        ) : (
          <InternForm 
            onInternCreated={handleInternCreated}
            editIntern={editIntern}
            onClose={() => setEditIntern(null)}
          />
        );

      case 2: // Intern List
        return (
          <InternList 
            onEditIntern={handleEditIntern}
            refresh={refreshKey}
          />
        );

      case 3: // Batch List
        return isMobile ? (
          <BatchList />
        ) : (
          <div className="batch-management-container">
            <div className="batch-management-header">
              <Typography variant="h4" className="batch-management-title">
                Batch Management
              </Typography>
              <BatchForm onBatchCreated={handleBatchCreated} />
            </div>
            <BatchList />
          </div>
        );

      default:
        return null;
    }
  };

  const renderAuthApp = () => (
    <div className="app-container">
      {/* Header */}
      <AppBar position="sticky" className="app-bar">
        <Toolbar className="toolbar">
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setMobileDrawerOpen(true)}
              className="menu-button"
            >
              <MenuIcon />
            </IconButton>
          )}
          
          <Assignment className="app-logo" />
          <Typography variant="h5" component="div" className="app-title">
            InternMgmt
          </Typography>
          
          {!isMobile && (
            <div className="desktop-nav">
              {renderDesktopTabs()}
            </div>
          )}

          <div className="spacer" />
          
          {/* User Menu */}
          <div className="user-section">
            <IconButton onClick={handleUserMenuOpen} className="user-button">
              <Avatar className="user-avatar">
                {user?.firstName?.charAt(0)}
              </Avatar>
            </IconButton>
            <Menu
              anchorEl={userMenuAnchor}
              open={Boolean(userMenuAnchor)}
              onClose={handleUserMenuClose}
              className="user-menu"
            >
              <MenuItem onClick={handleUserMenuClose}>
                <AccountCircle className="menu-icon" />
                Profile
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Logout className="menu-icon" />
                Logout
              </MenuItem>
            </Menu>
          </div>
        </Toolbar>
      </AppBar>

      {/* Mobile Navigation */}
      {isMobile && renderMobileDrawer()}

      {/* Main Content */}
      <main className="main-content">
        <Container 
          maxWidth={isMobile ? false : "xl"} 
          className={`content-container ${isMobile ? 'mobile' : ''}`}
          disableGutters={isMobile}
        >
          {renderContent()}
        </Container>
      </main>

      {/* Mobile Bottom Navigation */}
      {isMobile && renderMobileBottomNav()}

      {/* Mobile FAB */}
      {isMobile && renderMobileFAB()}

      {/* Mobile Dialogs */}
      <Dialog
        open={showInternForm}
        onClose={handleCloseForms}
        maxWidth="md"
        fullWidth
        fullScreen={isSmallMobile}
        className="mobile-dialog"
      >
        <InternForm 
          onInternCreated={handleInternCreated}
          editIntern={editIntern}
          onClose={handleCloseForms}
        />
      </Dialog>

      <Dialog
        open={showBatchForm}
        onClose={handleCloseForms}
        maxWidth="sm"
        fullWidth
        fullScreen={isSmallMobile}
        className="mobile-dialog"
      >
        <BatchForm 
          onBatchCreated={handleBatchCreated}
          onClose={handleCloseForms}
        />
      </Dialog>
    </div>
  );

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
            <Navigate to="/dashboard" replace /> : 
            <Login onLogin={handleLogin} />
          } 
        />
        <Route 
          path="/register" 
          element={
            isAuthenticated ? 
            <Navigate to="/dashboard" replace /> : 
            <Register onRegister={handleLogin} />
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            <PrivateRoute>
              {renderAuthApp()}
            </PrivateRoute>
          } 
        />
        <Route 
          path="/" 
          element={
            <Navigate to={isAuthenticated ? "/dashboard" : "/login"} replace />
          } 
        />
      </Routes>
    </Router>
  );
};

export default App;