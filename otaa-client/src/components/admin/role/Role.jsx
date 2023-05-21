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
import RoleService from "../../../services/role.service";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
import DeleteIcon from "@mui/icons-material/Delete";
import MUISnackbar from "../../common/snackbar/Snackbar";
import AddModeratorIcon from "@mui/icons-material/AddModerator";
import { Cookies } from "react-cookie";
import SessionExpireSnackbar from "../../common/snackbar/SessionExpireSnackbar";

const Role = () => {
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [alertMsg, setAlertMsg] = React.useState(null);
  const [severity, setSeverity] = React.useState(null);
  const [roleData, setRoleData] = React.useState([]);
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
      if (item.Name === "Manage Role") {
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
      <Stack direction="row" spacing={3}>
        {EditOnly ? (
          <>
            <EditIcon
              // style={{ marginLeft: 20, color: "#006975" }}
              type="button"
              color="primary"
              onClick={() => {
                navigate(`/role/editrole/${params.row.RolePID}`);
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
                  RoleService.deleteEntityRole(params.row.RolePID)
                    .then((res) => {
                      RoleService.deleteRole(params.row.RolePID)
                        .then((res) => {
                          setAlertMsg("Role Successfully Deleted");
                          setSeverity("success");
                          setOpen(true);
                          setTimeout(() => {
                            setRoleData(res.data);
                            getRole();
                          }, 2000);
                        })
                        .catch((err) => {
                          console.log(
                            "error occured deletion of role",
                            err.message
                          );
                          setAlertMsg("Failed to Delete The Role");
                          setSeverity("error");
                          setOpen(true);
                        });
                    })
                    .catch((err) => {
                      console.log(
                        "error occured in deletion of entityrole",
                        err
                      );
                      setAlertMsg("Failed to Delete The Role");
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
      field: "RolePID",
      headerName: "Action",
      width: 150,
      renderCell: renderActionButton,
      disableClickEventBubbling: true,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "Name",
      headerName: "Name",
      width: 350,
      disableClickEventBubbling: true,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "Description",
      headerName: "Description",
      width: 350,
      disableClickEventBubbling: true,
      disableColumnMenu: true,
      sortable: false,
    },
    {
      field: "Active",
      headerName: "Active",
      width: 100,
      disableClickEventBubbling: true,
      disableColumnMenu: true,
      sortable: false,
    },
  ];

  const getRole = () => {
    RoleService.getAllRole()
      .then((res) => {
        setRoleData(res.data);
      })
      .catch((err) => {
        console.log("error occured in getRole", err);
        console.log("came here", err.response);
        if (err.response.status === 403 || err.response.status === 401) {
          // console.log("came here", err.response.status);
          setOpenExpire(true);
          setTimeout(() => {
            navigate("/logout");
          }, 2000);
        }
      });
  };

  useEffect(() => {
    getRole();
  }, []);

  const handleAdd = () => {
    navigate("/role/createrole/");
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
        Role
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
              <AddModeratorIcon />
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
          getRowId={(r) => r.RolePID}
          rows={roleData}
          columns={columns}
        />
        <br />
        <br />
      </Paper>
    </>
  );
};

export default Role;
