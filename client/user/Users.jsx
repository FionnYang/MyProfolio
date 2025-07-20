import React, { useState, useEffect } from "react";
import {
  Paper,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Avatar,
  Typography,
  Link,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Box,
  Fab
} from "@mui/material";
import { 
  ArrowForward, 
  Edit as EditIcon, 
  Delete as DeleteIcon, 
  Add as AddIcon,
  AdminPanelSettings as AdminIcon,
  Person as UserIcon,
  Refresh as RefreshIcon
} from "@mui/icons-material";
import { list, create, update, remove, toggleRole } from "./api-user.js";
import { Link as RouterLink } from "react-router-dom";
import auth from '../lib/auth-helper.js';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(auth.isAuthenticated());
  const [isAdmin, setIsAdmin] = useState(false);

  // Check and refresh user authentication
  useEffect(() => {
    const checkAuth = async () => {
      let authData = auth.isAuthenticated();
      
      // If user is logged in but doesn't have role info, refresh it
      if (authData && !authData.user.role) {
        console.log('User missing role info, refreshing...');
        const refreshedAuth = await auth.refreshUserInfo();
        if (refreshedAuth) {
          authData = refreshedAuth;
        }
      }
      
      setIsAuthenticated(authData);
      setIsAdmin(authData && authData.user.role === 'admin');
      setAuthChecked(true);
      
      // Debug logging
      console.log('Authentication status:', authData);
      console.log('User role:', authData?.user?.role);
      console.log('Is Admin:', authData && authData.user.role === 'admin');
    };
    
    checkAuth();

    // Add focus listener to refresh auth when returning to page
    const handleFocus = async () => {
      console.log('Page focused, refreshing auth...');
      await checkAuth();
    };

    // Add visibility change listener
    const handleVisibilityChange = async () => {
      if (!document.hidden) {
        console.log('Page became visible, refreshing auth...');
        await checkAuth();
      }
    };

    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const refreshAuth = async () => {
    console.log('Manually refreshing auth...');
    let authData = auth.isAuthenticated();
    
    // Always try to refresh user info to get latest role
    if (authData) {
      const refreshedAuth = await auth.refreshUserInfo();
      if (refreshedAuth) {
        authData = refreshedAuth;
      }
    }
    
    setIsAuthenticated(authData);
    setIsAdmin(authData && authData.user.role === 'admin');
    
    // Debug logging
    console.log('Refreshed authentication status:', authData);
    console.log('Refreshed user role:', authData?.user?.role);
    console.log('Refreshed is Admin:', authData && authData.user.role === 'admin');
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const abortController = new AbortController();
      const signal = abortController.signal;

      const data = await list(signal);
      if (data?.error) {
        setError(data.error);
      } else {
        setUsers(data);
        setError('');
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error loading users:', err);
        setError('Failed to load users');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (authChecked) {
      loadUsers();
    }
  }, [authChecked]);

  const handleOpen = (user = null) => {
    if (user) {
      setEditMode(true);
      setSelectedUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        password: ''
      });
    } else {
      setEditMode(false);
      setSelectedUser(null);
      setFormData({
        name: '',
        email: '',
        password: ''
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditMode(false);
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      password: ''
    });
    setError('');
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      const jwt = auth.isAuthenticated();
      let result;
      
      if (editMode) {
        // For update, only send password if it's provided
        const updateData = { name: formData.name, email: formData.email };
        if (formData.password) {
          updateData.password = formData.password;
        }
        result = await update({ userId: selectedUser._id }, { t: jwt.token }, updateData);
      } else {
        // For create, password is required
        if (!formData.password) {
          setError('Password is required for new users');
          return;
        }
        result = await create(formData);
      }

      if (result.error) {
        setError(result.error);
      } else {
        handleClose();
        loadUsers();
      }
    } catch (err) {
      setError('Failed to save user');
    }
  };

  const handleDelete = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      try {
        const jwt = auth.isAuthenticated();
        const result = await remove({ userId }, { t: jwt.token });
        if (result.error) {
          setError(result.error);
        } else {
          loadUsers();
        }
      } catch (err) {
        setError('Failed to delete user');
      }
    }
  };

  const handleToggleRole = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to toggle the role for user "${userName}"?`)) {
      try {
        const jwt = auth.isAuthenticated();
        const result = await toggleRole({ userId }, { t: jwt.token });
        if (result.error) {
          setError(result.error);
        } else {
          loadUsers();
        }
      } catch (err) {
        setError('Failed to toggle user role');
      }
    }
  };

  return (
    <Paper
      elevation={4}
      sx={{
        maxWidth: 800,
        mx: "auto",
        mt: 5,
        p: 3,
      }}
    >
      {!authChecked ? (
        <Typography sx={{ mb: 2 }}>
          Checking authentication...
        </Typography>
      ) : (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" sx={{ color: "text.primary" }}>
              All Users
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <IconButton 
                onClick={refreshAuth}
                size="small"
                title="Refresh user permissions"
                color="primary"
              >
                <RefreshIcon />
              </IconButton>
              {isAdmin && (
                <Fab 
                  color="primary" 
                  aria-label="add" 
                  onClick={() => handleOpen()}
                  size="small"
                >
                  <AddIcon />
                </Fab>
              )}
            </Box>
          </Box>

          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}

          {loading && (
            <Typography sx={{ mb: 2 }}>
              Loading users...
            </Typography>
          )}

          <List dense>
            {users.map((item, i) => (
              <ListItem key={item._id} disablePadding>
                <ListItemButton 
                  component={RouterLink} 
                  to={`/profile/${item._id}`}
                  sx={{ color: "inherit", flex: 1 }}
                >
                  <ListItemAvatar>
                    <Avatar>
                      {item.role === 'admin' ? <AdminIcon /> : <UserIcon />}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText 
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {item.name}
                        <Chip 
                          label={item.role || 'user'} 
                          size="small" 
                          color={item.role === 'admin' ? 'secondary' : 'default'}
                        />
                      </Box>
                    }
                    secondary={item.email}
                  />
                </ListItemButton>
                
                <ListItemSecondaryAction>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {isAdmin && (
                      <>
                        <IconButton 
                          edge="end" 
                          onClick={() => handleOpen(item)}
                          size="small"
                          title="Edit user"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          edge="end" 
                          onClick={() => handleToggleRole(item._id, item.name)}
                          size="small"
                          title="Toggle role"
                          color={item.role === 'admin' ? 'secondary' : 'primary'}
                        >
                          {item.role === 'admin' ? <UserIcon /> : <AdminIcon />}
                        </IconButton>
                        <IconButton 
                          edge="end" 
                          onClick={() => handleDelete(item._id, item.name)}
                          size="small"
                          color="error"
                          title="Delete user"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )}
                    <IconButton edge="end" component={RouterLink} to={`/profile/${item._id}`}>
                      <ArrowForward />
                    </IconButton>
                  </Box>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>

          {/* Add/Edit User Dialog */}
          <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>
              {editMode ? 'Edit User' : 'Add New User'}
            </DialogTitle>
            <DialogContent>
              {error && (
                <Typography color="error" sx={{ mb: 2 }}>
                  {error}
                </Typography>
              )}
              <TextField
                autoFocus
                margin="dense"
                name="name"
                label="Name"
                type="text"
                fullWidth
                variant="outlined"
                value={formData.name}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                name="email"
                label="Email"
                type="email"
                fullWidth
                variant="outlined"
                value={formData.email}
                onChange={handleChange}
                sx={{ mb: 2 }}
              />
              <TextField
                margin="dense"
                name="password"
                label={editMode ? "New Password (leave blank to keep current)" : "Password"}
                type="password"
                fullWidth
                variant="outlined"
                value={formData.password}
                onChange={handleChange}
                required={!editMode}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={handleSubmit} variant="contained">
                {editMode ? 'Update' : 'Create'}
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Paper>
  );
}
