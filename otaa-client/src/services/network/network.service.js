import axios from "axios";
axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;

//will add limit later
const getAllNetworkStatByUserId = (userId, pageSize, pageNumber) => {
  return axios.post(`/api/v1/networks`, { userId, pageSize, pageNumber });
};

//graph service
const getNetworkGraphByUserId = (userId) => {
  return axios.post(`/api/v1/networks/graph`, { userId });
};

const deleteNetworksCollection = () => {
  return axios.delete(`/api/v1/networks/`);
};

const getNetworkStatByAssetsId = (param) => {
  return axios.post(`/api/v1/networks/network-semmery-for-assets`, param);
};

const networkServices = {
  getAllNetworkStatByUserId,
  getNetworkGraphByUserId,
  deleteNetworksCollection,
  getNetworkStatByAssetsId,
};

export default networkServices;
