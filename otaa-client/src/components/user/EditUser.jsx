import React from "react";
import {
  Paper,
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Stack,
  FormControl,
  TextField,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  Grid,
  OutlinedInput,
  Container,
  CssBaseline,
} from "@mui/material/";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import MUISnackbar from "../common/snackbar/Snackbar";
import UserService from "../../services/user/user.service";
import createUserService from "../../services/createUser.service";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
// import RoleService from "../../services/role.service";

// role style
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const EditUser = () => {
  // const [userData, setUserData] = useState({});
  const [open, setOpen] = React.useState(false);
  const [alertMsg, setAlertMsg] = React.useState("");
  const [severity, setSeverity] = React.useState("");
  const [organisation, setOrganisation] = useState([]);
  const [userRole, setUserRole] = React.useState([]);
  const [roleValue, setRoleValue] = React.useState([]);
  const [previousRole, setPreviousRole] = React.useState();
  const [User, SetUser] = useState({
    FullName: "",
    Email: "",
    Organization: "",
    // IsAdmin: false,
  });

  const navigate = useNavigate();
  const UPID = useParams();
  const UserPID = +UPID.id;

  const validationSchema = Yup.object().shape({
    FullName: Yup.string().required("FullName is Required"),
    Email: Yup.string()
      .required("Email is Required")
      .email("Not a valid email."),
    Organization: Yup.string().required("Organization is Required"),
  });

  const handleInputChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    SetUser({ ...User, [name]: value });
    // if (name === "IsAdmin") {
    //   const check = event.target.checked;
    //   SetUser({ ...User, [name]: check });
    // } else {
    //   SetUser({ ...User, [name]: value });
    // }
  };

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setRoleValue(typeof value === "string" ? value.split(",") : value);
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
        // console.log("reponse is", res.data[0]);
        SetUser(res.data[0]);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  // const getRoleData = () => {
  //   RoleService.getUserRoleByUserPID(UserPID)
  //     .then((res) => {
  //       const _role = res.data?.map((item) => {
  //         return item.RolePID;
  //       });
  //       setRoleValue(_role);
  //     })
  //     .catch((err) => {
  //       console.log("error occured in getRoleData", err);
  //     });
  // };

  const getOrganisation = () => {
    createUserService
      .Get_All_Organisation()
      .then((res) => {
        setOrganisation(res.data);
      })
      .catch((err) => {
        console.log("error occured in hop type dropdown", err);
      });
  };

  const getRole = () => {
    createUserService
      .getAllRole()
      .then((res) => {
        setUserRole(res.data);
      })
      .catch((err) => {
        console.log("error occure in role api", err);
      });
  };

  const getSelectedRole = (selectedRole) => {
    var _role = [];
    selectedRole.map((value) => {
      const item = userRole.find((_roles) => _roles.RolePID == value);
      if (item !== undefined) {
        _role.push(item.Name);
      }
    });

    return _role.join(",");
  };

  useEffect(() => {
    getOrganisation();
    getRole();
    getUserData();
    // getRoleData();
  }, []);

  // const onSubmit = () => {
  //   console.log("after update value", User);
  //   console.log("role is", roleValue);
  //   UserService.updateUserById(UserPID, User)
  //     .then((res) => {
  //       const userRoleObj = [];
  //       roleValue.map((item) => {
  //         const obj = {
  //           RolePID: item,
  //           UserPID: UserPID,
  //         };
  //         userRoleObj.push(obj);
  //       });
  //       RoleService.updateUserRoleByUserPID(UserPID, userRoleObj)
  //         .then((res) => {
  //           window.alert("user updated successfully");
  //           setAlertMsg("User updated successfully");
  //           setSeverity("success");
  //           setOpen(true);
  //           setTimeout(() => {
  //             navigate("/user");
  //           }, 3000);
  //         })
  //         .catch((err) => {
  //           console.log("error occured in update UserRole", err);
  //           setAlertMsg("Failed To update UserRole");
  //           setSeverity("error");
  //           setOpen(true);
  //         });
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //       setAlertMsg("Failed to Update The User");
  //       setSeverity("error");
  //       setOpen(true);
  //     });
  // };

  return (
    <>
      {User ? (
        <>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <MUISnackbar
              open={open}
              handleClose={handleClose}
              alertMsg={alertMsg}
              severity={severity}
            />
            <div>
              <Paper elevation={3} className="p-4">
                {/* <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>           */}
                <Typography component="h1" variant="h5" align="center">
                  Update User
                </Typography>
                <form noValidate>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        margin="dense"
                        required
                        fullWidth
                        id="FullName"
                        label="Full Name"
                        name="FullName"
                        value={User.FullName}
                        autoComplete="FullName"
                        size="small"
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        margin="dense"
                        required
                        fullWidth
                        id="Email"
                        type="email"
                        value={User.Email}
                        label="DXC Global Email"
                        name="Email"
                        autoComplete="Email"
                        size="small"
                        onChange={handleInputChange}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <InputLabel shrink id="organisationSelect">
                        Organisation
                      </InputLabel>
                      <Select
                        variant="outlined"
                        margin="dense"
                        fullWidth
                        labelId="organisationSelect"
                        color="secondary"
                        name="Organization"
                        size="small"
                        value={User.Organization}
                        onChange={handleInputChange}
                      >
                        {organisation?.map((item, index) => (
                          <MenuItem
                            color="secondary"
                            key={index}
                            value={item.Name}
                          >
                            {item.Name}
                          </MenuItem>
                        ))}
                      </Select>
                    </Grid>
                    <Grid item xs={12}>
                      <FormControl sx={{ width: "100%" }}>
                        <InputLabel id="demo-multiple-checkbox-label">
                          Role
                        </InputLabel>
                        <Select
                          labelId="demo-multiple-checkbox-label"
                          id="demo-multiple-checkbox"
                          multiple
                          size="small"
                          value={roleValue}
                          onChange={handleChange}
                          input={<OutlinedInput label="Role" />}
                          // renderValue={(selected) => selected.join(", ")}
                          renderValue={getSelectedRole}
                          MenuProps={MenuProps}
                        >
                          {userRole.map((item, index) => (
                            <MenuItem key={item.RolePID} value={item.RolePID}>
                              <Checkbox
                                checked={roleValue.indexOf(item.RolePID) > -1}
                              />
                              <ListItemText primary={item.Name} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                    {/*<Grid item xs={12}>
                <Switch
                  // checked={checked}
                  onChange={handleInputChange}
                  inputProps={{ "aria-label": "controlled" }}
                  name="IsAdmin"
                  size="small"
                  id="l"
                />
                <label htmlFor="l">Admin</label>
                  </Grid>*/}
                  </Grid>
                  <br />
                  <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    color="primary"
                    size="small"
                    // className={classes.submit}
                    // onClick={onSubmit}
                    disabled={
                      (User.FullName && User.Email && User.Organization) === ""
                        ? true
                        : false
                    }
                  >
                    Update
                  </Button>
                </form>
              </Paper>
            </div>
          </Container>
        </>
      ) : (
        <>Loading...</>
      )}
    </>
  );
};

export default EditUser;
