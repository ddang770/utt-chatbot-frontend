import { useState } from "react"
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  Grid,
  Alert,
} from "@mui/material"
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from "@mui/icons-material"

const PromptTemplateManager = () => {
  const [templates, setTemplates] = useState([
    {
      id: 1,
      name: "Customer Support",
      category: "Support",
      prompt:
        "You are a helpful customer support assistant. Please assist the user with their inquiry in a professional and friendly manner.",
      variables: ["user_name", "issue_type"],
      isActive: true,
    },
    {
      id: 2,
      name: "Sales Assistant",
      category: "Sales",
      prompt: "You are a knowledgeable sales assistant. Help the customer find the right product for their needs.",
      variables: ["product_category", "budget"],
      isActive: false,
    },
  ])

  const [editingTemplate, setEditingTemplate] = useState(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    prompt: "",
    variables: "",
    isActive: true,
  })
  const [saveStatus, setSaveStatus] = useState("")

  const handleEdit = (template) => {
    setEditingTemplate(template)
    setFormData({
      name: template.name,
      category: template.category,
      prompt: template.prompt,
      variables: template.variables.join(", "),
      isActive: template.isActive,
    })
    setIsDialogOpen(true)
  }

  const handleAdd = () => {
    setEditingTemplate(null)
    setFormData({
      name: "",
      category: "",
      prompt: "",
      variables: "",
      isActive: true,
    })
    setIsDialogOpen(true)
  }

  const handleSave = () => {
    const variablesArray = formData.variables
      .split(",")
      .map((v) => v.trim())
      .filter((v) => v.length > 0)

    if (editingTemplate) {
      // Update existing template
      setTemplates((prev) =>
        prev.map((template) =>
          template.id === editingTemplate.id
            ? {
              ...template,
              name: formData.name,
              category: formData.category,
              prompt: formData.prompt,
              variables: variablesArray,
              isActive: formData.isActive,
            }
            : template,
        ),
      )
      setSaveStatus("Template updated successfully!")
    } else {
      // Add new template
      const newTemplate = {
        id: Date.now(),
        name: formData.name,
        category: formData.category,
        prompt: formData.prompt,
        variables: variablesArray,
        isActive: formData.isActive,
      }
      setTemplates((prev) => [...prev, newTemplate])
      setSaveStatus("Template created successfully!")
    }

    setIsDialogOpen(false)
    setTimeout(() => setSaveStatus(""), 3000)
  }

  const handleDelete = (templateId) => {
    setTemplates((prev) => prev.filter((template) => template.id !== templateId))
    setSaveStatus("Template deleted successfully!")
    setTimeout(() => setSaveStatus(""), 3000)
  }

  const handleToggleActive = (templateId) => {
    setTemplates((prev) =>
      prev.map((template) => (template.id === templateId ? { ...template, isActive: !template.isActive } : template)),
    )
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: "bold", color: "text.primary" }}>
          Prompt Template Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{
            bgcolor: "primary.main",
            color: "primary.contrastText",
            "&:hover": { bgcolor: "primary.dark" },
          }}
        >
          Add Template
        </Button>
      </Box>

      {saveStatus && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {saveStatus}
        </Alert>
      )}

      <Grid container spacing={3}>
        {templates.map((template) => (
          <Grid item xs={12} md={6} key={template.id}>
            <Card sx={{ height: "100%", bgcolor: "background.paper", border: "1px solid", borderColor: "divider" }}>
              <CardHeader
                title={
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                      {template.name}
                    </Typography>
                    <Chip
                      label={template.category}
                      size="small"
                      sx={{ bgcolor: "secondary.main", color: "secondary.contrastText" }}
                    />
                    <Chip
                      label={template.isActive ? "Active" : "Inactive"}
                      size="small"
                      color={template.isActive ? "success" : "default"}
                      onClick={() => handleToggleActive(template.id)}
                      sx={{ cursor: "pointer" }}
                    />
                  </Box>
                }
                action={
                  <Box>
                    <IconButton onClick={() => handleEdit(template)} size="small">
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(template.id)} size="small" sx={{ color: "error.main" }}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                }
              />
              <CardContent>
                <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
                  {template.prompt.length > 150 ? `${template.prompt.substring(0, 150)}...` : template.prompt}
                </Typography>
                {template.variables.length > 0 && (
                  <Box>
                    <Typography variant="caption" sx={{ color: "text.secondary", mb: 1, display: "block" }}>
                      Variables:
                    </Typography>
                    <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}>
                      {template.variables.map((variable, index) => (
                        <Chip key={index} label={`{${variable}}`} size="small" variant="outlined" />
                      ))}
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Edit/Add Dialog */}
      <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editingTemplate ? "Edit Template" : "Add New Template"}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
            <TextField
              label="Template Name"
              value={formData.name}
              onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
              fullWidth
              required
            />
            <TextField
              label="Category"
              value={formData.category}
              onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
              fullWidth
              required
            />
            <TextField
              label="Prompt Template"
              value={formData.prompt}
              onChange={(e) => setFormData((prev) => ({ ...prev, prompt: e.target.value }))}
              multiline
              rows={6}
              fullWidth
              required
              helperText="Write your prompt template here. Use {variable_name} for dynamic variables."
            />
            <TextField
              label="Variables"
              value={formData.variables}
              onChange={(e) => setFormData((prev) => ({ ...prev, variables: e.target.value }))}
              fullWidth
              helperText="Comma-separated list of variables (e.g., user_name, issue_type)"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsDialogOpen(false)} startIcon={<CancelIcon />}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={!formData.name || !formData.category || !formData.prompt}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export { PromptTemplateManager }
export default PromptTemplateManager
