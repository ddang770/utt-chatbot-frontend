//import axios from "../config/axios";
import axios from "axios";


const chat = (userQuery) => {
  return axios.post("http://localhost:8000/chat", userQuery);
}

const get_document_file_name = () => {
  return axios.get("http://localhost:8000/document_file");
}

export { chat, get_document_file_name }