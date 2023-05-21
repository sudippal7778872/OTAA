import axios from "axios";
import authHeader from "../Utils/auth-header";
axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;

const CreateUser = (user) => {
  return axios.post(`/api/v1/users/signup`, user, { headers: authHeader() });
};

const createUserService = {
  CreateUser,
};

export default createUserService;
