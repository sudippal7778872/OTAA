import React from "react";
import TextField from "@mui/material/TextField";
// import { makeStyles } from "@mui/material/styles";
import Button from "@mui/material/Button";
import { useState, useEffect, useContext } from "react";
import AuthService from "../../services/authservice/AuthService";
// import authenticationService from "../../Services/AuthService/authentication.service";
// import { useHistory } from "react-router-dom";
// import { UserContext } from "../../../App";
import { useNavigate } from "react-router-dom";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Box, Paper, Stack, Typography } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import { pink } from "@mui/material/colors";
import { Cookies } from "react-cookie";

// const useStyles = makeStyles((theme) => ({
//   form: {
//     width: "100%", // Fix IE 11 issue.
//     marginTop: theme.spacing(1),
//   },
//   submit: {
//     margin: theme.spacing(3, 0, 2),
//   },
// }));

// const useStyles = makeStyles((theme) => ({
//   paper: {
//     marginTop: theme.spacing(4),
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//   },
//   avatar: {
//     margin: theme.spacing(1),
//     backgroundColor: theme.palette.secondary.main,
//   },
//   form: {
//     width: "100%", // Fix IE 11 issue.
//     marginTop: theme.spacing(1),
//   },
//   submit: {
//     margin: theme.spacing(3, 0, 2),
//   },
//   root: {
//     minWidth: 275,
//     maxWidth: 400,
//     minHeight: 450,
//     // marginLeft: 300
//   },
// }));

const ChangePassword = () => {
  //const classes = useStyles();
  const [userData, setUserData] = useState({
    UserName: "",
    Password: "",
    NewPassword: "",
    ConfirmPassword: "",
  });
  const [error, setError] = useState({ Password: "", ConfirmPassword: "" });
  const navigate = useNavigate();
  //   let history = useHistory();
  // const { state, dispatch } = useContext(UserContext);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  // const UserName = localStorage.getItem("UserName");
  //   const Password = localStorage.getItem("Password");
  const cookie = new Cookies();
  const userNameFromCookies = cookie.get("UserObj")?.userData.user.UserName;

  useEffect(() => {
    //setUserData({ ...userData, UserName: UserName });
  }, []);

  function changeUserInfo(e) {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  }

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  const handleSubmit = () => {
    setError({ Password: "", ConfirmPassword: "" });

    if (userData.Password === "") {
      setError({ error, Password: "New Password is required" });
    } else if (userData.ConfirmPassword === "") {
      setError({ error, ConfirmPassword: "Confirm Password is required" });
    } else if (userData.NewPassword !== userData.ConfirmPassword) {
      setError({ error, ConfirmPassword: "Passwords don't match" });
    } else {
      AuthService.ChangePassword(userNameFromCookies, userData.NewPassword)
        .then((res) => {
          setOpenSnackbar(true);
          //   closeDialog();
          //   authenticationService.logout();
          setTimeout(function () {
            navigate("/logout");
          }, 2000);
          // dispatch({ type: "LOGIN", payload: false });
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        open={openSnackbar}
        autoHideDuration={1000}
        onClose={handleCloseSnackbar}
        message="Password changed sucessfully."
        action={
          <React.Fragment>
            <IconButton
              size="small"
              aria-label="close"
              color="success"
              onClick={handleCloseSnackbar}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          "& > :not(style)": {
            m: 1,
            width: 400,
            height: 400,
          },
        }}
        className="signin"
        style={{ marginLeft: "33%", marginRight: "25%" }}
      >
        <Paper
          elevation={3}
          // className={classes.root} variant="outlined"
          style={{ textAlign: "center" }}
        >
          <Stack sx={{ p: 3 }}>
            <Stack>
              <Avatar
                sx={{ marginLeft: "41%", marginTop: 2, bgcolor: pink[500] }}
              >
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Change Password
              </Typography>
            </Stack>
            <form noValidate>
              <Stack
                spacing={1}
                // style={{
                //   width: "90%",
                //   display: "flex",
                //   justifyContent: "center"
                // }}
              >
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="Password"
                  label="Old Password"
                  type="Password"
                  id="Password"
                  size="small"
                  value={userData.Password}
                  onChange={changeUserInfo}
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="NewPassword"
                  label="New Password"
                  type="Password"
                  id="Password"
                  size="small"
                  value={userData.NewPassword}
                  onChange={changeUserInfo}
                />
                <div className="text-danger">{error.Password}</div>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="ConfirmPassword"
                  label="Confirm Password"
                  type="Password"
                  id="ConfirmPassword"
                  size="small"
                  value={userData.ConfirmPassword}
                  onChange={changeUserInfo}
                />
                <div className="text-danger">{error.ConfirmPassword}</div>
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  color="primary"
                  // className={classes.submit}
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </Stack>
            </form>
          </Stack>
        </Paper>
      </Box>
    </>
  );
};

export default ChangePassword;
