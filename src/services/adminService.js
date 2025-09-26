import axios from "../config/axios";
//import axios from "axios";

const get_document_file_name = () => {
  return axios.get("/admin/document/read");
}

const save_message = (msg) => {
  return axios.post("/admin/message", { message: msg })
}

const get_stats = ({ startDate, endDate }) => {
  const params = {};
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  return axios.get("/admin/stats", { params });
}

const uploadDocument = (files) => {
  // create form data
  const formData = new FormData();
  // ps: key "files"
  files.forEach(file => {
    formData.append("files", file); // -> phải trùng key "files"
  });
  return axios.post("/admin/document/add", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    }
  })
}

const deleteDocument = (docID) => {
  return axios.post("/admin/document/delete", { id: docID })
}

const downloadDocument = (docID) => {
  return axios.post("/admin/document/download", { id: docID })
}


const viewDocument = async (docId) => {
  const authToken = localStorage.getItem("token");
  return await axios.get(`/admin/documents/${docId}/generate_link`, {
    headers: { Authorization: `Bearer ${authToken}` }
  });
};

export {
  get_document_file_name,
  save_message, get_stats, uploadDocument, deleteDocument,
  downloadDocument, viewDocument
}