import { useState } from "react"
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Slider,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  Grid,
} from "@mui/material"
import { Save as SaveIcon, RestartAlt as ResetIcon, Settings as SettingsIcon } from "@mui/icons-material"

const ChatbotSettings = () => {
  const [settings, setSettings] = useState({
    // General Settings
    botName: "AI Assistant",
    welcomeMessage: "Hello! How can I help you today?",
    fallbackMessage: "I apologize, but I don't understand. Could you please rephrase your question?",
    isEnabled: true,

    // AI Model Settings
    model: "gpt-3.5-turbo",
    temperature: 0.7,
    maxTokens: 150,
    topP: 1.0,

    // Conversation Settings
    maxConversationLength: 10,
    enableContextMemory: true,
    autoSuggestReplies: true,
    enableTypingIndicator: true,

    // Response Settings
    responseDelay: 1000,
    enableEmojis: true,
    enableMarkdown: true,

    // Security Settings
    enableProfanityFilter: true,
    enableSpamProtection: true,
    rateLimitPerMinute: 20,

    // Integration Settings
    enableAnalytics: true,
    enableLogging: true,
    logLevel: "info",
  })

  const [saveStatus, setSaveStatus] = useState("")
  const [hasChanges, setHasChanges] = useState(false)

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleSave = () => {
    // Here you would typically save to your backend
    console.log("Saving settings:", settings)
    setSaveStatus("Settings saved successfully!")
    setHasChanges(false)
    setTimeout(() => setSaveStatus(""), 3000)
  }

  const handleReset = () => {
    // Reset to default values
    setSettings({
      botName: "AI Assistant",
      welcomeMessage: "Hello! How can I help you today?",
      fallbackMessage: "I apologize, but I don't understand. Could you please rephrase your question?",
      isEnabled: true,
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      maxTokens: 150,
      topP: 1.0,
      maxConversationLength: 10,
      enableContextMemory: true,
      autoSuggestReplies: true,
      enableTypingIndicator: true,
      responseDelay: 1000,
      enableEmojis: true,
      enableMarkdown: true,
      enableProfanityFilter: true,
      enableSpamProtection: true,
      rateLimitPerMinute: 20,
      enableAnalytics: true,
      enableLogging: true,
      logLevel: "info",
    })
    setHasChanges(true)
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography
          variant="h4"
          sx={{ fontWeight: "bold", color: "text.primary", display: "flex", alignItems: "center", gap: 1 }}
        >
          <SettingsIcon />
          Chatbot Settings
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button variant="outlined" startIcon={<ResetIcon />} onClick={handleReset}>
            Reset to Default
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={handleSave}
            disabled={!hasChanges}
            sx={{
              bgcolor: "primary.main",
              color: "primary.contrastText",
              "&:hover": { bgcolor: "primary.dark" },
            }}
          >
            Save Changes
          </Button>
        </Box>
      </Box>

      {saveStatus && (
        <Alert severity="success" sx={{ mb: 2 }}>
          {saveStatus}
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* General Settings */}
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: "background.paper", border: "1px solid", borderColor: "divider" }}>
            <CardHeader title="General Settings" />
            <CardContent>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.isEnabled}
                      onChange={(e) => handleSettingChange("isEnabled", e.target.checked)}
                    />
                  }
                  label="Enable Chatbot"
                />
                <TextField
                  label="Bot Name"
                  value={settings.botName}
                  onChange={(e) => handleSettingChange("botName", e.target.value)}
                  fullWidth
                />
                <TextField
                  label="Welcome Message"
                  value={settings.welcomeMessage}
                  onChange={(e) => handleSettingChange("welcomeMessage", e.target.value)}
                  multiline
                  rows={2}
                  fullWidth
                />
                <TextField
                  label="Fallback Message"
                  value={settings.fallbackMessage}
                  onChange={(e) => handleSettingChange("fallbackMessage", e.target.value)}
                  multiline
                  rows={2}
                  fullWidth
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* AI Model Settings */}
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: "background.paper", border: "1px solid", borderColor: "divider" }}>
            <CardHeader title="AI Model Settings" />
            <CardContent>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <FormControl fullWidth>
                  <InputLabel>AI Model</InputLabel>
                  <Select
                    value={settings.model}
                    onChange={(e) => handleSettingChange("model", e.target.value)}
                    label="AI Model"
                  >
                    <MenuItem value="gpt-3.5-turbo">GPT-3.5 Turbo</MenuItem>
                    <MenuItem value="gpt-4">GPT-4</MenuItem>
                    <MenuItem value="claude-3">Claude 3</MenuItem>
                  </Select>
                </FormControl>

                <Box>
                  <Typography gutterBottom>Temperature: {settings.temperature}</Typography>
                  <Slider
                    value={settings.temperature}
                    onChange={(e, value) => handleSettingChange("temperature", value)}
                    min={0}
                    max={2}
                    step={0.1}
                    marks={[
                      { value: 0, label: "Focused" },
                      { value: 1, label: "Balanced" },
                      { value: 2, label: "Creative" },
                    ]}
                  />
                </Box>

                <TextField
                  label="Max Tokens"
                  type="number"
                  value={settings.maxTokens}
                  onChange={(e) => handleSettingChange("maxTokens", Number.parseInt(e.target.value))}
                  fullWidth
                />

                <Box>
                  <Typography gutterBottom>Top P: {settings.topP}</Typography>
                  <Slider
                    value={settings.topP}
                    onChange={(e, value) => handleSettingChange("topP", value)}
                    min={0}
                    max={1}
                    step={0.1}
                  />
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Conversation Settings */}
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: "background.paper", border: "1px solid", borderColor: "divider" }}>
            <CardHeader title="Conversation Settings" />
            <CardContent>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                  label="Max Conversation Length"
                  type="number"
                  value={settings.maxConversationLength}
                  onChange={(e) => handleSettingChange("maxConversationLength", Number.parseInt(e.target.value))}
                  fullWidth
                  helperText="Number of messages to keep in context"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.enableContextMemory}
                      onChange={(e) => handleSettingChange("enableContextMemory", e.target.checked)}
                    />
                  }
                  label="Enable Context Memory"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.autoSuggestReplies}
                      onChange={(e) => handleSettingChange("autoSuggestReplies", e.target.checked)}
                    />
                  }
                  label="Auto-suggest Replies"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.enableTypingIndicator}
                      onChange={(e) => handleSettingChange("enableTypingIndicator", e.target.checked)}
                    />
                  }
                  label="Show Typing Indicator"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Response Settings */}
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: "background.paper", border: "1px solid", borderColor: "divider" }}>
            <CardHeader title="Response Settings" />
            <CardContent>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box>
                  <Typography gutterBottom>Response Delay: {settings.responseDelay}ms</Typography>
                  <Slider
                    value={settings.responseDelay}
                    onChange={(e, value) => handleSettingChange("responseDelay", value)}
                    min={0}
                    max={5000}
                    step={100}
                    marks={[
                      { value: 0, label: "Instant" },
                      { value: 2500, label: "Natural" },
                      { value: 5000, label: "Slow" },
                    ]}
                  />
                </Box>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.enableEmojis}
                      onChange={(e) => handleSettingChange("enableEmojis", e.target.checked)}
                    />
                  }
                  label="Enable Emojis"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.enableMarkdown}
                      onChange={(e) => handleSettingChange("enableMarkdown", e.target.checked)}
                    />
                  }
                  label="Enable Markdown Formatting"
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Security Settings */}
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: "background.paper", border: "1px solid", borderColor: "divider" }}>
            <CardHeader title="Security Settings" />
            <CardContent>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.enableProfanityFilter}
                      onChange={(e) => handleSettingChange("enableProfanityFilter", e.target.checked)}
                    />
                  }
                  label="Enable Profanity Filter"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.enableSpamProtection}
                      onChange={(e) => handleSettingChange("enableSpamProtection", e.target.checked)}
                    />
                  }
                  label="Enable Spam Protection"
                />
                <TextField
                  label="Rate Limit (per minute)"
                  type="number"
                  value={settings.rateLimitPerMinute}
                  onChange={(e) => handleSettingChange("rateLimitPerMinute", Number.parseInt(e.target.value))}
                  fullWidth
                />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Integration Settings */}
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: "background.paper", border: "1px solid", borderColor: "divider" }}>
            <CardHeader title="Integration Settings" />
            <CardContent>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.enableAnalytics}
                      onChange={(e) => handleSettingChange("enableAnalytics", e.target.checked)}
                    />
                  }
                  label="Enable Analytics"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={settings.enableLogging}
                      onChange={(e) => handleSettingChange("enableLogging", e.target.checked)}
                    />
                  }
                  label="Enable Logging"
                />
                <FormControl fullWidth>
                  <InputLabel>Log Level</InputLabel>
                  <Select
                    value={settings.logLevel}
                    onChange={(e) => handleSettingChange("logLevel", e.target.value)}
                    label="Log Level"
                  >
                    <MenuItem value="error">Error</MenuItem>
                    <MenuItem value="warn">Warning</MenuItem>
                    <MenuItem value="info">Info</MenuItem>
                    <MenuItem value="debug">Debug</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export { ChatbotSettings }
export default ChatbotSettings
