"use client"

import { Box, Card, CardContent, Typography, Grid, Paper } from "@mui/material"
import { People, Chat, Description, TrendingUp } from "@mui/icons-material"
import { get_stats } from "../../services/adminService"
import { useEffect, useState } from "react"

// real data from your backend
const mockStats = {
  todayUsers: 142,
  totalUsers: 2847,
  totalMessages: 15632,
  totalDocuments: 89,
}

export function AdminDashboard() {

  const [statsData, setStatsData] = useState({})

  useEffect(() => {
    getRealStats()
  }, [])

  const getRealStats = async () => {
    let res = await get_stats()
    let data = res.data
    console.log(">> check data stats", data)
    if (data && +data.EC === 0) {
      setStatsData(data.DT)
    }
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Dashboard Overview
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Monitor your chatbot's performance and user engagement
        </Typography>
      </Box>

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
                {statsData.todays_users?.toLocaleString() || "Loading..."}
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
                {statsData.total_users?.toLocaleString() || "Loading..."}
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
                {statsData.num_messages?.toLocaleString() || "Loading..."}
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
                {mockStats.totalDocuments}
              </Typography>
              <Typography variant="caption" color="success.main">
                +3 this week
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Placeholder */}
      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                User Activity
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Daily active users over the past week
              </Typography>
              <Paper
                sx={{
                  height: 256,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "grey.50",
                }}
              >
                <Box sx={{ textAlign: "center" }}>
                  <TrendingUp sx={{ fontSize: 48, color: "text.secondary", mb: 1 }} />
                  <Typography color="text.secondary">Chart will be implemented next</Typography>
                </Box>
              </Paper>
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
              <Paper
                sx={{
                  height: 256,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  bgcolor: "grey.50",
                }}
              >
                <Box sx={{ textAlign: "center" }}>
                  <Chat sx={{ fontSize: 48, color: "text.secondary", mb: 1 }} />
                  <Typography color="text.secondary">Chart will be implemented next</Typography>
                </Box>
              </Paper>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}
