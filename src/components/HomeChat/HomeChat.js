"use client"

import { useState, useRef, useEffect } from "react"
import {
  Box,
  TextField,
  IconButton,
  Typography,
  Paper,
  Avatar,
  Fade,
  ThemeProvider,
  createTheme,
  CssBaseline,
} from "@mui/material"
import SendIcon from "@mui/icons-material/Send"
import PersonIcon from "@mui/icons-material/Person"
//import SmartToyIcon from "@mui/icons-material/SmartToy"
import "./HomeChat.css"
import { chat, getUserCookies } from "../../services/chatService"
import { save_message } from "../../services/adminService"

const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#10a37f",
    },
    background: {
      default: "#0a0a0a",
      paper: "rgba(255, 255, 255, 0.05)",
    },
    text: {
      primary: "#ffffff",
      secondary: "rgba(255, 255, 255, 0.7)",
    },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
  },
})

const HomeChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Chào bạn, tôi là UTT AI Chatbot - trợ lý ảo hỗ trợ tư vấn tuyển sinh của Trường Đại học Công nghệ Giao thông vận tải, tôi có thể giúp gì cho bạn về vấn đề tuyển sinh?",
      sender: "ai",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef(null)
  const containerRef = useRef(null)

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // kiểm tra cookie "user_id"
    const existingUserId = getCookies("user_id");
    if (!existingUserId) {
      // chưa có cookie -> gọi API để server set
      getUserCookies()
    }
  }, [])

  const getCookies = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage = {
      id: Date.now().toString(),
      text: inputValue,
      query: inputValue,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    //`prev` is the **previous state value** of the `messages` array.

    setInputValue("")
    setIsTyping(true)

    let res = await chat(userMessage)
    //console.log(">> check response: ", res)

    if (res && res.data && res.data.EC === 0) {
      const aiMessage = {
        id: Date.now() + 1,
        text: res.data.DT,
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiMessage])
      setIsTyping(false)

      save_message(inputValue)
    }

    // Simulate AI response
    // setTimeout(() => {
    //   const aiMessage = {
    //     id: Date.now() + 1,
    //     text: "I understand your message. This is a simulated response from the AI assistant. In a real implementation, this would connect to an actual AI service.",
    //     sender: "ai",
    //     timestamp: new Date(),
    //   }
    //   setMessages((prev) => [...prev, aiMessage])
    //   setIsTyping(false)
    // }, 1500)
  }

  const UttBotAvatar = () => {
    return <img
      src="https://chatbot.utt.edu.vn/_next/image?url=%2Fimages%2Favatabot.jpeg&w=64&q=75"
      alt="UTT AI Assistant"
      style={{
        width: "24px",
        height: "24px",
        borderRadius: "50%",
      }}
    />
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          height: "100vh",
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          "&::before": {
            content: '""',
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 20% 80%, rgba(16, 163, 127, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
            pointerEvents: "none",
          },
        }}
      >
        <Paper
          elevation={0}
          sx={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(20px)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            p: 2,
            zIndex: 10,
            boxShadow: "0 8px 32px rgba(0, 0, 0, 0.3)",
            width: "100%",
          }}
        >
          <Box sx={{ maxWidth: "1140px", mx: "auto" }}>
            {/* <Typography
              variant="h6"
              sx={{
                textAlign: "center",
                fontWeight: 600,
                background: "linear-gradient(45deg, #10a37f, #3b82f6)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              UTT Chatbot
            </Typography> */}
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <img
                src="https://chatbot.utt.edu.vn/_next/image?url=%2Fimages%2Fbanner_utt_2025.png&w=640&q=75"
                alt="UTT Logo"
                style={{
                  height: "52px",
                  maxWidth: "300px",
                  objectFit: "contain",
                }}
              />
            </Box>
          </Box>
        </Paper>

        <Box
          ref={containerRef}
          sx={{
            flex: 1,
            overflow: "auto",
            p: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
            maxWidth: "1140px",
            mx: "auto",
            width: "100%",
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: "rgba(255, 255, 255, 0.05)",
              borderRadius: "3px",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "rgba(255, 255, 255, 0.2)",
              borderRadius: "3px",
              "&:hover": {
                background: "rgba(255, 255, 255, 0.3)",
              },
            },
          }}
        >
          {messages.map((message, index) => (
            <Fade in={true} timeout={500} key={message.id}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: message.sender === "user" ? "flex-end" : "flex-start",
                  mb: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1,
                    maxWidth: "70%",
                    flexDirection: message.sender === "user" ? "row-reverse" : "row",
                  }}
                >
                  <Avatar
                    sx={{
                      width: 35,
                      height: 35,
                      background:
                        message.sender === "user"
                          ? "linear-gradient(45deg, #3b82f6, #8b5cf6)"
                          : "transparent",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    {message.sender === "user" ? <PersonIcon /> : <UttBotAvatar />}
                  </Avatar>

                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      background: message.sender === "user" ? "rgba(59, 130, 246, 0.15)" : "rgba(255, 255, 255, 0.08)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: 2,
                      position: "relative",
                      boxShadow:
                        message.sender === "user"
                          ? "0 8px 32px rgba(59, 130, 246, 0.2)"
                          : "0 8px 32px rgba(16, 163, 127, 0.1)",
                      "&::before": {
                        content: '""',
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background:
                          message.sender === "user"
                            ? "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(147, 51, 234, 0.05) 100%)"
                            : "linear-gradient(135deg, rgba(16, 163, 127, 0.1) 0%, rgba(5, 150, 105, 0.05) 100%)",
                        borderRadius: "inherit",
                        pointerEvents: "none",
                      },
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow:
                          message.sender === "user"
                            ? "0 12px 40px rgba(59, 130, 246, 0.3)"
                            : "0 12px 40px rgba(16, 163, 127, 0.2)",
                      },
                    }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        color: "white",
                        lineHeight: 1.6,
                        position: "relative",
                        zIndex: 1,
                      }}
                    >
                      {message.text}
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            </Fade>
          ))}

          {isTyping && (
            <Fade in={true}>
              <Box sx={{ display: "flex", justifyContent: "flex-start", mb: 1 }}>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1, maxWidth: "70%" }}>
                  <Avatar
                    sx={{
                      width: 35,
                      height: 35,
                      background: "transparent",
                      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
                    }}
                  >
                    <UttBotAvatar />
                  </Avatar>

                  <Paper
                    elevation={0}
                    sx={{
                      p: 2,
                      background: "rgba(255, 255, 255, 0.08)",
                      backdropFilter: "blur(20px)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      borderRadius: 2,
                      boxShadow: "0 8px 32px rgba(16, 163, 127, 0.1)",
                    }}
                  >
                    <Typography variant="body1" sx={{ color: "rgba(255, 255, 255, 0.7)" }}>
                      AI is typing...
                    </Typography>
                  </Paper>
                </Box>
              </Box>
            </Fade>
          )}

          <div ref={messagesEndRef} />
        </Box>

        <Box
          sx={{
            background: "rgba(255, 255, 255, 0.05)",
            backdropFilter: "blur(20px)",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
            p: 2,
            boxShadow: "0 -8px 32px rgba(0, 0, 0, 0.3)",
            width: "100%",
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 1,
              alignItems: "flex-end",
              maxWidth: "1140px",
              mx: "auto",
            }}
          >
            <TextField
              fullWidth
              multiline
              maxRows={4}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Nhập tin nhắn..."
              variant="outlined"
              sx={{
                "& .MuiOutlinedInput-root": {
                  background: "rgba(255, 255, 255, 0.08)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: 2,
                  color: "white",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    background: "rgba(255, 255, 255, 0.12)",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                  },
                  "&.Mui-focused": {
                    background: "rgba(255, 255, 255, 0.12)",
                    boxShadow: "0 0 0 2px rgba(16, 163, 127, 0.3)",
                    borderColor: "#10a37f",
                  },
                  "& fieldset": {
                    border: "none",
                  },
                },
                "& .MuiInputBase-input::placeholder": {
                  color: "rgba(255, 255, 255, 0.5)",
                },
              }}
            />

            <IconButton
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
              sx={{
                background: "linear-gradient(45deg, #10a37f, #059669)",
                color: "white",
                width: 48,
                height: 48,
                boxShadow: "0 4px 20px rgba(16, 163, 127, 0.3)",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "linear-gradient(45deg, #059669, #047857)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 30px rgba(16, 163, 127, 0.4)",
                },
                "&:disabled": {
                  background: "rgba(255, 255, 255, 0.1)",
                  color: "rgba(255, 255, 255, 0.3)",
                  boxShadow: "none",
                },
              }}
            >
              <SendIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default HomeChat
