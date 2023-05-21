import axios from "axios";
axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;

// import authHeader from "../../Utils/auth-header"
// const appConfiguration.MasterApi = "http://localhost:7000/";
// import appConfiguration from "../../Config/Config";

// axios.interceptors.request.use(
//   function (config) {
//     // Do something before request is sent
//     return config;
//   },
//   function (error) {
//     // Do something with request error
//     return Promise.reject(error);
//   }
// );

const RegesterUser = (
  FullName,
  UserName,
  Email,
  Active,
  Organization,
  TeamPID,
  roles
) => {
  return axios.post("/api/signup", {
    FullName,
    UserName,
    Email,
    Active,
    Organization,
    TeamPID,
    roles,
  });
};

const ChangePassword = (UserName, Password) => {
  return axios.post("/api/users/changepassword", { UserName, Password });
};

const forgotchangepassword = (PasswordResetKey, Password) => {
  return axios.post("/api/users/forgotchangepassword", {
    PasswordResetKey,
    Password,
  });
};

const AuthService = {
  RegesterUser,
  ChangePassword,
  forgotchangepassword,
};

export default AuthService;
