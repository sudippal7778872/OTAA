import axios from "axios";
axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;

const getAssetsForDashboard = (userId, pagesize, pagenumber) => {
  console.log("page size and number", pagesize, pagenumber);
  return axios.post(`api/v1/assets/dashboard`, {
    pagenumber,
    pagesize,
    userId,
  });
};

const DashboardService = {
  getAssetsForDashboard,
};

export default DashboardService;
