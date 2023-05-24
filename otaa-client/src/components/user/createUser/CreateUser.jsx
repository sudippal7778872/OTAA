import React from "react";
import { useState, useEffect, useContext } from "react";
import { Button } from "@mui/material/";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import createUserService from "../../../services/createUser.service";
import MUISnackbar from "../../common/snackbar/Snackbar";
import { useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Avatar from "@mui/material/Avatar";
import { pink } from "@mui/material/colors";
import Link from "@mui/material/Link";
import { useCookies } from "react-cookie";
import { UserContext } from "../../../App";

const CreateUser = () => {
  const navigate = useNavigate();
  const [userDetailsCookie, setUserDetailsCookie] = useCookies([
    "UserObj",
    "loggedin",
    "token",
  ]);
  const [openModal, setOpenModal] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [alertMsg, setAlertMsg] = React.useState(null);
  const [severity, setSeverity] = React.useState(null);
  const [initialState, setInitialState] = React.useState({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { login, dispatchLogin } = useContext(UserContext);

  const validationSchema = Yup.object().shape({
    firstname: Yup.string().required(`First Name cant be Blank`),
    lastname: Yup.string().required(`Last Name is Required`),
    email: Yup.string().email().required(`Email is Required`),
    password: Yup.string().required(`Password is Required`),
    confirmPassword: Yup.string().required(`Please confirm your password`),
  });

  const handleClose = () => {
    setOpenModal(false);
  };
  const handleCloseSnackbar = () => {
    setOpen(false);
  };

  const onSubmit = (values, action) => {
    console.log("form submitted", values);
    createUserService
      .CreateUser(values)
      .then((res) => {
        console.log("response is ", res.data);
        setUserDetailsCookie("UserObj", res.data.data, { path: "/" });
        setUserDetailsCookie("token", res.data.token, { path: "/" });
        setUserDetailsCookie("loggedin", true, { path: "/" });
        dispatchLogin({ type: "LOGIN", payload: true });
        setAlertMsg("User registered successfully");
        setSeverity("success");
        setOpen(true);
        setTimeout(() => {
          handleClose();
          // navigate("/");
        }, 3000);
      })
      .catch((err) => {
        console.log("error occured in CreateUser", err.message);
        setAlertMsg(err.message);
        setSeverity("error");
        setOpen(true);
        setTimeout(() => {
          handleClose();
        }, 3000);
      });
  };

  return (
    <>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <MUISnackbar
          open={open}
          handleClose={handleCloseSnackbar}
          alertMsg={alertMsg}
          severity={severity}
          xposition="center"
          yposition="top"
        />
        <div>
          <Paper elevation={3} className="p-4">
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
              Register User
            </Typography>
            <br />
            <Formik
              initialValues={initialState}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
              enableReinitialize
            >
              {(props) => (
                <Form>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Field
                        as={TextField}
                        name="firstname"
                        placeholder="Enter First Name"
                        value={props.values.firstname}
                        error={
                          props.touched.firstname && props.errors.firstname
                        }
                        label="First Name"
                        size="small"
                        fullWidth
                      />
                      <div style={{ color: "red" }}>
                        <ErrorMessage name="firstname" />
                      </div>
                    </Grid>

                    <Grid item sx={12} style={{ width: "100%" }}>
                      <Field
                        as={TextField}
                        name="lastname"
                        placeholder="Enter Last Name"
                        value={props.values.lastname}
                        error={props.errors.lastname && props.touched.lastname}
                        label="Last Name"
                        size="small"
                        fullWidth
                      />
                      <div style={{ color: "red" }}>
                        <ErrorMessage name="lastname" />
                      </div>
                    </Grid>

                    <Grid item sx={12} style={{ width: "100%" }}>
                      <Field
                        as={TextField}
                        name="email"
                        placeholder="Enter Email"
                        value={props.values.email}
                        error={props.errors.email && props.touched.email}
                        label="Email"
                        size="small"
                        fullWidth
                      />
                      <div style={{ color: "red" }}>
                        <ErrorMessage name="email" />
                      </div>
                    </Grid>
                    <Grid item sx={12} style={{ width: "100%" }}>
                      <Field
                        as={TextField}
                        type="password"
                        name="password"
                        placeholder="Enter Password"
                        value={props.values.password}
                        error={props.errors.password && props.touched.password}
                        label="Password"
                        size="small"
                        fullWidth
                      />
                      <div style={{ color: "red" }}>
                        <ErrorMessage name="password" />
                      </div>
                    </Grid>
                    <Grid item sx={12} style={{ width: "100%" }}>
                      <Field
                        as={TextField}
                        type="password"
                        name="confirmPassword"
                        placeholder="Re-type Password"
                        value={props.values.confirmPassword}
                        error={
                          props.errors.confirmPassword &&
                          props.touched.confirmPassword
                        }
                        label="Confirm Password"
                        size="small"
                        fullWidth
                      />
                      <div style={{ color: "red" }}>
                        <ErrorMessage name="confirmPassword" />
                      </div>
                    </Grid>

                    <Grid xs={12} style={{ marginTop: "20px" }}>
                      <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        size="small"
                        style={{ marginLeft: "7px" }}
                        // disabled={}
                      >
                        Register
                      </Button>
                    </Grid>
                  </Grid>
                </Form>
              )}
            </Formik>
            <Link href="/login" variant="body2" style={{ marginTop: "20px" }}>
              Already have an account?
            </Link>
          </Paper>
        </div>
      </Container>
    </>
  );
};

export default CreateUser;
