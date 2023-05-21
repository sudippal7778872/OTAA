import React from "react";
import Paper from "@mui/material/Paper";
import { useState, useEffect } from "react";
import UserService from "../../services/user/user.service";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import CloseIcon from "@material-ui/icons/Close";
import ChangePassword from "../admin/ChangePassword";
import EditProfile from "./EditProfile";
import { Cookies, useCookies } from "react-cookie";

const Profile = () => {
  const [user, setUser] = useState();
  const [openUserEdit, setOpenUserEdit] = useState(false);
  const [openChangePassword, setOpenChangePassword] = useState(false);
  //const UserName = localStorage.getItem("UserName");
  const [cookies, setCookie] = useCookies(["hop"]);
  const cookieProfile = new Cookies()
  const uData = cookieProfile.get("UserObj");
  const fullName = uData?.userData.user.FullName;
  const userName = uData?.userData.user.UserName;
  const userPid = uData?.userData.user.UserPID;
  const email = uData?.userData.user.Email;


  useEffect(() => {
    getUserById();
  }, []);

  const getUserById = async () => {
    UserService.Get_User_By_UserName_for_Profile(userName)
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const OnEditClick = (row) => {
    setOpenUserEdit(true);
  };

  const handleUserEditClose = (value) => {
    setOpenUserEdit(false);
    getUserById();
  };

  const OnChangePasswordClick = (row) => {
    setOpenChangePassword(true);
  };

  const handleChangePasswordClose = (value) => {
    setOpenChangePassword(false);
  };

  return (
    <div>
      { userName ? (
        <div>
          <div
            style={{ background: "#5F249F" }}
            className="contactInformation p-3"
          >
            <strong style={{ color: "white" }} className="container">
            My Profile
            </strong>
            <button
              style={{ background: "#006975" }}
              className="btn btn-sm btn-edit btn-success mr-1"
              onClick={() => {
                OnEditClick(userPid);
              }}
            >
              Edit
            </button>
          </div>
          <Paper elevation={3}>
            <div className="p-3">
              <div className="row">
                <div className="col-7">
                  <table>
                    <tr>
                      <td><b>Full Name:  </b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
                      <td>{fullName}</td>
                    </tr>
                    <tr>
                      <td><b>Email:</b></td>
                      <td>{email}</td>
                    </tr>
                    <tr>
                      <td><b>User Name:</b></td>
                      <td>{userName}</td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>
          </Paper>
          <br />
        </div>
      ) : (
        <div>Loading...</div>
      )}
      {openUserEdit ? (
        <Dialog fullWidth
          maxWidth="sm"
          onClose={handleUserEditClose}
          aria-labelledby="customized-dialog-title"
          open={openUserEdit}
        >
          <DialogTitle
            id="customized-dialog-title"
            onClose={handleUserEditClose}
            color="primary"
          >
            Edit - Profile
            <CloseIcon className="btn-close" onClick={handleUserEditClose} />
          </DialogTitle>
          <DialogContent dividers>
            <EditProfile
              userPID={userPid}
              closeDialog={handleUserEditClose}
            ></EditProfile>
          </DialogContent>
        </Dialog>
      ) : null}
      {openChangePassword ? (
        <Dialog
          onClose={handleChangePasswordClose}
          aria-labelledby="customized-dialog-title"
          open={openChangePassword}
        >
          <DialogTitle
            id="customized-dialog-title"
            onClose={handleChangePasswordClose}
            color="primary"
          >
            Change Password
            <CloseIcon
              className="btn-close"
              onClick={handleChangePasswordClose}
            />
          </DialogTitle>
          <DialogContent dividers>
            <ChangePassword
              user={user}
              closeDialog={handleChangePasswordClose}
            ></ChangePassword>
          </DialogContent>
        </Dialog>
      ) : null}
    </div>
  );
};

export default Profile;
