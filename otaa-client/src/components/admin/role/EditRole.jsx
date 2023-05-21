import React, { useEffect, memo } from "react";
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
  Checkbox,
  FormGroup,
  FormControlLabel,
  FormLabel,
  Select,
  InputLabel,
  MenuItem,
} from "@mui/material/";
import MUISnackbar from "../../common/snackbar/Snackbar";
import Avatar from "@mui/material/Avatar";
import { pink } from "@mui/material/colors";
import SettingsAccessibilityIcon from "@mui/icons-material/SettingsAccessibility";
import RoleService from "../../../services/role.service";
import { useNavigate, useParams } from "react-router-dom";

const EditRole = () => {
  const navigate = useNavigate();
  const RID = useParams();
  const rolePID = +RID.id;
  const [open, setOpen] = React.useState(false);
  const [alertMsg, setAlertMsg] = React.useState(null);
  const [severity, setSeverity] = React.useState(null);
  const [allEntity, setAllEntity] = React.useState([]);
  const [initialValues, setInitialValues] = React.useState();
  const [entityRole,setEntityRole] = React.useState();


  const handleChange = (event) => {
    const name = event.target.name;
    const data = event.target.value;
    const check = event.target.checked;
    setInitialValues((previousValue) => {
      if (name === "Active") {
        return {
          ...previousValue,
          [name]: check,
        };
      } else {
        return {
          ...previousValue,
          [name]: data,
        };
      }
    });
  };
  const handleCheckboxToggleCreateOnly = (index, EntityPID) => {
    const newState = allEntity.map((obj) => {
      if (obj.EntityPID == EntityPID) {
        if (obj.CreateOnly) {
          return { ...obj, CreateOnly: false };
        } else {
          return { ...obj, CreateOnly: true };
        }
      }
      return obj;
    });
    setAllEntity(newState);
  };
  const handleCheckboxToggleReadOnly = (index, EntityPID) => {
    const newState = allEntity.map((obj) => {
      if (obj.EntityPID == EntityPID) {
        if (obj.ReadOnly) {
          return { ...obj, ReadOnly: false };
        } else {
          return { ...obj, ReadOnly: true };
        }
      }
      return obj;
    });
    setAllEntity(newState);
  };
  const handleCheckboxToggleViewOnly = (index, EntityPID) => {
    const newState = allEntity.map((obj) => {
      if (obj.EntityPID == EntityPID) {
        if (obj.ViewOnly) {
          return { ...obj, ViewOnly: false };
        } else {
          return { ...obj, ViewOnly: true };
        }
      }
      return obj;
    });
    setAllEntity(newState);
  };
  const handleCheckboxToggleEditOnly = (index, EntityPID) => {
    const newState = allEntity.map((obj) => {
      if (obj.EntityPID == EntityPID) {
        if (obj.EditOnly) {
          return { ...obj, EditOnly: false };
        } else {
          return { ...obj, EditOnly: true };
        }
      }
      return obj;
    });
    setAllEntity(newState);
  };
  const handleCheckboxToggleDeleteOnly = (index, EntityPID) => {
    const newState = allEntity.map((obj) => {
      if (obj.EntityPID == EntityPID) {
        if (obj.DeleteOnly) {
          return { ...obj, DeleteOnly: false };
        } else {
          return { ...obj, DeleteOnly: true };
        }
      }
      return obj;
    });
    setAllEntity(newState);
  };

  // useEffect(() => {
  //   RoleService.getEntity()
  //     .then((res) => {
  //       console.log("this is entity",res.data);
  //       var _entity = [];
  //       res.data.map((item, index) => {
  //         _entity.push({
  //           EntityPID: item.EntityPID,
  //           Name: item.Name,
  //           CreateOnly: false,
  //           ReadOnly: false,
  //           ViewOnly: false,
  //           EditOnly: false,
  //           DeleteOnly: false,
  //         });
  //       });
  //       setAllEntity(_entity);
  //     })
  //     .catch((err) => {
  //       console.log("err occured in entity api", err);
  //     });
  // }, []);

  const showRoleData = () => {
    RoleService.getRoleById(rolePID)
      .then((res) => {
        setInitialValues(res.data[0]);
      })
      .catch((err) => {
        console.log("error occured in show data", err);
      });
  };
  const showEntityRole = () => {
    RoleService.getEntityRoleById(rolePID)
    .then((res)=>{
      console.log("response from entity role",res.data);
      setAllEntity(res.data)
    })
    .catch((err)=>{
      console.log("error occured in show entityRole",err)
    })
  }

  useEffect(() => {
    showRoleData();
    showEntityRole();
  }, []);

  const onSubmit = (e) => {
    delete initialValues.RolePID;
    RoleService.updateRoleById(rolePID,initialValues)
      .then((res) => {
        console.log("response from role", res.data);
        RoleService.updateEntityRoleById(rolePID,allEntity)
          .then((res) => {
            setAlertMsg("Role Successfully Added");
            setSeverity("success");
            setOpen(true);
            setTimeout(()=>{
              navigate(`/role/`)
            },500)
          })
          .catch((err) => {
            setAlertMsg("Failed to Add The Role");
            setSeverity("error");
            setOpen(true);
            console.log("error occured in create EntityRole", err);
          });
      })
      .catch((err) => {
        setAlertMsg("Failed to Add The Role");
        setSeverity("error");
        setOpen(true);
        console.log("error occured in create api", err);
      });
  };

  const handleReset = (resetForm) => {
    resetForm();
  };
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <MUISnackbar
        open={open}
        handleClose={handleClose}
        alertMsg={alertMsg}
        severity={severity}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "2%",
          width: "100%",
          //   height: 450,
        }}
      >
        <Card elevation={3} style={{ width: "65%", height: "95%" }}>
          <CardContent>
            <div style={{ justifyContent: "center", display: "flex" }}>
              <Avatar sx={{ bgcolor: pink[500] }}>
                <SettingsAccessibilityIcon />
              </Avatar>
            </div>
            <Typography
              sx={{ fontSize: 24, fontWeight: "bold" }}
              align="center"
            >
              Update Role
            </Typography>
          </CardContent>
          <CardActions>
            <Stack
              spacing={3}
              style={{
                display: "flex",
                // border:"1px solid red",
                width: "90%",
                marginLeft: "5%",
              }}
            >
              {initialValues ? (
                <>
                  <Stack fullWidth style={{ width: "90%" }}>
                    <TextField
                      id="outlined-basic"
                      label="Role"
                      name="Name"
                      value={initialValues.Name}
                      onChange={handleChange}
                      fullWidth
                      size="medium"
                      variant="outlined"
                    />
                  </Stack>
                  <Stack style={{ width: "90%" }}>
                    <TextField
                      id="outlined-basic"
                      label="Description"
                      name="Description"
                      value={initialValues.Description}
                      onChange={handleChange}
                      fullWidth
                      size="medium"
                      variant="outlined"
                    />
                  </Stack>
                  <Stack>
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={initialValues.Active}
                          name="Active"
                          size="medium"
                          onClick={handleChange}
                          value={initialValues.Active}
                        />
                      }
                      label="Active"
                    />
                  </Stack>
                </>
              ) : (
                <> Loading...</>
              )}

              <Stack style={{ width: "90%" }}>
                <table style={{ border: "2px solid #D3D3D3" }}>
                  <tbody
                    style={{
                      // border:'1px solid',
                      textAlign: "center",
                    }}
                  >
                    <tr style={{ border: "1px solid #FFF",background:"#5F249F",color:"white" }}>
                      <td style={{ border: "1px solid #FFF", fontWeight: "bold" }}>
                        Entity
                      </td>
                      <td style={{ border: "1px solid #FFF", fontWeight: "bold" }}>
                        Create
                      </td>
                      <td style={{ border: "1px solid #FFF", fontWeight: "bold" }}>
                        Read
                      </td>
                      <td style={{ border: "1px solid #FFF", fontWeight: "bold" }}>
                        View
                      </td>
                      <td style={{ border: "1px solid #FFF", fontWeight: "bold" }}>
                        Edit
                      </td>
                      <td style={{ border: "1px solid #FFF", fontWeight: "bold" }}>
                        Delete
                      </td>
                    </tr>
                    {allEntity?.map((item, index) => {
                      return (
                        <tr key={index} style={{ border: "1px solid #FFF" }}>
                          <td style={{ border: "1px solid #FFF",background:"#D3D3D3",color:"black" }}>{item.Name}:</td>
                          <td style={{ border: "1px solid #D3D3D3" }}>
                            <FormControlLabel
                              control={<Checkbox checked={item.CreateOnly} />}
                              // label="Create"
                              labelPlacement="end"
                              name={item.Name}
                              onClick={() =>
                                handleCheckboxToggleCreateOnly(
                                  index,
                                  item.EntityPID
                                )
                              }
                            />
                          </td>
                          <td style={{ border: "1px solid #D3D3D3" }}>
                            <FormControlLabel
                              control={<Checkbox checked={item.ReadOnly}/>}
                              // label="Read"
                              labelPlacement="end"
                              name={item.Name}
                              onClick={() =>
                                handleCheckboxToggleReadOnly(
                                  index,
                                  item.EntityPID
                                )
                              }
                            />
                          </td>

                          <td style={{ border: "1px solid #D3D3D3" }}>
                            <FormControlLabel
                              control={<Checkbox checked={item.ViewOnly}/>}
                              // label="View"
                              labelPlacement="end"
                              name={item.Name}
                              onClick={() =>
                                handleCheckboxToggleViewOnly(
                                  index,
                                  item.EntityPID
                                )
                              }
                            />
                          </td>
                          <td style={{ border: "1px solid #D3D3D3" }}>
                            <FormControlLabel
                              control={<Checkbox checked={item.EditOnly}/>}
                              // label="Edit"
                              labelPlacement="end"
                              name={item.Name}
                              onClick={() =>
                                handleCheckboxToggleEditOnly(
                                  index,
                                  item.EntityPID
                                )
                              }
                            />
                          </td>
                          <td style={{ border: "1px solid #D3D3D3" }}>
                            <FormControlLabel
                              control={<Checkbox checked={item.DeleteOnly}/>}
                              // label="Delete"
                              labelPlacement="end"
                              name={item.Name}
                              onClick={() =>
                                handleCheckboxToggleDeleteOnly(
                                  index,
                                  item.EntityPID
                                )
                              }
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </Stack>
              <Stack
                direction="row"
                spacing={2}
                style={{
                  // border: "1px solid red",
                  marginTop: "40px",
                  marginBottom: "40px",
                  textAlign: "center",
                  // paddingLeft: "25px",
                }}
              >
                <Stack>
                  <Button
                    variant="contained"
                    color="success"
                    type="submit"
                    onClick={onSubmit}
                  >
                    Update
                  </Button>
                </Stack>
                <Stack>
                  <Button
                    variant="contained"
                    color="error"
                    // onClick={handleReset.bind(null, props.resetForm)}
                    // value={"Reset"}
                    type="button"
                  >
                    Clear
                  </Button>
                </Stack>
              </Stack>
            </Stack>
          </CardActions>
        </Card>
      </div>
    </>
  );
};

export default EditRole;
