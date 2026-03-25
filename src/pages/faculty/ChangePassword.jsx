import React, { useState } from "react";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  IconButton,
  InputAdornment
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

function ChangePassword() {

  const token = localStorage.getItem("token");
  const faculty_id = localStorage.getItem("faculty_id");

  const navigate = useNavigate();

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleVisibility = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleSubmit = () => {

    if (!form.currentPassword || !form.newPassword || !form.confirmPassword) {
      alert("Please fill all fields");
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      alert("New passwords do not match");
      return;
    }

    if (form.newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    axios.post("https://rukap.edu.in/attendance-api/change-password",
      {
        faculty_id,
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
      .then(res => {
        alert(res.data.message);
        navigate(-1); // 🔙 go back after success
      })
      .catch(err => {
        alert(err.response?.data?.message || "Error updating password");
      });

  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>

      {/* HEADER WITH BACK BUTTON */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>

        <Button
          variant="outlined"
          onClick={() => navigate(-1)}
          sx={{ mr: 2 }}
        >
          ⬅ Back
        </Button>

        <Typography variant="h5">
          Change Password
        </Typography>

      </Box>

      {/* FORM */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

        <TextField
          label="Current Password"
          type={showPassword.current ? "text" : "password"}
          name="currentPassword"
          value={form.currentPassword}
          onChange={handleChange}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => toggleVisibility("current")}>
                  {showPassword.current ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        <TextField
          label="New Password"
          type={showPassword.new ? "text" : "password"}
          name="newPassword"
          value={form.newPassword}
          onChange={handleChange}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => toggleVisibility("new")}>
                  {showPassword.new ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        <TextField
          label="Confirm New Password"
          type={showPassword.confirm ? "text" : "password"}
          name="confirmPassword"
          value={form.confirmPassword}
          onChange={handleChange}
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => toggleVisibility("confirm")}>
                  {showPassword.confirm ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            )
          }}
        />

        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
        >
          Update Password
        </Button>

      </Box>

    </Container>
  );
}

export default ChangePassword;