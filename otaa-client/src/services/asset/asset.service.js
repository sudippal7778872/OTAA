import axios from "axios";
// import authHeader from "../Utils/auth-header";
axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;

// const getHOPBySearch = (data) => {
//   const id = data.search;
//   return axios.post(`/api/ppmchops/search/${id}`, data, {
//     headers: authHeader(),
//   });
// };

const createAnalyzerData = (uploadFileInformation) => {
  return axios.post(`/api/v1/assets`, uploadFileInformation);
};

// const deletePPMCHop = (id) => {
//   return axios.delete(`/api/ppmchops/datafilter/data/${id}`, {
//     headers: authHeader(),
//   });
// };

// const getPPMCHopById = (id) => {
//   return axios.get(`/api/ppmchops/datafilter/data/${id}`, {
//     headers: authHeader(),
//   });
// };

// const updatePPMCHopById = (id, PPMCHop) => {
//   return axios.put(`/api/ppmchops/datafilter/data/${id}`, { PPMCHop });
// };

const deleteAssetsCollection = () => {
  return axios.delete(`/api/v1/assets`);
};

const PPMCHOPService = {
  createAnalyzerData,
  deleteAssetsCollection,
};

export default PPMCHOPService;
