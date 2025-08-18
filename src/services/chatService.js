//import axios from "../config/axios";
import axios from "axios";


const chat = (userQuery) => {
  return axios.post("http://localhost:8000/chat", userQuery);
}

export { chat }