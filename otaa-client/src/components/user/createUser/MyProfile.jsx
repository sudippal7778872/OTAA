import React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Typography from "@mui/material/Typography";
import { makeStyles } from "@mui/material/styles";
import Container from "@mui/material/Container";
// import authentication from "../../Service/AuthService/authentication.service";
import { useNavigate } from "react-router-dom";
import { useState, useContext } from "react";
import Card from "@mui/material/Card";
import { UserContext, RoleContext } from "../../../App";
//import "./SignIn.css";
import CircularProgress from "@mui/material/CircularProgress";
// import RoleService from "../../Service/AuthService/RoleService";
import UserService from "../../../services/user/user.service";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";

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
const MyProfile = () => {
  //const classes = useStyles();
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
        <Card  variant="outlined">
          <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div >
              <Avatar >
                <AccountCircleIcon />
              </Avatar>
              <Typography component="h1" variant="h5">
                My Profile
              </Typography>
              <form  noValidate>
                <TextField
                  variant="outlined"
                  margin="normal"
                  //required
                  fullWidth
                  id="UserName"
                  label="User Name"
                  name="UserName"
                  value={user.UserName}
                  onChange={changeUserInfo}
                  // autoComplete="UserName"
                  autoFocus
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  //required
                  fullWidth
                  id="FullName"
                  label="Full Name"
                  name="FullName"
                  value={user.FullName}
                  onChange={changeUserInfo}
                  // autoComplete="FullName"
                  autoFocus
                />
                <TextField
                  variant="outlined"
                  margin="normal"
                  //required
                  fullWidth
                  id="Email"
                  label="Email ID"
                  name="Email"
                  value={user.Email}
                  onChange={changeUserInfo}
                  // autoComplete="Email"
                  autoFocus
                />
                <br />
                <br />
                <Button
                  type="button"
                  fullWidth
                  variant="contained"
                  color="primary"
                  // className={classes.submit}
                >
                  Update Profile &nbsp;&nbsp;&nbsp;
                  {loading ? (
                    <CircularProgress color="secondary" size={18} />
                  ) : null}
                </Button>
              </form>
            </div>
          </Container>
        </Card>
      </div>
    </>
  );
};

export default MyProfile;