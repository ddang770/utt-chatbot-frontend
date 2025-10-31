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
  Tooltip,
} from "@mui/material"
import { Save as SaveIcon, RestartAlt as ResetIcon, Settings as SettingsIcon } from "@mui/icons-material"
import { updateChatbotcfg } from "../../services/adminService"

const ChatbotSettings = ({ chatbotConfig, getChatbotConfig }) => {
  const [settings, setSettings] = useState(chatbotConfig)

  const [saveStatus, setSaveStatus] = useState("")
  const [hasChanges, setHasChanges] = useState(false)

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    setHasChanges(true)
  }

  const handleSave = async () => {
    console.log("Saving settings:", settings)
    let res = await updateChatbotcfg(settings)
    if (res && res.data && +res.data.EC === 0) {
      setSaveStatus("Settings saved successfully!")
      getChatbotConfig()
      setSettings(settings)
      setHasChanges(false)
    }
    else {
      setSaveStatus("Something problem in save handle...")
    }
  }

  const handleReset = () => {
    setSettings(chatbotConfig)
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
                {/* <Tooltip title="Turn the chatbot on or off">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.isEnabled}
                        onChange={(e) => handleSettingChange("isEnabled", e.target.checked)}
                      />
                    }
                    label="Enable Chatbot"
                  />
                </Tooltip> */}
                <Tooltip title="The name displayed to users when they interact with the chatbot">
                  <TextField
                    label="Bot Name"
                    value={settings.botName}
                    onChange={(e) => handleSettingChange("botName", e.target.value)}
                    fullWidth
                  />
                </Tooltip>
                <Tooltip title="The first message users see when they start a conversation">
                  <TextField
                    label="Welcome Message"
                    value={settings.welcomeMessage}
                    onChange={(e) => handleSettingChange("welcomeMessage", e.target.value)}
                    multiline
                    rows={2}
                    fullWidth
                  />
                </Tooltip>
                <Tooltip title="The message shown when the chatbot doesn't understand a user's question">
                  <TextField
                    label="Fallback Message"
                    value={settings.fallbackMessage}
                    onChange={(e) => handleSettingChange("fallbackMessage", e.target.value)}
                    multiline
                    rows={2}
                    fullWidth
                  />
                </Tooltip>
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
                <Tooltip title="Choose which AI engine to use for generating responses">
                  <FormControl fullWidth>
                    <InputLabel>AI Model</InputLabel>
                    <Select
                      value={settings.model}
                      onChange={(e) => handleSettingChange("model", e.target.value)}
                      label="AI Model"
                    >
                      <MenuItem value={settings.model}>GPT-OSS-20B (Free)</MenuItem>
                      {/* <MenuItem value="openai/gpt-4">GPT-4</MenuItem>
                      <MenuItem value="openai/gpt-4-turbo">GPT-4 Turbo</MenuItem>
                      <MenuItem value="anthropic/claude-3">Claude 3</MenuItem> */}
                    </Select>
                  </FormControl>
                </Tooltip>

                <Box sx={{ pt: 1, pb: 2 }}>
                  <Tooltip title="Controls how creative vs. predictable responses are. Low = focused and consistent, High = creative and varied">
                    <Typography gutterBottom>Temperature: {settings.temperature}</Typography>
                  </Tooltip>
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
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
                      sx={{
                        width: "70%",
                        "& .MuiSlider-markLabel": {
                          fontSize: "0.75rem",
                          whiteSpace: "nowrap",
                        },
                      }}
                    />
                  </Box>
                </Box>

                <Tooltip title="Maximum length of each response. Higher values allow longer responses">
                  <TextField
                    label="Max Tokens"
                    type="number"
                    value={settings.maxTokens}
                    onChange={(e) => handleSettingChange("maxTokens", Number.parseInt(e.target.value))}
                    fullWidth
                  />
                </Tooltip>

                <Box sx={{ pt: 1 }}>
                  <Tooltip title="Controls diversity of responses. Lower = more focused, Higher = more varied">
                    <Typography gutterBottom>Top P: {settings.topP}</Typography>
                  </Tooltip>
                  <Box sx={{ display: "flex", justifyContent: "center" }}>
                    <Slider
                      value={settings.topP}
                      onChange={(e, value) => handleSettingChange("topP", value)}
                      min={0}
                      max={1}
                      step={0.1}
                      sx={{
                        width: "70%",
                      }}
                    />
                  </Box>
                </Box>

                <Tooltip title="Number of documents to consider when answering questions">
                  <TextField
                    label="Retriever k size"
                    type="number"
                    value={settings.retrieverKSize}
                    onChange={(e) => handleSettingChange("retrieverKSize", Number.parseInt(e.target.value))}
                    fullWidth
                  />
                </Tooltip>
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
                <Tooltip title="Whether the chatbot remembers previous messages in the conversation">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.enableContextMemory}
                        onChange={(e) => handleSettingChange("enableContextMemory", e.target.checked)}
                      />
                    }
                    label="Enable Context Memory"
                  />
                </Tooltip>
                <Tooltip title="Context memory limit (...todo)">
                  <TextField
                    label="Context memory limit"
                    type="number"
                    value={settings.contextMemoryLimit}
                    onChange={(e) => handleSettingChange("contextMemoryLimit", Number.parseInt(e.target.value))}
                    fullWidth
                  />
                </Tooltip>
                <Tooltip title="Allow the chatbot to use emojis in responses">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.enableEmojis}
                        onChange={(e) => handleSettingChange("enableEmojis", e.target.checked)}
                      />
                    }
                    label="Enable Emojis"
                  />
                </Tooltip>
                <Tooltip title="Artificial delay before showing the response in milliseconds (makes it feel more natural)">
                  <TextField
                    label="Response Delay (ms)"
                    type="number"
                    value={settings.responseDelay}
                    onChange={(e) => handleSettingChange("responseDelay", Number.parseInt(e.target.value))}
                    fullWidth
                  />
                </Tooltip>
                {/* <Tooltip title="Show a typing animation while the chatbot is thinking">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.enableTypingIndicator}
                        onChange={(e) => handleSettingChange("enableTypingIndicator", e.target.checked)}
                      />
                    }
                    label="Enable Typing Indicator"
                  />
                </Tooltip> */}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Logging Settings */}
        <Grid item xs={12} md={6}>
          <Card sx={{ bgcolor: "background.paper", border: "1px solid", borderColor: "divider" }}>
            <CardHeader title="Logging Settings" />
            <CardContent>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Tooltip title="Save conversation logs for debugging and monitoring">
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.enableLogging}
                        onChange={(e) => handleSettingChange("enableLogging", e.target.checked)}
                      />
                    }
                    label="Enable Logging"
                  />
                </Tooltip>
                <Tooltip title="Debug = most detailed, Info = general info, Warn = warnings only, Error = errors only">
                  <FormControl fullWidth>
                    <InputLabel>Log Level</InputLabel>
                    <Select
                      value={settings.logLevel}
                      onChange={(e) => handleSettingChange("logLevel", e.target.value)}
                      label="Log Level"
                    >
                      {/* <MenuItem value="debug">Debug</MenuItem> */}
                      <MenuItem value="info">Info</MenuItem>
                      {/* <MenuItem value="warn">Warn</MenuItem>
                      <MenuItem value="error">Error</MenuItem> */}
                    </Select>
                  </FormControl>
                </Tooltip>
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
