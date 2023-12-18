import { Cookies } from "react-cookie";

//userId
const cookiesData = new Cookies();
const userData = cookiesData.get("UserObj");

export default userData;
