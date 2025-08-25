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
  LinearProgress,
  Alert,
} from "@mui/material"
import { CloudUpload, Description, Search, MoreVert, Download, Delete } from "@mui/icons-material"
import { get_document_file_name, uploadDocument, deleteDocument, downloadDocument } from "../../services/adminService";

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
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadError, setUploadError] = useState("")
  const [uploadSuccess, setUploadSuccess] = useState("")
  const [documentData, setDocumentData] = useState([])

  const filteredDocuments = documentData.filter((doc) => doc.name.toLowerCase().includes(searchTerm.toLowerCase()))

  useEffect(() => {
    get_document()
  }, [])

  const validateFile = (file) => {
    const allowedTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "text/markdown",
    ]
    const maxSize = 10 * 1024 * 1024 // 10MB

    if (!allowedTypes.includes(file.type) && !file.name.match(/\.(pdf|docx|txt|md)$/i)) {
      return "Unsupported file format. Please upload PDF, DOCX, TXT, or MD files."
    }

    if (file.size > maxSize) {
      return "File size exceeds 10MB limit."
    }

    return null
  }

  const handleFileUpload = async (files) => {
    setUploadError("")
    setUploadSuccess("")

    const fileArray = Array.from(files)

    for (const file of fileArray) {
      const error = validateFile(file)
      if (error) {
        setUploadError(error)
        return;
      }
    }

    setUploading(true)
    setUploadProgress(0)

    try {
      // Call your API endpoint
      const res = await uploadDocument(fileArray)

      if (res && res.data && +res.data.EC === 0) {
        setUploadProgress(100);
        setUploadSuccess(`Successfully uploaded ${fileArray.length} file(s)`);
        setTimeout(() => setUploadSuccess(""), 3000);
        get_document()
      } else {
        throw new Error(`Upload failed: ${res.data.EM}`)
      }
      // Optional: refresh document list or add new documents to state
    } catch (error) {
      setUploadError(`Upload failed: ${error.message}`)
    } finally {
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files)
    }
  }

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileUpload(e.target.files)
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

  const handleMenuClick = (event, doc) => {
    setAnchorEl(event.currentTarget)
    setSelectedDoc(doc)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedDoc(null)
  }

  const handleDownloadDoc = async (docId) => {
    // goi api & handle close
    // const res = await downloadDocument(docId)
    // if (res && res.data && +res.data.EC === 0) {
    //   handleMenuClose()
    // }
  }

  const handleDeleteDoc = async (docId) => {
    // goi api & handle close
    const res = await deleteDocument(docId)
    if (res && res.data && +res.data.EC === 0) {
      handleMenuClose()
      // goi lai api de refresh data
      get_document()
    }
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

          {uploadError && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setUploadError("")}>
              {uploadError}
            </Alert>
          )}

          {uploadSuccess && (
            <Alert severity="success" sx={{ mb: 2 }} onClose={() => setUploadSuccess("")}>
              {uploadSuccess}
            </Alert>
          )}

          <Paper
            sx={{
              border: "2px dashed",
              borderColor: dragActive ? "primary.main" : "grey.300",
              borderRadius: 2,
              p: 6,
              textAlign: "center",
              bgcolor: dragActive ? "primary.50" : "grey.50",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById("file-input").click()}
          >
            <input
              id="file-input"
              type="file"
              multiple
              accept=".pdf,.docx,.txt,.md"
              onChange={handleFileInputChange}
              style={{ display: "none" }}
            />

            <CloudUpload sx={{ fontSize: 48, color: dragActive ? "primary.main" : "text.secondary", mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Drop files here or click to upload
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Maximum file size: 10MB
            </Typography>
            <Button variant="contained" startIcon={<CloudUpload />} disabled={uploading}>
              {uploading ? "Uploading..." : "Choose Files"}
            </Button>

            {uploading && (
              <Box sx={{ mt: 3 }}>
                <LinearProgress variant="determinate" value={uploadProgress} />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {uploadProgress}% uploaded
                </Typography>
              </Box>
            )}
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
            {filteredDocuments.map((doc) => (
              <>
                <ListItem
                  key={doc.id}
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
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                  <MenuItem onClick={() => handleDownloadDoc(doc.id)}>
                    <Download sx={{ mr: 1 }} />
                    Download
                  </MenuItem>
                  <MenuItem onClick={() => handleDeleteDoc(selectedDoc?.id)} sx={{ color: "error.main" }}>
                    <Delete sx={{ mr: 1 }} />
                    Delete
                  </MenuItem>
                </Menu>
              </>
            ))}
          </List>

          {/* <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={handleMenuClose}>
              <Download sx={{ mr: 1 }} />
              Download
            </MenuItem>
            <MenuItem onClick={handleMenuClose} sx={{ color: "error.main" }}>
              <Delete sx={{ mr: 1 }} />
              Delete
            </MenuItem>
          </Menu> */}
        </CardContent>
      </Card>
    </Box>
  )
}
