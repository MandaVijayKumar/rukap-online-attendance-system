import React, { useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from "@mui/material";

function ChangePasswordModal({ open, handleClose }) {

  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {

    if (form.newPassword !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    axios.post("https://rukap.edu.in/attendance-api/change-password-staff",
      {
        username,
        currentPassword: form.currentPassword,
        newPassword: form.newPassword
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
      .then(res => {
        alert(res.data.message);
        handleClose();
      })
      .catch(err => {
        alert(err.response?.data?.message || "Error");
      });

  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>

      <DialogTitle>Change Password</DialogTitle>

      <DialogContent>

        <TextField
          label="Current Password"
          type="password"
          name="currentPassword"
          fullWidth
          margin="normal"
          onChange={handleChange}
        />

        <TextField
          label="New Password"
          type="password"
          name="newPassword"
          fullWidth
          margin="normal"
          onChange={handleChange}
        />

        <TextField
          label="Confirm Password"
          type="password"
          name="confirmPassword"
          fullWidth
          margin="normal"
          onChange={handleChange}
        />

      </DialogContent>

      <DialogActions>

        <Button onClick={handleClose}>
          Cancel
        </Button>

        <Button variant="contained" onClick={handleSubmit}>
          Update
        </Button>

      </DialogActions>

    </Dialog>
  );
}

export default ChangePasswordModal;