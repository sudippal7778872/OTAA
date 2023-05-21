import React from "react";
import {
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Stack,
  FormControl,
  TextField,
} from "@mui/material/";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import MUISnackbar from "../common/snackbar/Snackbar";
import UserService from "../../services/user/user.service";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Cookies, useCookies } from "react-cookie";

const EditProfile = () => {
  
  const [userData, setUserData] = useState("");
  const [open, setOpen] = React.useState(false);
  const [alertMsg, setAlertMsg] = React.useState(null);
  const [severity, setSeverity] = React.useState(null);
  const cookieProfile = new Cookies()
  const UPID = useParams();
  const UserPID = +UPID.id;
  const uData = cookieProfile.get("UserObj");
  const fullName = uData?.userData.user.FullName;
  const userName = uData?.userData.user.UserName;
  const email = uData?.userData.user.Email;
  const [user, setUser] = useState({
    FullName: fullName,
    Email: email,
  });

  const initialValues = user;

  const validationSchema = Yup.object().shape({
    FullName: Yup.string().required("FullName is Required"),
    Email: Yup.string()
      .required("Email is Required")
      .email("Not a valid email."),
  });

  const onSubmit = () => {
    UserService.updateUserById(UserPID, user)
      .then((res) => {
        setAlertMsg("User Successfully Updated");
        setSeverity("success");
        setOpen(true);
      })
      .catch((err) => {
        console.log(err);
        setAlertMsg("Failed to Update The User");
        setSeverity("error");
        setOpen(true);
      });
  };
  const handleReset = (resetForm) => {
    resetForm();
  };
  const handleClose = () => {
    setOpen(false);
  };

  const getUserData = () => {
    UserService.getUserByID(UserPID)
      .then((res) => {
        setUserData(res.data[0]);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  useEffect(() => {
    getUserData();
    getUserByIds();
  }, []);

  const getUserByIds = async () => {
    UserService.Get_User_By_UserName_for_Profile(userName)
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <>
      <MUISnackbar
        open={open}
        handleClose={handleClose}
        alertMsg={alertMsg}
        severity={severity}
      />
      {user ? (
        <>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: "5%",
            }}
          >
            <Card style={{ width: "50%" }} elevation={3}>
              <CardContent>
                <Typography
                  sx={{ fontSize: 24, fontWeight: "bold" }}
                  align="center"
                >
                  Edit Profile
                </Typography>
              </CardContent>
              <CardActions>
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                >
                  {(props) => (
                    <Form style={{ width: "100%" }}>
                      <div
                        style={
                          {
                          }
                        }
                      >
                        <Stack
                          spacing={3}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Stack
                            spacing={3}
                            fullWidth
                            style={{ width: "100%", marginLeft: "10%" }}
                          >
                            <Stack fullWidth style={{ width: "100%" }}>
                              <FormControl sx={{ width: "90%" }}>
                                <Field
                                  as={TextField}
                                  labelid="demo-simple-select-label"
                                  id="demo-simple-select"
                                  label="FullName"
                                  name="FullName"
                                  value={user.FullName}
                                  
                                ></Field>
                              </FormControl>
                              <div style={{ color: "red" }}>
                                <ErrorMessage name="FullName" />
                              </div>
                            </Stack>
                            <Stack style={{ width: "100%" }}>
                              <FormControl sx={{ width: "90%" }}>
                                <Field
                                  as={TextField}
                                  labelid="demo-simple-select"
                                  id="demo-simple-select"
                                  label="Email"
                                  name="Email"
                                  value={user.Email}
                                ></Field>
                              </FormControl>
                              <div style={{ color: "red" }}>
                                <ErrorMessage name="Email" />
                              </div>
                            </Stack>
                          </Stack>
                          <Stack
                            direction="row"
                            spacing={3}
                            style={{
                              marginTop: "40px",
                              marginBottom: "40px",
                              textAlign: "center",
                            }}
                          >
                            <Stack>
                              <Button
                                variant="contained"
                                color="success"
                                type="submit"
                              >
                                Update
                              </Button>
                            </Stack>
                            <Stack>
                              <Button
                                variant="contained"
                                color="error"
                                onClick={handleReset.bind(
                                  null,
                                  props.resetForm
                                )}
                                value={"Reset"}
                                type="button"
                              >
                                Clear
                              </Button>
                            </Stack>
                          </Stack>
                        </Stack>
                      </div>
                    </Form>
                  )}
                </Formik>
              </CardActions>
            </Card>
          </div>
        </>
      ) : (
        <>Loading...</>
      )}
    </>
  );
};

export default EditProfile;