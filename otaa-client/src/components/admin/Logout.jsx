import React, { useEffect, useContext } from "react";
import { RoleContext, UserContext } from "../../App";
import { useNavigate } from "react-router-dom";
import { Button, Divider } from "@mui/material";
import { useCookies } from "react-cookie";
import LogoutIcon from "@mui/icons-material/Logout";
import MUISnackbar from "../common/snackbar/Snackbar";
import LogoutSuccess from "../../../src/img/green check.png";

const Logout = () => {
  const [cookies, setCookie, removeCookie] = useCookies([]);
  const [open, setOpen] = React.useState(true);
  const [alertMsg, setAlertMsg] = React.useState("Logout Successfully");
  const [severity, setSeverity] = React.useState("success");
  let navigate = useNavigate();

  useEffect(() => {
    localStorage.clear();
    setCookie("loggedin", false, { path: "/" });
    removeCookie("UserObj");
    removeCookie("auth");

    setTimeout(() => {
      window.location.reload();
    }, 500);
  }, []);

  const handleLogin = () => {
    navigate("/login");
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div
        style={{
          textAlign: "center",
          lineHeight: 8,
          background: "#E6E6FA",
          fontFamily: "Garamond, serif",
        }}
      >
        <MUISnackbar
          open={open}
          handleClose={handleClose}
          alertMsg={alertMsg}
          severity={severity}
          autoHideDuration={6000}
        />
        <img
          src={LogoutSuccess}
          height="60px"
          width="60px"
          style={{ background: "#E6E6FA", borderRadius: "50%" }}
        />
        <h2>
          <b>Thank you!</b>
        </h2>
        <h1>
          <LogoutIcon></LogoutIcon>
        </h1>
        <h5>
          <b>Thank you for using Our Portal. Visit again!</b>
        </h5>
        <Divider />
        <Button
          variant="contained"
          sx={{ background: "#6E25A4" }}
          onClick={handleLogin}
        >
          Login
        </Button>
      </div>
    </>
  );
};

export default Logout;
