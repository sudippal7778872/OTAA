import React from "react";
import TextField from "@mui/material/TextField";
// import { makeStyles } from '@mui/material/styles';
import Button from "@mui/material/Button";
import { useState, useEffect, useContext } from "react";
import AuthService from "../../services/authservice/AuthService";
// import authenticationService from '../../Service/AuthService/authentication.service'
import { useNavigate } from "react-router-dom";
// import { UserContext } from '../../../App';
import { Card, CardContent } from "@mui/material";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import Avatar from "@mui/material/Avatar";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { useParams } from "react-router-dom";
import E_D_service from "../../services/common/encrypt_dycript_service/encrypt_decrypt_service";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { pink } from "@mui/material/colors";
import Stack from "@mui/material/Stack";

// const useStyles = makeStyles((theme) => ({
//     paper: {
//       marginTop: theme.spacing(8),
//       display: 'flex',
//       flexDirection: 'column',
//       alignItems: 'center',
//     },
//     avatar: {
//       margin: theme.spacing(1),
//       backgroundColor: theme.palette.secondary.main,
//     },
//     form: {
//       width: '100%', // Fix IE 11 issue.
//       marginTop: theme.spacing(1),
//     },
//     submit: {
//       margin: theme.spacing(3, 0, 2),
//     },
//     root: {
//       minWidth: 275,
//       maxWidth: 500,
//       minHeight: 500,
//       // marginLeft: 300
//     },
//   }));
const ResetPassword = () => {
  // const classes = useStyles();
  const [userData, setUserDate] = useState({
    UserName: "",
    Password: "",
    ConfirmPassword: "",
    PasswordResetKey: ""
  });
  const [error, setError] = useState({
    Password: "",
    ConfirmPassword: "",
    PasswordResetKey: ""
  });
  let navigate = useNavigate();
  const { userName } = useParams();
  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  // const {state, dispatch} = useContext(UserContext);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  useEffect(() => {
    const decryptUserName = E_D_service.decrypt(userName);
    setUserDate({ ...userData, UserName: decryptUserName });
  }, []);

  function changeUserInfo(e) {
    setUserDate({ ...userData, [e.target.name]: e.target.value });
  }

  const handleSubmit = () => {
    setError({ Password: "", ConfirmPassword: "", PasswordResetKey: "" });

    if (userData.Password === "") {
      setError({ error, Password: "New Password is required" });
    } else if (userData.ConfirmPassword === "") {
      setError({ error, ConfirmPassword: "Confirm Password is required" });
    } else if (userData.PasswordResetKey === "") {
      setError({ error, PasswordResetKey: "Password Reset Key is required" });
    } else if (userData.Password !== userData.ConfirmPassword) {
      setError({ error, ConfirmPassword: "Passwords don't match" });
    } else {
      AuthService.forgotchangepassword(
        userData.PasswordResetKey,
        userData.Password
      )
        .then((res) => {
          if (res.data == 1) {
            // closeDialog();
            // authenticationService.logout();
            //history.push('/SignIn')
            //dispatch({type:"LOGIN", payload:false})
            setOpenSnackbar(true);
            setTimeout(function () {
              // history.replace('/ResetPassword')
              navigate("/resetpassword", { replace: true });
              navigate("/login");
            }, 1500);
          } else {
            setError({
              error,
              PasswordResetKey: "Password Reset Key is invalid."
            });
          }
        })
        .catch((e) => {
          setError({
            error,
            PasswordResetKey: "Password Reset Key is invalid."
          });
        });
    }
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{
          vertical: "top",
          horizontal: "center"
        }}
        open={openSnackbar}
        autoHideDuration={1000}
        onClose={handleCloseSnackbar}
        message="Password reset successful."
        action={
          <React.Fragment>
            {/* <Button color="secondary" size="small" onClick={handleClose}>
                    UNDO
                    </Button> */}
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleCloseSnackbar}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Card raised sx={{minWidth:450}}>
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
              Reset Password
            </Typography>
            <Stack
              spacing={2}
              // sx={{
              //   textAlign: "center",
              //   alignItems: "center",
              //   justifyContent: "center"
              // }}
            >
              <form>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="PasswordResetKey"
                  label="Password Reset Key"
                  type="PasswordResetKey"
                  id="PasswordResetKey"
                  value={userData.PasswordResetKey}
                  onChange={changeUserInfo}
                />
                <div className="text-danger">{error.PasswordResetKey}</div>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="Password"
                  label="New Password"
                  type="Password"
                  id="Password"
                  value={userData.Password}
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
                  value={userData.ConfirmPassword}
                  onChange={changeUserInfo}
                />
                <div className="text-danger">{error.ConfirmPassword}</div>
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  color="primary"
                  //className={classes.submit}
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </form>
            </Stack>
            {/* </div> */}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ResetPassword;
