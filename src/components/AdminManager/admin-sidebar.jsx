"use client"

import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  IconButton,
  Divider,
} from "@mui/material"
import { Dashboard, Description, Settings, ChevronLeft, ChevronRight } from "@mui/icons-material"

const navigationItems = [
  {
    id: "dashboard",
    label: "Admin Dashboard",
    icon: Dashboard,
  },
  {
    id: "documents",
    label: "Document Manager",
    icon: Description,
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
  },
]

export function AdminSidebar({ activeSection, onSectionChange, collapsed, onToggleCollapse }) {
  const drawerWidth = collapsed ? 64 : 240

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box",
          transition: "width 0.3s ease-in-out",
        },
      }}
    >
      {/* Header */}
      <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {!collapsed && (
          <Typography variant="h6" noWrap component="div">
            Admin Panel
          </Typography>
        )}
        <IconButton onClick={onToggleCollapse} size="small">
          {collapsed ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </Box>

      <Divider />

      {/* Navigation */}
      <List sx={{ flexGrow: 1, pt: 2 }}>
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = activeSection === item.id

          return (
            <ListItem key={item.id} disablePadding sx={{ px: 1 }}>
              <ListItemButton
                selected={isActive}
                onClick={() => onSectionChange(item.id)}
                sx={{
                  minHeight: 48,
                  justifyContent: collapsed ? "center" : "initial",
                  px: 2.5,
                  borderRadius: 1,
                  mx: 1,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: collapsed ? "auto" : 3,
                    justifyContent: "center",
                  }}
                >
                  <Icon />
                </ListItemIcon>
                {!collapsed && <ListItemText primary={item.label} />}
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
    </Drawer>
  )
}
