import { Cookies } from "react-cookie";
const cookiesData = new Cookies();
const accessToken = cookiesData.get("auth");

function authHeader() {
  if (accessToken) {
    return { "x-access-token": accessToken };
  } else {
    return {};
  }
}

export default authHeader;
