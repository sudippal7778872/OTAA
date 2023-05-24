import axios from "axios";
axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;

const UploadFile = (formData, onUploadProgress) => {
  console.log("reach to servicesssssssss");
  return axios.post("/fileupload/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress,
  });
};

// Dispute Service End
const fileUploadService = {
  UploadFile,
};

export default fileUploadService;
