import axios from "axios";
axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;

const validateLogin = (login) => {
  return axios.post("/api/v1/users/login", login);
};

const LoginService = {
  validateLogin,
};
export default LoginService;
