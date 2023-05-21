import React from "react";
import {
  Stack,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Paper,
  Divider,
  Typography,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { Card, CardHeader, CardContent } from "@mui/material";
import { useEffect } from "react";
import UserService from "../../services/user/user.service";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import MUISnackbar from "../common/snackbar/Snackbar";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import { Cookies } from "react-cookie";
import SessionExpireSnackbar from "../common/snackbar/SessionExpireSnackbar";

const User = () => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [alertMsg, setAlertMsg] = React.useState(null);
  const [severity, setSeverity] = React.useState(null);
  const [userData, setUserData] = React.useState([]);
  const [openExpire, setOpenExpire] = React.useState(false);
  const cookiesData = new Cookies();

  // role
  const userdata = cookiesData.get("UserObj");

  let CreateOnly = false;
  let ReadOnly = false;
  let ViewOnly = false;
  let EditOnly = false;
  let DeleteOnly = false;
  let entity = userdata?.userData?.entity;

  if (entity) {
    entity?.forEach((item) => {
      if (item.Name === "Manage User") {
        if (item.CreateOnly === 1) {
          CreateOnly = true;
        }
        if (item.ReadOnly === 1) {
          ReadOnly = true;
        }
        if (item.ViewOnly === 1) {
          ViewOnly = true;
        }
        if (item.EditOnly === 1) {
          EditOnly = true;
        }
        if (item.DeleteOnly === 1) {
          DeleteOnly = true;
        }
        console.log(CreateOnly);
      }
    });
  }

  const renderActionButton = (params) => {
    return (
      <Stack direction="row" spacing={3} marginLeft="5%">
        {EditOnly ? (
          <>
            <EditIcon
              // style={{ marginLeft: 20, color: "#006975" }}
              type="button"
              color="primary"
              onClick={() => {
                navigate(`/user/edituser/${params.row.UserPID}`);
              }}
            />
          </>
        ) : (
          <></>
        )}
        {DeleteOnly ? (
          <>
            <DeleteIcon
              // style={{ marginLeft: 20, color: "#006975" }}
              type="button"
              color="error"
              onClick={() => {
                if (
                  window.confirm("are you sure want to delete this record?")
                ) {
                  UserService.deleteUser(params.row.UserPID)
                    .then((res) => {
                      setAlertMsg("User Successfully Deleted");
                      setSeverity("success");
                      setOpen(true);
                      setTimeout(() => {
                        setUserData(res.data);
                        getUser();
                      }, 2000);
                    })
                    .catch((err) => {
                      console.log("error occured in deletion of user", err);
                      setAlertMsg("Failed to Delete The User");
                      setSeverity("error");
                      setOpen(true);
                    });
                }
              }}
            />
          </>
        ) : (
          <></>
        )}
      </Stack>
    );
  };

  const columns = [
    {
      field: "UserPID",
      headerName: "Action",
      width: 150,
      renderCell: renderActionButton,
      disableClickEventBubbling: true,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "UserName",
      headerName: "UserName",
      width: 150,
      disableClickEventBubbling: true,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "FullName",
      headerName: "FullName",
      width: 200,
      disableClickEventBubbling: true,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "Email",
      headerName: "Email",
      width: 270,
      disableClickEventBubbling: true,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "Organization",
      headerName: "Organization",
      width: 250,
      disableClickEventBubbling: true,
      disableColumnMenu: true,
      sortable: false,
    },
    // {
    //   field: "IsAdmin",
    //   headerName: "IsAdmin",
    //   width: 100,
    //   disableClickEventBubbling: true,
    //   disableColumnMenu: true,
    //   sortable: false,
    // },
  ];

  const getUser = () => {
    UserService.getAllUser()
      .then((res) => {
        console.log("response", res.data);
        setUserData(res.data);
      })
      .catch((err) => {
        console.log("error occured in getAllUser api", err);
        console.log("came here", err.response);
        if (err.response.status === 403 || err.response.status === 401) {
          // console.log("came here", err.response.status);
          setOpenExpire(true);
          setTimeout(() => {
            // navigate("/logout");
          }, 2000);
        }
      });
  };

  useEffect(() => {
    getUser();
  }, []);

  const handleAdd = () => {
    navigate("/signup");
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCloseExpire = () => {
    setOpenExpire(false);
  };

  return (
    <>
      <SessionExpireSnackbar
        open={openExpire}
        handleClose={handleCloseExpire}
      />
      <MUISnackbar
        open={open}
        handleClose={handleClose}
        alertMsg={alertMsg}
        severity={severity}
      />
      <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
        Manage User
      </Typography>
      <Divider />
      <br />
      <Stack direction={"row"} spacing={3}>
        {CreateOnly ? (
          <>
            <Button
              size="small"
              variant="contained"
              onClick={handleAdd}
              style={{
                backgroundColor: "#5F249F",
                // font: "Bold",
                color: "white",
                // justfyContent: "left",
                // display: "flex"
              }}
            >
              Add &nbsp;
              <PersonAddIcon />
            </Button>
          </>
        ) : (
          <></>
        )}
      </Stack>
      <div
        // style={{ float: "right" }}
        style={{ marginBottom: 6 }}
        className="row"
      ></div>
      <Paper
        sx={{
          height: 500,
          // width: "75%",
        }}
        style={{ margin: "0 auto" }}
        elevation={3}
      >
        <DataGrid
          getRowId={(r) => r.UserPID}
          rows={userData}
          columns={columns}
        />
        <br />
        <br />
      </Paper>
    </>
  );
};

export default User;
