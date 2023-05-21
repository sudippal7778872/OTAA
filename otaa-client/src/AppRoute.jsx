import React, { useContext, lazy, Suspense, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import { RoleContext, UserContext } from "./App";
import { useCookies } from "react-cookie";
import { useNavigate, useLocation } from "react-router-dom";

const Home = lazy(() => import("./pages/home/Home"));

const Login = lazy(() => import("./components/admin/login/Login"));
const ForgotPassword = lazy(() => import("./components/admin/ForgotPassword"));

const Logincheck = lazy(() => import("./components/admin/Logincheck"));
const Logout = lazy(() => import("./components/admin/Logout"));
const CreateUser = lazy(() =>
  import("./components/user/createUser/CreateUser")
);
const ResetPassword = lazy(() => import("./components/admin/ResetPassword"));
// const MyProfile = lazy(() => import("./components/user/createUser/MyProfile"));
const Profile = lazy(() => import("./components/profile/Profile"));
const EditProfile = lazy(() => import("./components/profile/EditProfile"));
const ChangePassword = lazy(() => import("./components/admin/ChangePassword"));
const User = lazy(() => import("./components/user/User"));
const EditUser = lazy(() => import("./components/user/EditUser"));

function SecuredRoute({ children }) {
  //const { login, dispatchLogin } = useContext(UserContext);
  const [cookies, setCookie] = useCookies(["hop"]);
  const location = useLocation();

  if (cookies.loggedin === "true") {
    // console.log('cookies.loggedin',cookies.loggedin)
    // dispatchLogin({ type: "LOGIN", payload: true });
    return children;
  } else {
    //dispatchLogin({ type: "LOGIN", payload: false });
    console.log("location.pathname", location.pathname);
    return (
      <Navigate
        to={{ pathname: "/login" }}
        state={{ previousURL: location.pathname }}
      ></Navigate>
    );
    // navigate('/login')
  }
}

const AppRoute = () => {
  return (
    <div>
      <Suspense fallback={<h6>Loading...</h6>}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/logincheck" element={<Logincheck />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />

          <Route path="/signup" element={<CreateUser />} />
          <Route
            path="/resetpassword"
            element={
              <SecuredRoute>
                <ResetPassword />
              </SecuredRoute>
            }
          />
          <Route
            path="/logout"
            element={
              <SecuredRoute>
                <Logout />
              </SecuredRoute>
            }
          />
          <Route
            path="/changepassword"
            element={
              <SecuredRoute>
                <ChangePassword />
              </SecuredRoute>
            }
          />
          <Route
            path="/user"
            element={
              <SecuredRoute>
                <User />
              </SecuredRoute>
            }
          />
          <Route
            path="/user/edituser/:id"
            element={
              <SecuredRoute>
                <EditUser />
              </SecuredRoute>
            }
          />

          {/* <Route path="/src" element={<Src />} /> */}
          {/* <Route
            path="/myprofile"
            element={
              <SecuredRoute>
                <MyProfile />
              </SecuredRoute>
            }
          /> */}
          <Route
            path="/profile"
            element={
              <SecuredRoute>
                <Profile />
              </SecuredRoute>
            }
          />
          <Route
            path="/profile/edit/:id"
            element={
              <SecuredRoute>
                <EditProfile />
              </SecuredRoute>
            }
          />
        </Routes>
      </Suspense>
    </div>
  );
};

export default AppRoute;
