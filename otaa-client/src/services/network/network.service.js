import axios from "axios";
axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;

//will add limit later
const getAllNetworkStatByUserId = () => {
  return axios.get(`/api/v1/networks`);
};

const networkServices = {
  getAllNetworkStatByUserId,
};

export default networkServices;
