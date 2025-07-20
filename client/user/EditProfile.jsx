import React, { useState, useEffect } from "react";
import {
  Card,
  CardActions,
  CardContent,
  Button,
  TextField,
  Typography,
  Icon,
} from "@mui/material";
import auth from "../lib/auth-helper.js";
import { read, update } from "./api-user.js";
import { Navigate, useParams } from "react-router-dom";

export default function EditProfile() {
  const { userId } = useParams();
  const [values, setValues] = useState({
    name: "",
    password: "",
    email: "",
    open: false,
    error: "",
    NavigateToProfile: false,
  });

  const jwt = auth.isAuthenticated();

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    read({ userId }, { t: jwt.token }, signal)
      .then((data) => {
        if (signal.aborted) return; // Don't update state if aborted
        
        if (data?.error) {
          setValues((prev) => ({ ...prev, error: data.error }));
        } else {
          setValues((prev) => ({ ...prev, name: data.name, email: data.email }));
        }
      })
      .catch((error) => {
        if (error.name === 'AbortError') {
          // Ignore abort errors - this is expected when component unmounts
          return;
        }
        console.error('Error reading user:', error);
        if (!signal.aborted) {
          setValues((prev) => ({ ...prev, error: 'Failed to load user data' }));
        }
      });

    return () => abortController.abort();
  }, [userId]);

  const clickSubmit = () => {
    const user = {
      name: values.name || undefined,
      email: values.email || undefined,
      password: values.password || undefined,
    };

    update({ userId }, { t: jwt.token }, user).then((data) => {
      if (data?.error) {
        setValues((prev) => ({ ...prev, error: data.error }));
      } else {
        setValues((prev) => ({
          ...prev,
          userId: data._id,
          NavigateToProfile: true,
        }));
      }
    });
  };

  const handleChange = (name) => (event) => {
    setValues({ ...values, [name]: event.target.value });
  };

  if (values.NavigateToProfile) {
    return <Navigate to={`/profile/${values.userId}`} />;
  }

  return (
    <Card
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: 5,
        textAlign: "center",
        pb: 2,
      }}
    >
      <CardContent>
        <Typography variant="h6" sx={{ mt: 2, mb: 2, color: "text.primary" }}>
          Edit Profile
        </Typography>

        <TextField
          id="name"
          label="Name"
          value={values.name}
          onChange={handleChange("name")}
          margin="normal"
          sx={{ mx: 1, width: 300 }}
        />
        <br />

        <TextField
          id="email"
          type="email"
          label="Email"
          value={values.email}
          onChange={handleChange("email")}
          margin="normal"
          sx={{ mx: 1, width: 300 }}
        />
        <br />

        <TextField
          id="password"
          type="password"
          label="Password"
          value={values.password}
          onChange={handleChange("password")}
          margin="normal"
          sx={{ mx: 1, width: 300 }}
        />
        <br />

        {values.error && (
          <Typography component="p" color="error" sx={{ mt: 1 }}>
            <Icon color="error" sx={{ verticalAlign: "middle", mr: 1 }}>
              error
            </Icon>
            {values.error}
          </Typography>
        )}
      </CardContent>

      <CardActions sx={{ justifyContent: "center" }}>
        <Button
          color="primary"
          variant="contained"
          onClick={clickSubmit}
          sx={{ mb: 2 }}
        >
          Submit
        </Button>
      </CardActions>
    </Card>
  );
}
