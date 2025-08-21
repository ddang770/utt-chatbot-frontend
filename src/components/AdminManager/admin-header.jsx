"use client"

import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Avatar, Divider } from "@mui/material"
import { Settings, Logout } from "@mui/icons-material"
import MenuIcon from '@mui/icons-material/Menu';
import { useState } from "react"

export function AdminHeader({ sidebarCollapsed, onToggleSidebar }) {
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
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

        <IconButton onClick={handleClick} size="small" sx={{ ml: 2 }}>
          <Avatar sx={{ width: 40, height: 40, bgcolor: "primary.main" }}>AD</Avatar>
        </IconButton>

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
          <MenuItem onClick={handleClose} sx={{ color: "error.main" }}>
            <Logout sx={{ mr: 2 }} fontSize="small" />
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  )
}
