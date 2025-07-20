import React, { useState, useEffect } from "react";
import {
  Paper,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Avatar,
  IconButton,
  Typography,
  Divider,
  Switch,
  FormControlLabel,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import PersonIcon from "@mui/icons-material/Person";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import DeleteUser from "./DeleteUser";
import auth from "../lib/auth-helper.js";
import { read, toggleRole } from "./api-user.js";
import { useLocation, Navigate, Link, useParams } from "react-router-dom";

export default function Profile() {
  const location = useLocation();
  const [user, setUser] = useState({});
  const [redirectToSignin, setRedirectToSignin] = useState(false);
  const [roleToggling, setRoleToggling] = useState(false);
  const jwt = auth.isAuthenticated();
  const { userId } = useParams();

  const handleRoleToggle = async () => {
    setRoleToggling(true);
    try {
      const updatedUser = await toggleRole({ userId }, { t: jwt.token });
      if (updatedUser && !updatedUser.error) {
        setUser(updatedUser);
      }
    } catch (err) {
      console.error('Error toggling role:', err);
    } finally {
      setRoleToggling(false);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    read({ userId }, { t: jwt.token }, signal)
      .then((data) => {
        if (data && data.error) {
          setRedirectToSignin(true);
        } else {
          setUser(data);
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          console.error('Error loading profile:', err);
          setRedirectToSignin(true);
        }
      });

    return () => abortController.abort();
  }, [userId]);

  if (redirectToSignin) {
    return (
      <Navigate to="/signin" state={{ from: location.pathname }} replace />
    );
  }

  return (
    <Paper
      elevation={4}
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: 5,
        p: 3,
      }}
    >
      <Typography variant="h6" sx={{ mt: 3, mb: 2, color: "text.primary" }}>
        Profile
      </Typography>
      <List dense>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <PersonIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={user.name} secondary={user.email} />
          {auth.isAuthenticated().user &&
            auth.isAuthenticated().user._id === user._id && (
              <ListItemSecondaryAction>
                <Link to={`/user/edit/${user._id}`}>
                  <IconButton aria-label="Edit" color="primary">
                    <EditIcon />
                  </IconButton>
                </Link>
                <DeleteUser userId={user._id} />
              </ListItemSecondaryAction>
            )}
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary={
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span>Role:</span>
                <Chip 
                  icon={user.role === 'admin' ? <AdminPanelSettingsIcon /> : <PersonIcon />}
                  label={user.role === 'admin' ? 'Administrator' : 'User'}
                  color={user.role === 'admin' ? 'secondary' : 'default'}
                  size="small"
                />
              </div>
            }
          />
          {auth.isAuthenticated().user &&
            auth.isAuthenticated().user._id === user._id && (
              <ListItemSecondaryAction>
                <FormControlLabel
                  control={
                    <Switch
                      checked={user.role === 'admin'}
                      onChange={handleRoleToggle}
                      disabled={roleToggling}
                      color="secondary"
                    />
                  }
                  label={roleToggling ? "Switching..." : "Admin Status"}
                  labelPlacement="start"
                />
              </ListItemSecondaryAction>
            )}
        </ListItem>
        <Divider />
        <ListItem>
          <ListItemText
            primary={
              user.created
                ? `Joined: ${new Date(user.created).toDateString()}`
                : "Loading..."
            }
          />
        </ListItem>
      </List>
    </Paper>
  );
}
