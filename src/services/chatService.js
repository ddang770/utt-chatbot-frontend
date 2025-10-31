import axios from "../config/axios";
//import axios from "axios";

const getUserCookies = () => {
  return axios.get("/ck");
}

const chat = (userQuery) => {
  // return axios.post("/chat", userQuery);
  console.log("Sending payload:", { user_query: userQuery });
  try {
    return axios.post("/chat", { user_query: userQuery }, {
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Chat API error:", err);
    throw err;
  }
}


export { chat, getUserCookies }