import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { Add, Edit, Delete, Person } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [registerData, setRegisterData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'SALES_EXECUTIVE'
  });
  const [editData, setEditData] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const { userRole, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (userRole === 'ADMIN') {
      fetchUsers();
    }
  }, [userRole]);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/users');
      setUsers(response.data);
    } catch (error) {
      showSnackbar('Error fetching users', 'error');
      console.error('Error fetching users:', error);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    
    if (registerData.password !== registerData.confirmPassword) {
      showSnackbar('Passwords do not match', 'error');
      return;
    }

    try {
      await axios.post('http://localhost:8080/api/auth/register', registerData);
      showSnackbar('User created successfully');
      setOpen(false);
      setRegisterData({
        username: '', email: '', password: '', confirmPassword: '', role: 'SALES_EXECUTIVE'
      });
      fetchUsers();
    } catch (error) {
      showSnackbar(error.response?.data || 'Error creating user', 'error');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    
    if (editData.newPassword && editData.newPassword !== editData.confirmNewPassword) {
      showSnackbar('New passwords do not match', 'error');
      return;
    }

    try {
      const updateData = {
        username: editData.username,
        email: editData.email,
        currentPassword: editData.currentPassword || undefined,
        newPassword: editData.newPassword || undefined
      };

      await axios.put(`http://localhost:8080/api/users/${editingUser.id}`, updateData);
      showSnackbar('User updated successfully');
      setOpenEdit(false);
      setEditingUser(null);
      setEditData({
        username: '', email: '', currentPassword: '', newPassword: '', confirmNewPassword: ''
      });
      fetchUsers();
    } catch (error) {
      showSnackbar(error.response?.data || 'Error updating user', 'error');
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setEditData({
      username: user.username,
      email: user.email,
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    });
    setOpenEdit(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await axios.delete(`http://localhost:8080/api/users/${id}`);
        showSnackbar('User deleted successfully');
        fetchUsers();
      } catch (error) {
        showSnackbar(error.response?.data || 'Error deleting user', 'error');
      }
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.put(`http://localhost:8080/api/users/${userId}/role`, { role: newRole });
      showSnackbar('User role updated successfully');
      fetchUsers();
    } catch (error) {
      showSnackbar(error.response?.data || 'Error updating role', 'error');
    }
  };

  if (userRole !== 'ADMIN') {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Alert severity="error">
          You don't have permission to access this page. Admin access required.
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            User Management
          </Typography>
          <Button color="inherit" onClick={() => navigate('/dashboard')}>
            Dashboard
          </Button>
          <Button color="inherit" onClick={logout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                  <Typography variant="h4">
                    <Person sx={{ mr: 1, verticalAlign: 'bottom' }} />
                    Users
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setOpen(true)}
                  >
                    Add User
                  </Button>
                </Box>

                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Username</TableCell>
                        <TableCell>Email</TableCell>
                        <TableCell>Role</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.username}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                              <Select
                                value={user.role}
                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                              >
                                <MenuItem value="ADMIN">Admin</MenuItem>
                                <MenuItem value="SALES_EXECUTIVE">Sales Executive</MenuItem>
                                <MenuItem value="PURCHASE_MANAGER">Purchase Manager</MenuItem>
                                <MenuItem value="INVENTORY_MANAGER">Inventory Manager</MenuItem>
                                <MenuItem value="ACCOUNTANT">Accountant</MenuItem>
                              </Select>
                            </FormControl>
                          </TableCell>
                          <TableCell>
                            <IconButton onClick={() => handleEdit(user)} color="primary">
                              <Edit />
                            </IconButton>
                            <IconButton onClick={() => handleDelete(user.id)} color="error">
                              <Delete />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Add User Dialog */}
        <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Add New User</DialogTitle>
          <form onSubmit={handleRegisterSubmit}>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Username"
                fullWidth
                required
                value={registerData.username}
                onChange={(e) => setRegisterData({ ...registerData, username: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Email"
                type="email"
                fullWidth
                required
                value={registerData.email}
                onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Password"
                type="password"
                fullWidth
                required
                value={registerData.password}
                onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Confirm Password"
                type="password"
                fullWidth
                required
                value={registerData.confirmPassword}
                onChange={(e) => setRegisterData({ ...registerData, confirmPassword: e.target.value })}
              />
              <FormControl fullWidth margin="dense">
                <InputLabel>Role</InputLabel>
                <Select
                  value={registerData.role}
                  label="Role"
                  onChange={(e) => setRegisterData({ ...registerData, role: e.target.value })}
                >
                  <MenuItem value="SALES_EXECUTIVE">Sales Executive</MenuItem>
                  <MenuItem value="PURCHASE_MANAGER">Purchase Manager</MenuItem>
                  <MenuItem value="INVENTORY_MANAGER">Inventory Manager</MenuItem>
                  <MenuItem value="ACCOUNTANT">Accountant</MenuItem>
                </Select>
              </FormControl>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" variant="contained">Create User</Button>
            </DialogActions>
          </form>
        </Dialog>

        {/* Edit User Dialog */}
        <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Edit User</DialogTitle>
          <form onSubmit={handleEditSubmit}>
            <DialogContent>
              <TextField
                autoFocus
                margin="dense"
                label="Username"
                fullWidth
                required
                value={editData.username}
                onChange={(e) => setEditData({ ...editData, username: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Email"
                type="email"
                fullWidth
                required
                value={editData.email}
                onChange={(e) => setEditData({ ...editData, email: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Current Password (for verification)"
                type="password"
                fullWidth
                value={editData.currentPassword}
                onChange={(e) => setEditData({ ...editData, currentPassword: e.target.value })}
                helperText="Required only if changing password"
              />
              <TextField
                margin="dense"
                label="New Password"
                type="password"
                fullWidth
                value={editData.newPassword}
                onChange={(e) => setEditData({ ...editData, newPassword: e.target.value })}
              />
              <TextField
                margin="dense"
                label="Confirm New Password"
                type="password"
                fullWidth
                value={editData.confirmNewPassword}
                onChange={(e) => setEditData({ ...editData, confirmNewPassword: e.target.value })}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
              <Button type="submit" variant="contained">Update User</Button>
            </DialogActions>
          </form>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert 
            onClose={() => setSnackbar({ ...snackbar, open: false })} 
            severity={snackbar.severity}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </Box>
  );
}

export default UserManagement;