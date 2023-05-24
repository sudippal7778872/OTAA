import React, { useState, useContext, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Stack from "@mui/material/Stack";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { UserContext } from "../../../App";
import { useNavigate, useLocation } from "react-router-dom";
import "./Login.css";
import { useCookies } from "react-cookie";
import MUISnackbar from "../../common/snackbar/Snackbar";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { pink } from "@mui/material/colors";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import LoginService from "../../../services/login.service";

const Login = () => {
  let navigate = useNavigate();
  const location = useLocation();
  const [initialState, setInitialState] = React.useState({
    email: "",
    password: "",
  });
  const [open, setOpen] = React.useState(false);
  const [alertMsg, setAlertMsg] = React.useState(null);
  const [severity, setSeverity] = React.useState(null);
  // const [showPassword, setShowPassword] = useState(false);
  const [userDetailsCookie, setUserDetailsCookie] = useCookies([
    "UserObj",
    "loggedin",
    "auth",
  ]);
  const { login, dispatchLogin } = useContext(UserContext);

  const validationSchema = Yup.object().shape({
    email: Yup.string().email().required("Email is requires"),
    password: Yup.string().required("password is required"),
  });

  const handleClose = () => {
    setOpen(false);
  };

  const onSubmit = (values, action) => {
    console.log("form submitted", values);
    LoginService.validateLogin(values)
      .then((res) => {
        setUserDetailsCookie("UserObj", res.data.data, { path: "/" });
        setUserDetailsCookie("auth", res.data.token, { path: "/" });
        setUserDetailsCookie("loggedin", true, { path: "/" });
        dispatchLogin({ type: "LOGIN", payload: true });
        setAlertMsg("Login Successfully");
        setSeverity("success");
        setOpen(true);

        setTimeout(() => {
          if (location.state == null) {
            navigate("/home");
          } else if (location.state.previousURL === "/logout") {
            navigate("/home");
          } else {
            navigate(location.state.previousURL);
          }
        }, 500);
      })

      .catch((err) => {
        if (
          err.response.data.message === "User not Exists" ||
          err.response.status === 401
        ) {
          setAlertMsg("User Does not exists");
          setSeverity("error");
          setOpen(true);
        } else if (
          err.response.data.message === "Incorrect email or password" ||
          err.response.status === 401
        ) {
          setAlertMsg("Invalid user name or password!");
          setSeverity("error");
          setOpen(true);
        } else {
          setAlertMsg("Unknown Error Occured");
          setSeverity("error");
          setOpen(true);
        }
      });
  };

  return (
    <>
      <MUISnackbar
        open={open}
        handleClose={handleClose}
        alertMsg={alertMsg}
        severity={severity}
        xposition="center"
        yposition="top"
      />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Card raised sx={{ maxWidth: 350, p: 2 }}>
          <CardContent>
            <div style={{ justifyContent: "center", display: "flex" }}>
              <Avatar sx={{ bgcolor: pink[500] }}>
                <LockOutlinedIcon />
              </Avatar>
            </div>
            <Typography
              component="h1"
              variant="h5"
              sx={{ textAlign: "center" }}
            >
              Sign in
            </Typography>
            <br />
            <Stack
              spacing={2}
              sx={{
                textAlign: "center",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Formik
                initialValues={initialState}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                {(props) => (
                  <Form>
                    <Grid container spacing={2}>
                      <Grid item style={{ width: "100%" }}>
                        <Field
                          as={TextField}
                          type="email"
                          name="email"
                          value={props.values.email}
                          error={props.errors.email && props.touched.email}
                          placeholder="Enter Your Email"
                          label="Email"
                          size="small"
                          fullWidth
                        />
                        <div style={{ color: "red" }}>
                          <ErrorMessage name="email" />
                        </div>
                      </Grid>
                      <Grid item style={{ width: "100%" }}>
                        <Field
                          as={TextField}
                          type="password"
                          name="password"
                          placeholder="Enter Password"
                          value={props.values.password}
                          error={
                            props.errors.password && props.touched.password
                          }
                          label="Password"
                          size="small"
                          fullWidth
                        />
                        <div style={{ color: "red" }}>
                          <ErrorMessage name="password" />
                        </div>
                      </Grid>
                      <Grid item style={{ width: "100%" }}>
                        <Button
                          type="submit"
                          fullWidth
                          variant="contained"
                          size="small"
                        >
                          Sign In
                        </Button>
                      </Grid>
                    </Grid>
                  </Form>
                )}
              </Formik>
            </Stack>
            <Link href="/ForgotPassword" variant="body2">
              Forgot password?
            </Link>
            <br />
            <Link href="/signin" variant="body2">
              Don't have account?
            </Link>
          </CardContent>
        </Card>
      </div>
    </>
  );
};
export default Login;
