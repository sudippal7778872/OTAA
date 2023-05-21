import { Cookies } from "react-cookie";
const cookiesData = new Cookies();
const userData = cookiesData.get("UserObj");
const user = userData?.userData?.user;
const accessToken = user?.accessToken;
// console.log("this is auth header", user.accessToken);

function authHeader() {
  if (user && accessToken) {
    return { "x-access-token": user.accessToken };
  } else {
    return {};
  }
}

export default authHeader;
