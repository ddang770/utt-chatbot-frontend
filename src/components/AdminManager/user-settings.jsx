"use client"

import { useState } from "react"
import { Box, Card, CardContent, Typography, Button, TextField, Divider, Grid } from "@mui/material"
import { Lock, Logout, Person } from "@mui/icons-material"

export function UserSettings() {
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handlePasswordChange = (e) => {
    e.preventDefault()
    // Handle password change logic here
    console.log("Password change requested")
  }

  const handleLogout = () => {
    // Handle logout logic here
    console.log("Logout requested")
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your account settings and preferences
        </Typography>
      </Box>

      {/* Profile Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Person />
            <Typography variant="h6">Profile Information</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Your current account information
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>
                Username
              </Typography>
              <Typography variant="body2" color="text.secondary">
                admin
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" gutterBottom>
                Role
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Administrator
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle2" gutterBottom>
                Last Login
              </Typography>
              <Typography variant="body2" color="text.secondary">
                January 15, 2024 at 2:30 PM
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Password Change Section */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Lock />
            <Typography variant="h6">Change Password</Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Update your password to keep your account secure
          </Typography>
          <Box
            component="form"
            onSubmit={handlePasswordChange}
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            <TextField
              label="Current Password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter your current password"
              fullWidth
            />
            <TextField
              label="New Password"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter your new password"
              fullWidth
            />
            <TextField
              label="Confirm New Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your new password"
              fullWidth
            />
            <Button type="submit" variant="contained" fullWidth>
              Update Password
            </Button>
          </Box>
        </CardContent>
      </Card>

      <Divider sx={{ my: 3 }} />

      {/* Logout Section */}
      <Card>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Logout color="error" />
            <Typography variant="h6" color="error">
              Logout
            </Typography>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Sign out of your admin account
          </Typography>
          <Button variant="contained" color="error" onClick={handleLogout} fullWidth startIcon={<Logout />}>
            Logout
          </Button>
        </CardContent>
      </Card>
    </Box>
  )
}
