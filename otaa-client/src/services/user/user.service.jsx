import axios from "axios";
import authHeader from "../../Utils/auth-header";
axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;

const Get_User_By_UserName = (UserName) => {
  return axios.post(
    "/api/users/username",
    { UserName },
    { headers: authHeader() }
  );
};

const Get_User_By_UserName_for_Profile = (UserName) => {
  return axios.post(
    "/api/users/profile",
    { UserName },
    { headers: authHeader() }
  );
};

const getUserByID = (id) => {
  return axios.get(`/api/users/${id}`, { headers: authHeader() });
};

const getAllUser = () => {
  return axios.get(`/api/users`, { headers: authHeader() });
};
const deleteUser = (id) => {
  return axios.delete(`/api/users/${id}`, { headers: authHeader() });
};

const getUserById = (id) => {
  return axios.get(`/api/users/${id}`, { headers: authHeader() });
};

const updateUserById = (id, values) => {
  return axios.put(`/api/users/${id}`, { values }, { headers: authHeader() });
};

const UserService = {
  Get_User_By_UserName,
  Get_User_By_UserName_for_Profile,
  getUserByID,
  getAllUser,
  deleteUser,
  getUserById,
  updateUserById,
};

export default UserService;
