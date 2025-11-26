import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Badge,
  Avatar,
  Fade,
  useTheme,
  useMediaQuery,
  Container,
  Tooltip,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ShoppingCart,
  LocalLibrary,
  AdminPanelSettings,
  Receipt,
  ExitToApp,
  Login,
  PersonAdd,
  Dashboard,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/');
    setProfileMenuAnchor(null);
    setMobileMenuOpen(false);
  };

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    handleProfileMenuClose();
  };

  const isActivePath = (path) => {
    return location.pathname === path;
  };

  // Navigation items for different user roles
  const getNavigationItems = () => {
    const commonItems = [
      { label: 'Books', path: '/', icon: <LocalLibrary /> },
    ];

    if (!isAuthenticated) {
      return [
        ...commonItems,
        { label: 'Login', path: '/login', icon: <Login /> },
        { label: 'Register', path: '/register', icon: <PersonAdd /> },
      ];
    }

    const authenticatedItems = [
      ...commonItems,
      { label: 'My Orders', path: '/orders', icon: <Receipt /> },
    ];

    if (user?.role === 'ADMIN') {
      authenticatedItems.push({
        label: 'Admin Panel',
        path: '/admin',
        icon: <AdminPanelSettings />,
      });
    }

    return authenticatedItems;
  };

  const navigationItems = getNavigationItems();

  // Desktop Navigation
  const renderDesktopNav = () => (
    <Box className="navbar-desktop-nav">
      {navigationItems.map((item) => (
        <Button
          key={item.path}
          color="inherit"
          onClick={() => handleNavigation(item.path)}
          startIcon={item.icon}
          className={`navbar-desktop-button ${isActivePath(item.path) ? 'active' : ''}`}
          variant={isActivePath(item.path) ? 'contained' : 'text'}
        >
          {item.label}
        </Button>
      ))}
    </Box>
  );

  // Mobile Navigation Menu
  const renderMobileMenu = () => (
    <Drawer
      anchor="right"
      open={mobileMenuOpen}
      onClose={handleMobileMenuToggle}
      className="navbar-mobile-drawer"
    >
      <Box sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* User Info Section */}
        {isAuthenticated && user && (
          <Fade in={true} timeout={800}>
            <Box className="navbar-user-info">
              <Avatar className="navbar-mobile-avatar">
                {user.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Typography variant="h6" fontWeight="bold" noWrap>
                {user.name}
              </Typography>
              <Chip
                label={user.role}
                color="secondary"
                size="small"
                sx={{ mt: 1, fontWeight: 'bold' }}
              />
            </Box>
          </Fade>
        )}

        <Divider sx={{ bgcolor: 'rgba(255,255,255,0.3)', mb: 2 }} />

        {/* Navigation Items */}
        <List sx={{ flexGrow: 1 }}>
          {navigationItems.map((item) => (
            <ListItem
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`navbar-mobile-list-item ${isActivePath(item.path) ? 'active' : ''}`}
            >
              <ListItemIcon className="navbar-mobile-list-icon">
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.label}
                primaryTypographyProps={{
                  fontWeight: isActivePath(item.path) ? 'bold' : 'normal',
                  fontSize: '0.95rem',
                }}
              />
            </ListItem>
          ))}
        </List>

        {/* Logout Button for Authenticated Users */}
        {isAuthenticated && (
          <>
            <Divider sx={{ bgcolor: 'rgba(255,255,255,0.3)', my: 2 }} />
            <Button
              fullWidth
              onClick={handleLogout}
              startIcon={<ExitToApp />}
              variant="outlined"
              className="navbar-mobile-logout"
            >
              Logout
            </Button>
          </>
        )}
      </Box>
    </Drawer>
  );

  // Profile Menu for Desktop
  const renderProfileMenu = () => (
    <Menu
      anchorEl={profileMenuAnchor}
      open={Boolean(profileMenuAnchor)}
      onClose={handleProfileMenuClose}
      PaperProps={{
        className: 'navbar-profile-menu'
      }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }}
      anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
    >
      {isAuthenticated && user && (
        <Box className="navbar-profile-header">
          <Typography variant="subtitle1" fontWeight="bold" noWrap>
            {user.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" noWrap sx={{ mt: 0.5 }}>
            {user.email}
          </Typography>
          <Chip
            label={user.role}
            color="primary"
            size="small"
            sx={{ mt: 1, fontWeight: 'bold', fontSize: '0.7rem' }}
          />
        </Box>
      )}
      <MenuItem 
        onClick={() => handleNavigation('/orders')}
        className="navbar-profile-menu-item"
      >
        <ListItemIcon className="navbar-profile-menu-icon">
          <Receipt fontSize="small" />
        </ListItemIcon>
        My Orders
      </MenuItem>
      {user?.role === 'ADMIN' && (
        <MenuItem 
          onClick={() => handleNavigation('/admin')}
          className="navbar-profile-menu-item"
        >
          <ListItemIcon className="navbar-profile-menu-icon">
            <Dashboard fontSize="small" />
          </ListItemIcon>
          Admin Panel
        </MenuItem>
      )}
      <Divider />
      <MenuItem 
        onClick={handleLogout} 
        className="navbar-logout-menu-item"
      >
        <ListItemIcon className="navbar-profile-menu-icon">
          <ExitToApp fontSize="small" />
        </ListItemIcon>
        Logout
      </MenuItem>
    </Menu>
  );

  return (
    <div className="navbar-container">
      <AppBar position="sticky" className="navbar-appbar">
        <Toolbar className="navbar-toolbar">
          {/* Logo/Brand */}
          <Box 
            onClick={() => navigate('/')}
            className="navbar-brand"
          >
            <Box className="navbar-logo-icon">
              <LocalLibrary sx={{ fontSize: 22, color: 'primary.main' }} />
            </Box>
            <Typography 
              variant="h6" 
              component="div"
              className="navbar-logo-text"
            >
              Bookstore Pro
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          {renderDesktopNav()}

          {/* User Actions - Desktop */}
          <Box className="navbar-user-actions">
            {isAuthenticated ? (
              <>
                {/* Cart Icon with Badge */}
                <Tooltip title="Shopping Cart">
                  <IconButton 
                    color="inherit" 
                    className="navbar-icon-button"
                  >
                    <Badge badgeContent={3} color="secondary">
                      <ShoppingCart />
                    </Badge>
                  </IconButton>
                </Tooltip>

                {/* User Profile */}
                <Tooltip title="Account Menu">
                  <IconButton
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                    className="navbar-icon-button"
                  >
                    <Avatar className="navbar-avatar">
                      {user?.name?.charAt(0).toUpperCase()}
                    </Avatar>
                  </IconButton>
                </Tooltip>
              </>
            ) : (
              <Box className="navbar-auth-buttons">
                <Button
                  color="inherit"
                  onClick={() => navigate('/login')}
                  startIcon={<Login />}
                  variant={isActivePath('/login') ? 'contained' : 'outlined'}
                  className="navbar-login-button"
                >
                  Login
                </Button>
                <Button
                  color="secondary"
                  onClick={() => navigate('/register')}
                  startIcon={<PersonAdd />}
                  variant="contained"
                  className="navbar-register-button"
                >
                  Register
                </Button>
              </Box>
            )}
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            color="inherit"
            onClick={handleMobileMenuToggle}
            className="navbar-mobile-menu-button"
          >
            <Badge badgeContent={isAuthenticated ? 3 : 0} color="secondary">
              <MenuIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Menu */}
      {renderMobileMenu()}

      {/* Profile Menu */}
      {renderProfileMenu()}
    </div>
  );
};

export default Navbar;