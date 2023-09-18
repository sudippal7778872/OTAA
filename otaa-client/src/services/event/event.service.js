import axios from "axios";
axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;

const getEventsByUserId = (userId, pagesize, pagenumber) => {
  return axios.post(`api/v1/events`, { pagesize, pagenumber, userId });
};

const deleteAllEvents = () => {
  return axios.delete(`api/v1/events`);
};

const DashboardService = {
  getEventsByUserId,
  deleteAllEvents,
};

export default DashboardService;
