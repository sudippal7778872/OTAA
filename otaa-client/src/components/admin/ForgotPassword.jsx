import React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
// import { makeStyles } from "@mui/material/styles";
import Container from "@mui/material/Container";
// import authentication from "../../Service/AuthService/authentication.service";
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import Paper from "@mui/material/Paper";
import { UserContext, RoleContext } from "../../App";
import CircularProgress from "@mui/material/CircularProgress";
// import RoleService from "../../Service/AuthService/RoleService";
import E_D_service from "../../services/common/encrypt_dycript_service/encrypt_decrypt_service";
import UserService from "../../services/user/user.service";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { pink } from "@mui/material/colors";

// const useStyles = makeStyles((theme) => ({
//   paper: {
//     marginTop: theme.spacing(8),
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
//     maxWidth: 500,
//     minHeight: 500,
//     // marginLeft: 300
//   },
// }));
const ForgotPassword = () => {
  // const classes = useStyles();
  let navigate = useNavigate();
  const [user, setUserData] = useState({ UserName: "" });
  //   const {state, dispatch} = useContext(UserContext);
  //   const {admin, dispatchAdmin} = useContext(RoleContext);
  const [error, setError] = useState({ UserName: "" });
  const [loading, setLoading] = React.useState(false);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  function changeUserInfo(e) {
    setUserData({ ...user, [e.target.name]: e.target.value });
  }

  const NormalEncrypt = (id) => {
    return E_D_service.encrypt(id);
  };

  const login = () => {
    setError({ UserName: "" });

    if (user.UserName === "") {
      setError({ error, UserName: "User Name is required" });
    } else {
      setLoading(true);
      UserService.Get_User_By_UserName(user.UserName)
        .then((res) => {
          if (res.data.UserPID > 0) {
            //history.push('/ResetPassword/'+NormalEncrypt(user.UserName));
            //alert('Password reset successfully. Please check your email for new password.');
            setOpenSnackbar(true);
            setTimeout(function () {
              navigate("/resetpassword/");
            }, 1500);
            setLoading(false);
          } else {
            setError({ error, UserName: "No account found." });
            setLoading(false);
          }
        })
        .catch((error) => {
          setError({ error, Password: "User Name or Password is invalid" });
          setLoading(false);
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
        message="Secret key is sent successfully to reset your password. Please check your email."
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
      <div className="signin">
        <Paper variant="outlined" style={{ textAlign: "center" }}>
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div>
              <Avatar
                sx={{ marginLeft: "41%", marginTop: 2, bgcolor: pink[500] }}
              >
                <LockOutlinedIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                Find your account
              </Typography>
              Enter your username or email
              <form noValidate>
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="UserName"
                  label="User Name or email"
                  name="UserName"
                  value={user.UserName}
                  onChange={changeUserInfo}
                  // autoComplete="UserName"
                  autoFocus
                />
                <div className="text-danger">{error.UserName}</div>
                <br />
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  color="primary"
                  // className={classes.submit}
                  onClick={login}
                >
                  Next &nbsp;&nbsp;&nbsp;
                  {loading ? (
                    <CircularProgress color="secondary" size={18} />
                  ) : null}
                </Button>
                <br />
                <br />
              </form>
            </div>
          </Container>
        </Paper>
      </div>
    </>
  );
};

export default ForgotPassword;
