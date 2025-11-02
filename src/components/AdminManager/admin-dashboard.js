import { useState, useMemo, useEffect } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
  Pagination,
  Stack,
  Button
} from "@mui/material"
import { People, Chat, Description, DateRange, AccessTime, Refresh } from "@mui/icons-material"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js"
import { Line, Bar } from "react-chartjs-2"

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, ChartTooltip, Legend)

// const mockDataWithDates = {
//   users: [
//     { date: "2025-09-15", count: 45 },
//     { date: "2025-09-16", count: 52 },
//     { date: "2025-09-17", count: 38 },
//     { date: "2025-09-18", count: 67 },
//     { date: "2025-09-19", count: 73 },
//     { date: "2025-09-20", count: 58 },
//     { date: "2025-09-21", count: 42 },
//     { date: "2025-09-22", count: 89 },
//     { date: "2025-09-23", count: 95 },
//     { date: "2025-09-24", count: 76 },
//   ],
//   messages: [
//     { date: "2025-09-15", count: 234 },
//     { date: "2025-09-16", count: 456 },
//     { date: "2025-09-17", count: 123 },
//     { date: "2025-09-18", count: 789 },
//     { date: "2025-09-19", count: 567 },
//     { date: "2025-09-20", count: 345 },
//     { date: "2025-09-21", count: 678 },
//     { date: "2025-09-22", count: 890 },
//     { date: "2025-09-23", count: 432 },
//     { date: "2025-09-24", count: 654 },
//   ],
//   documents: [
//     { date: "2025-09-15", count: 3 },
//     { date: "2025-09-16", count: 5 },
//     { date: "2025-09-17", count: 2 },
//     { date: "2025-09-18", count: 8 },
//     { date: "2025-09-19", count: 4 },
//     { date: "2025-09-20", count: 6 },
//     { date: "2025-09-21", count: 1 },
//     { date: "2025-09-22", count: 9 },
//     { date: "2025-09-23", count: 7 },
//     { date: "2025-09-24", count: 3 },
//   ],
// }

// const mockMessagesWithDates = [
//   {
//     id: 1,
//     user: "John Doe",
//     message: "How can I reset my password?",
//     timestamp: "2024-01-24T10:30:00Z",
//     avatar: "JD",
//   },
//   {
//     id: 2,
//     user: "Sarah Wilson",
//     message: "The chatbot is not responding to my queries about pricing.",
//     timestamp: "2024-01-24T10:25:00Z",
//     avatar: "SW",
//   },
//   {
//     id: 3,
//     user: "Mike Johnson",
//     message: "Great service! The AI helped me find exactly what I needed.",
//     timestamp: "2024-01-24T10:22:00Z",
//     avatar: "MJ",
//   },
//   {
//     id: 4,
//     user: "Emily Chen",
//     message: "Can you add support for multiple languages?",
//     timestamp: "2024-01-23T15:18:00Z",
//     avatar: "EC",
//   },
//   {
//     id: 5,
//     user: "David Brown",
//     message: "The document upload feature is working perfectly now.",
//     timestamp: "2024-01-23T14:15:00Z",
//     avatar: "DB",
//   },
//   {
//     id: 6,
//     user: "Lisa Wang",
//     message: "The new update looks amazing!",
//     timestamp: "2024-01-22T16:45:00Z",
//     avatar: "LW",
//   },
//   {
//     id: 7,
//     user: "Tom Anderson",
//     message: "Having trouble with file uploads.",
//     timestamp: "2024-01-22T11:30:00Z",
//     avatar: "TA",
//   },
// ]

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: "rgba(0, 0, 0, 0.1)",
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
}

