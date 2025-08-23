"use client"

import { useEffect, useState } from "react"
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Menu,
  MenuItem,
  InputAdornment,
} from "@mui/material"
import { CloudUpload, Description, Search, MoreVert, Download, Delete } from "@mui/icons-material"
import { get_document_file_name } from "../../services/adminService";

// Mock document data
// const mockDocuments = [
//   {
//     id: 1,
//     name: "Product Manual v2.1.pdf",
//     size: "2.4 MB",
//     uploadDate: "2024-01-15",
//     status: "processed",
//     type: "PDF",
//   }
// ]

export function DocumentManager() {
  const [searchTerm, setSearchTerm] = useState("")
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedDoc, setSelectedDoc] = useState(null)
  const [documentData, setDocumentData] = useState([])

  const filteredDocuments = documentData.filter((doc) => doc.name.toLowerCase().includes(searchTerm.toLowerCase()))

  useEffect(() => {
    get_document()
  }, [])

  const handleMenuClick = (event, doc) => {
    setAnchorEl(event.currentTarget)
    setSelectedDoc(doc)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedDoc(null)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "processed":
        return "success"
      case "processing":
        return "warning"
      case "failed":
        return "error"
      default:
        return "default"
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

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Document Manager
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Upload and manage documents for your chatbot knowledge base
        </Typography>
      </Box>

      {/* Upload Section */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Upload New Document
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Supported formats: PDF, DOCX, TXT, MD
          </Typography>
          <Paper
            sx={{
              border: "2px dashed",
              borderColor: "grey.300",
              borderRadius: 2,
              p: 6,
              textAlign: "center",
              bgcolor: "grey.50",
            }}
          >
            <CloudUpload sx={{ fontSize: 48, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Drop files here or click to upload
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Maximum file size: 10MB
            </Typography>
            <Button variant="contained" startIcon={<CloudUpload />}>
              Choose Files
            </Button>
          </Paper>
        </CardContent>
      </Card>

      {/* Document List */}
      <Card>
        <CardContent>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
            <Typography variant="h6">Documents ({filteredDocuments.length})</Typography>
            <TextField
              placeholder="Search documents..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              size="small"
              sx={{ maxWidth: 300 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <List>
            {filteredDocuments.map((doc, index) => (
              <ListItem
                key={index}
                sx={{
                  border: 1,
                  borderColor: "grey.200",
                  borderRadius: 1,
                  mb: 1,
                  "&:hover": { bgcolor: "grey.50" },
                }}
              >
                <ListItemIcon>
                  <Paper sx={{ p: 1, bgcolor: "grey.100" }}>
                    <Description color="action" />
                  </Paper>
                </ListItemIcon>
                <ListItemText primary={doc.name} secondary={`${doc.size} • Uploaded ${doc.uploadDate}`} />
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Chip label={doc.status} color={getStatusColor(doc.status)} size="small" />
                  <IconButton onClick={(e) => handleMenuClick(e, doc)}>
                    <MoreVert />
                  </IconButton>
                </Box>
              </ListItem>
            ))}
          </List>

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={handleMenuClose}>
              <Download sx={{ mr: 1 }} />
              Download
            </MenuItem>
            <MenuItem onClick={handleMenuClose} sx={{ color: "error.main" }}>
              <Delete sx={{ mr: 1 }} />
              Delete
            </MenuItem>
          </Menu>
        </CardContent>
      </Card>
    </Box>
  )
}
