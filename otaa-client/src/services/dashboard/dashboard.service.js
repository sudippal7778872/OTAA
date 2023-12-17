import axios from "axios";
axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;

// get all assets by user id
const getAssetsForDashboard = (userId, pagesize, pagenumber) => {
  console.log("page size and number", pagesize, pagenumber);
  return axios.post(`api/v1/assets/asset-summery`, {
    pagenumber,
    pagesize,
    userId,
  });
};

// get all vulnerability by user id
const getAllVulnerabilityByUserId = (userId, pagesize, pagenumber) => {
  console.log("page size and number", pagesize, pagenumber);
  return axios.post(`api/v1/assets/vulnerability-summery`, {
    pagenumber,
    pagesize,
    userId,
  });
};

const DashboardService = {
  getAssetsForDashboard,
  getAllVulnerabilityByUserId,
};

export default DashboardService;
