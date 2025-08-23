import axios from "../config/axios";
//import axios from "axios";

const getUserCookies = () => {
  return axios.get("/ck");
}

const chat = (userQuery) => {
  return axios.post("/chat", userQuery);
}


export { chat, getUserCookies }