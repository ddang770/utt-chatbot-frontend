import { useEffect, useState } from "react"
import { Box, CssBaseline, ThemeProvider, createTheme } from "@mui/material"
import { AdminSidebar } from "./admin-sidebar"
import { AdminHeader } from "./admin-header"
import { AdminDashboard } from "./admin-dashboard"
import { DocumentManager } from "./document-manager"
import { UserSettings } from "./user-settings"
import { ChatbotSettings } from "./chatbot-settings"
import { PromptTemplateManager } from "./prompt-template-manager"

import { get_stats, get_document_file_name, getChatbotcfg } from "../../services/adminService"

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
  const [refreshKey, setRefreshKey] = useState(0)
  const [chatbotConfig, setChatbotConfig] = useState({})

  // Lấy ngày đầu tháng và ngày hiện tại
  const getDefaultDateRange = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // 0-based
    const firstDay = new Date(year, month, 1);
    // Format YYYY-MM-DD
    const format = (d) => d.toISOString().slice(0, 10);

    return {
      startDate: format(firstDay),
      endDate: format(now),
    };
  };
  // set default dateRange
  const [dateRange, setDateRange] = useState(getDefaultDateRange())

  useEffect(() => {
    getRealStats({
      startDate: dateRange.startDate,
      endDate: dateRange.endDate,
    });
  }, [dateRange, refreshKey])

  useEffect(() => {
    get_document()
    getChatbotConfig()
  }, []);

  const getRealStats = async ({ startDate, endDate }) => {
    let res = await get_stats({ startDate, endDate })
    let data = res.data
    if (data && +data.EC === 0) {
      setStatsData(data.DT)
    }
  }

  const get_document = async () => {
    let res = await get_document_file_name()
    let data = res.data
    if (data && +data.EC === 0) {
      setDocumentData(data.DT)
    }
  }

  const getChatbotConfig = async () => {
    let res = await getChatbotcfg()
    let data = res.data
    if (data && +data.EC === 0) {
      setChatbotConfig(data.DT)
    }
  }

  const renderContent = () => {
    switch (activeSection) {
      case "dashboard":
        return <AdminDashboard statsData={statsData} dateRange={dateRange} setDateRange={setDateRange} />
      case "documents":
        return <DocumentManager documentData={documentData} get_document={get_document} />
      case "prompt-templates":
        return <PromptTemplateManager />
      case "chatbot-settings":
        return <ChatbotSettings chatbotConfig={chatbotConfig} getChatbotConfig={getChatbotConfig} />
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