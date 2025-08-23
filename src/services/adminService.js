import axios from "../config/axios";
//import axios from "axios";

const get_document_file_name = () => {
  return axios.get("/document_file");
}

const save_message = (msg) => {
  return axios.post("/admin/message", { message: msg })
}

const get_stats = () => {
  return axios.get("/admin/stats")
}

export { get_document_file_name, save_message, get_stats }