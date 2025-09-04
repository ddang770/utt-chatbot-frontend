import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Avatar, Divider, Box } from "@mui/material"
import { Settings, Logout, Menu as MenuIcon } from "@mui/icons-material"
import { useState } from "react"
import { useAuth } from '../../context/AuthContext' // Add this import
import { useNavigate } from 'react-router-dom' // Add this import

export function AdminHeader({ sidebarCollapsed, onToggleSidebar }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const { user, logout } = useAuth() // Get user from context
  const navigate = useNavigate()

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  // Get first letter of username for Avatar
  const getInitials = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'A'
  }

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <IconButton edge="start" onClick={onToggleSidebar} sx={{ mr: 2, display: { md: "none" } }}>
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Chatbot Administration
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Hi, {user?.username || 'username'}!
          </Typography>
          <IconButton onClick={handleClick} size="small">
            <Avatar sx={{ width: 40, height: 40, bgcolor: "primary.main" }}>
              {getInitials(user?.username)}
            </Avatar>
          </IconButton>
        </Box>

        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          onClick={handleClose}
          PaperProps={{
            elevation: 0,
            sx: {
              overflow: "visible",
              filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
              mt: 1.5,
              minWidth: 200,
            },
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem onClick={handleClose}>
            <Settings sx={{ mr: 2 }} fontSize="small" />
            Change Password
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
            <Logout sx={{ mr: 2 }} fontSize="small" />
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}