export function AdminDashboard({ statsData = {}, dateRange = {}, setDateRange }) {
  //const [dateRange, setDateRange] = useState(props.dateRange)
  const [refreshKey, setRefreshKey] = useState(0)
  const [messagesPage, setMessagesPage] = useState(1)
  const [messagesPerPage] = useState(3) // Show 3 messages per page
  const [pendingDateRange, setPendingDateRange] = useState(dateRange);

  // safe fallbacks so hooks (useMemo) always operate on defined values
  const usersArr = Array.isArray(statsData.users) ? statsData.users : []
  const messagesArr = Array.isArray(statsData.messages) ? statsData.messages : []
  const documentsArr = statsData.documents ? statsData.documents : 0
  const recentMessagesArr = Array.isArray(statsData.dataMessagesWithDates) ? statsData.dataMessagesWithDates : []

  const filteredData = useMemo(() => {
    const filterByDateRange = (data, dateField = "date") => {
      if (!dateRange.startDate && !dateRange.endDate) return data

      return data.filter((item) => {
        const itemDate = new Date(item[dateField])
        const start = dateRange.startDate ? new Date(dateRange.startDate) : new Date("1900-01-01")
        const end = dateRange.endDate ? new Date(dateRange.endDate) : new Date("2100-01-01")

        return itemDate >= start && itemDate <= end
      })
    }

    const filteredUsers = filterByDateRange(usersArr)
    const filteredMessages = filterByDateRange(messagesArr)
    const filteredRecentMessages = filterByDateRange(recentMessagesArr, "timestamp")

    // const filteredUsers = filterByDateRange(mockDataWithDates.users)
    // const filteredMessages = filterByDateRange(mockDataWithDates.messages)
    // const filteredDocuments = filterByDateRange(mockDataWithDates.documents)
    // const filteredRecentMessages = filterByDateRange(mockMessagesWithDates, "timestamp")

    // Calculate stats from filtered data
    const totalUsers = filteredUsers.reduce((sum, item) => sum + item.count, 0)
    const totalMessages = filteredMessages.reduce((sum, item) => sum + item.count, 0)
    // const totalDocuments = filteredDocuments.reduce((sum, item) => sum + item.count, 0)
    const totalDocuments = documentsArr
    const todayUsers = filteredUsers.length > 0 ? filteredUsers[filteredUsers.length - 1].count : 0

    // Prepare Chart.js data
    const userActivityData = {
      labels: filteredUsers.slice(-7).map((item) => new Date(item.date).toLocaleDateString("en", { weekday: "short" })),
      datasets: [
        {
          label: "Active Users",
          data: filteredUsers.slice(-7).map((item) => item.count),
          borderColor: "#000000",
          backgroundColor: "rgba(0, 0, 0, 0.1)",
          tension: 0.4,
        },
      ],
    }

    const messageVolumeData = {
      labels: filteredMessages
        .slice(-6)
        .map((item) => new Date(item.date).toLocaleDateString("en", { month: "short", day: "numeric" })),
      datasets: [
        {
          label: "Messages",
          data: filteredMessages.slice(-6).map((item) => item.count),
          backgroundColor: "#000000",
          borderColor: "#000000",
          borderWidth: 1,
        },
      ],
    }

    const totalMessagesPages = Math.ceil(filteredRecentMessages.length / messagesPerPage)
    const startIndex = (messagesPage - 1) * messagesPerPage
    const endIndex = startIndex + messagesPerPage
    const paginatedRecentMessages = filteredRecentMessages.slice(startIndex, endIndex)

    return {
      stats: {
        todayUsers,
        totalUsers,
        totalMessages,
        totalDocuments,
      },
      charts: {
        userActivity: userActivityData,
        messageVolume: messageVolumeData,
      },
      recentMessages: paginatedRecentMessages,
      totalRecentMessages: filteredRecentMessages.length,
      totalMessagesPages,
    }
  }, [dateRange, refreshKey, messagesPage, messagesPerPage])

  // Nếu chưa có data thì hiện loading và dừng render phần còn lại
  if (!statsData || Object.keys(statsData).length === 0) {
    return (
      <Box sx={{ p: 4, display: "flex", alignItems: "center", gap: 2 }}>
        {/* <CircularProgress size={24} /> */}
        <Typography>Loading dashboard...</Typography>
      </Box>
    )
  }

  const handlePendingDateChange = (field) => async (event) => {
    setPendingDateRange((prev) => ({
      ...prev,
      [field]: event.target.value,
    }))
    //setMessagesPage(1)
  }

  const handleRefresh = () => {
    setRefreshKey((prev) => prev + 1)
    setMessagesPage(1)
    console.log("[v0] Dashboard refreshed")
  }

  const handleMessagesPageChange = (event, value) => {
    setMessagesPage(value)
  }

  const formatTimestamp = (timestamp) => {
    const now = new Date()
    const messageTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60))

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} hours ago`
    } else {
      return `${Math.floor(diffInMinutes / 1440)} days ago`
    }
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ mb: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Box>
          <Typography variant="h4" component="h2" gutterBottom>
            Dashboard Overview
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Monitor your chatbot's performance and user engagement
          </Typography>
        </Box>
        <Tooltip title="Refresh all stats">
          <IconButton onClick={handleRefresh} sx={{ bgcolor: "background.paper", boxShadow: 1 }}>
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <DateRange />
            <Typography variant="h6">Filter by Date Range</Typography>
          </Box>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
            <TextField
              label="Start Date"
              type="date"
              value={pendingDateRange.startDate}
              onChange={handlePendingDateChange("startDate")}
              InputLabelProps={{
                shrink: true,
              }}
              size="small"
            />
            <TextField
              label="End Date"
              type="date"
              value={pendingDateRange.endDate}
              onChange={handlePendingDateChange("endDate")}
              InputLabelProps={{
                shrink: true,
              }}
              size="small"
            />
            {(pendingDateRange.startDate || pendingDateRange.endDate) && (
              <>
                <Chip
                  label={`${pendingDateRange.startDate || "Start"} - ${pendingDateRange.endDate || "End"}`}
                  onDelete={() => setPendingDateRange({ startDate: "", endDate: "" })}
                  variant="outlined"
                />
              </>
            )}
            <Button
              variant="contained"
              onClick={() => {
                setDateRange(pendingDateRange);
                setMessagesPage(1);
              }}
              sx={{ ml: 2 }}
            >
              Apply
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Today's Users
                </Typography>
                <People color="action" />
              </Box>
              <Typography variant="h4" component="div">
                {filteredData.stats.todayUsers}
              </Typography>
              <Typography variant="caption" color="success.main">
                +12% from yesterday
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Total Users
                </Typography>
                <People color="action" />
              </Box>
              <Typography variant="h4" component="div">
                {filteredData.stats.totalUsers.toLocaleString()}
              </Typography>
              <Typography variant="caption" color="success.main">
                +8% from last month
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Messages
                </Typography>
                <Chat color="action" />
              </Box>
              <Typography variant="h4" component="div">
                {filteredData.stats.totalMessages.toLocaleString()}
              </Typography>
              <Typography variant="caption" color="success.main">
                +23% from last week
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  Documents
                </Typography>
                <Description color="action" />
              </Box>
              <Typography variant="h4" component="div">
                {filteredData.stats.totalDocuments}
              </Typography>
              <Typography variant="caption" color="success.main">
                +3 this week
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                User Activity
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Daily active users over the past week
              </Typography>
              <Box sx={{ height: 256 }}>
                <Line data={filteredData.charts.userActivity} options={chartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Message Volume
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Messages processed over time
              </Typography>
              <Box sx={{ height: 256 }}>
                <Bar data={filteredData.charts.messageVolume} options={chartOptions} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card>
        <CardContent>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Chat />
            <Typography variant="h6">Recent Messages</Typography>
            <Chip label="Live" color="success" size="small" />
            {(dateRange.startDate || dateRange.endDate) && (
              <Chip label={`${filteredData.totalRecentMessages} filtered`} variant="outlined" size="small" />
            )}
          </Box>
          <List>
            {filteredData.recentMessages.map((message, index) => (
              <Box key={message.id}>
                <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: "black", color: "white", width: 32, height: 32, fontSize: "0.875rem" }}>
                      {message.avatar}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                        <Typography variant="subtitle2" component="span">
                          {message.user}
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <AccessTime sx={{ fontSize: 14, color: "text.secondary" }} />
                          <Typography variant="caption" color="text.secondary">
                            {formatTimestamp(message.timestamp)}
                          </Typography>
                        </Box>
                      </Box>
                    }
                    secondary={
                      <Typography variant="body2" color="text.primary">
                        {message.message}
                      </Typography>
                    }
                  />
                </ListItem>
                {index < filteredData.recentMessages.length - 1 && <Divider />}
              </Box>
            ))}
          </List>

          {filteredData.totalMessagesPages > 1 && (
            <Stack spacing={2} alignItems="center" sx={{ mt: 3 }}>
              <Pagination
                count={filteredData.totalMessagesPages}
                page={messagesPage}
                onChange={handleMessagesPageChange}
                color="primary"
                size="small"
              />
              <Typography variant="body2" color="text.secondary">
                Showing {(messagesPage - 1) * messagesPerPage + 1}-
                {Math.min(messagesPage * messagesPerPage, filteredData.totalRecentMessages)} of{" "}
                {filteredData.totalRecentMessages} messages
              </Typography>
            </Stack>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}
