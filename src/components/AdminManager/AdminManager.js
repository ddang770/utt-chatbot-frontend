"use client"

import { useEffect, useState } from "react"
import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material"
import { AdminSidebar } from "./admin-sidebar"
import { AdminHeader } from "./admin-header"
import { AdminDashboard } from "./admin-dashboard"
import { DocumentManager } from "./document-manager"
import { UserSettings } from "./user-settings"

import { get_stats } from "../../services/adminService"
import { get_document_file_name } from "../../services/adminService";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#000000",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#666666",
    },
    background: {
      default: "#f8f9fa",
      paper: "#ffffff",
    },
    text: {
      primary: "#000000",
      secondary: "#666666",
    },
    divider: "#e0e0e0",
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
      color: "#000000",
    },
    h5: {
      fontWeight: 600,
      color: "#000000",
    },
    h6: {
      fontWeight: 500,
      color: "#000000",
    },
    body1: {
      color: "#000000",
    },
    body2: {
      color: "#666666",
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #e0e0e0",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 500,
        },
        contained: {
          backgroundColor: "#000000",
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#333333",
          },
        },
      },
    },
  },
})

const AdminManager = () => {
  const [activeSection, setActiveSection] = useState("dashboard")
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [statsData, setStatsData] = useState({})
  const [documentData, setDocumentData] = useState([])

  useEffect(() => {
    getRealStats()
    get_document()
  }, [])

  const getRealStats = async () => {
    let res = await get_stats()
    let data = res.data
    //console.log(">> check data stats", data)
    if (data && +data.EC === 0) {
      setStatsData(data.DT)
    }
  }

  const get_document = async () => {
    let res = await get_document_file_name()
    let data = res.data
    //console.log(">> check data docs", data)
    if (data && +data.EC === 0) {
      setDocumentData(data.DT)
    }
  }

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <AdminDashboard statsData={statsData} />
      case "documents":
        return <DocumentManager documentData={documentData} get_document={get_document} />
      case "settings":
        return <UserSettings />
      default:
        return <AdminDashboard />
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: "flex", height: "100vh" }}>
        <AdminSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
        <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <AdminHeader
            sidebarCollapsed={sidebarCollapsed}
            onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
          <Box component="main" sx={{ flexGrow: 1, overflow: "auto", p: 3 }}>
            {renderContent()}
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default AdminManager