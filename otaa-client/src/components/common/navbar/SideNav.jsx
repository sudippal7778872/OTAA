import React from "react";
import { useContext } from "react";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  HomeIcon,
  Divider,
} from "./NavbarImport";
//import "./Navbar.css";
import Tooltip from "@mui/material/Tooltip";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import LockIcon from "@mui/icons-material/Lock";
import DvrIcon from "@mui/icons-material/Dvr";
import DescriptionIcon from "@mui/icons-material/Description";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import { RoleContext, UserContext } from "../../../App";
import LogoutIcon from "@mui/icons-material/Logout";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import EngineeringIcon from "@mui/icons-material/Engineering";
import { useCookies, Cookies } from "react-cookie";
import BackupIcon from "@mui/icons-material/Backup";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import { Button } from "@mui/material";

const SideNav = () => {
  const { login, dispatchLogin } = useContext(UserContext);
  // const { admin, dispatchAdmin } = useContext(RoleContext);
  const [cookies, setCookie] = useCookies(["hop"]);
  const cookiesData = new Cookies();
  const userdata = cookiesData.get("UserObj");
  console.log("cookies data", userdata);

  let Dashboard = false;
  let Hop = false;
  let Contact = false;
  let ContactMatrix = false;
  let ManageUser = false;
  let ManageRole = false;

  const entity = userdata?.userData?.entity;
  if (entity) {
    entity.forEach((item) => {
      if (item.Name === "Dashboard") {
        const data = Object.values(item).map((val) => {
          return val;
        });
        Dashboard = data.includes(1);
      } else if (item.Name === "Hop") {
        const data = Object.values(item).map((val) => {
          return val;
        });
        Hop = data.includes(1);
      } else if (item.Name === "Contact") {
        const data = Object.values(item).map((val) => {
          return val;
        });
        Contact = data.includes(1);
      } else if (item.Name === "Contact Matrix") {
        const data = Object.values(item).map((val) => {
          return val;
        });
        ContactMatrix = data.includes(1);
      } else if (item.Name === "Manage User") {
        const data = Object.values(item).map((val) => {
          return val;
        });
        ManageUser = data.includes(1);
      } else if (item.Name === "Manage Role") {
        const data = Object.values(item).map((val) => {
          return val;
        });
        ManageRole = data.includes(1);
      }
    });
    console.log("this is", ContactMatrix);
  }

  return (
    <div style={{ background: "#eee" }}>
      <List>
        <Link to={"/home"} style={{ textDecoration: "none", color: "black" }}>
          <ListItem button key="Home">
            <ListItemIcon>
              <Tooltip title="Home">
                <HomeIcon />
              </Tooltip>
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
        </Link>

        {cookies.loggedin === "true" || login ? (
          <>
            {/* <Link
              to={"home2"}
              style={{ textDecoration: "none", color: "black" }}
            >
              <ListItem button key="Home2">
                <ListItemIcon>
                  <Tooltip title="Home">
                    <HomeIcon />
                  </Tooltip>
                </ListItemIcon>
                <ListItemText
                  primary="Home"
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      ></Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
            </Link> */}
            {Dashboard ? (
              <>
                <Link
                  to={"/dashboard"}
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <ListItem button key="Dashboard">
                    <ListItemIcon>
                      <Tooltip title="Dashboard">
                        <DvrIcon />
                      </Tooltip>
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" />
                  </ListItem>
                </Link>
              </>
            ) : (
              <></>
            )}

            {Hop ? (
              <>
                <Link
                  disabled={Hop}
                  to={"/hops"}
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <ListItem button key="HOP">
                    <ListItemIcon>
                      <Tooltip title="HOP">
                        <InboxIcon />
                      </Tooltip>
                    </ListItemIcon>
                    <ListItemText primary="HOP" />
                  </ListItem>
                </Link>
              </>
            ) : (
              <></>
            )}

            {/* <Link to={"/DisplayTailoring"} style={{ textDecoration: "none", color: "black" }}>
          <ListItem button key="Tailoring">
            <ListItemIcon>
              <Tooltip title="Tailoring">
                <DescriptionIcon />
              </Tooltip>
            </ListItemIcon>
            <ListItemText primary="Tailoring" />
          </ListItem>
        </Link> */}

            {Contact ? (
              <>
                <Link
                  to={"/contact"}
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <ListItem button key="Contact">
                    <ListItemIcon>
                      <Tooltip title="Contact">
                        <ContactPageIcon />
                      </Tooltip>
                    </ListItemIcon>
                    <ListItemText primary="Contact" />
                  </ListItem>
                </Link>
              </>
            ) : (
              <></>
            )}

            {ContactMatrix ? (
              <>
                <Link
                  to={"/contactmatrix"}
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <ListItem button key="ContactMatrix">
                    <ListItemIcon>
                      <Tooltip title="Contact Matrix">
                        <ContactMailIcon />
                      </Tooltip>
                    </ListItemIcon>
                    <ListItemText primary="Contact Matrix" />
                  </ListItem>
                </Link>
              </>
            ) : (
              <></>
            )}

            <Link
              to={"/assignment & signoff matrix"}
              style={{
                textDecoration: "none",
                color: "black",
                display: "none",
              }}
            >
              <ListItem button key="Assignment & Signoff Matrix">
                <ListItemIcon>
                  <Tooltip title="Assignment & Signoff Matrix">
                    <InboxIcon />
                  </Tooltip>
                </ListItemIcon>
                <ListItemText
                  primary="Assignment & Signoff Matrix"
                  secondary={
                    <React.Fragment>
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body2"
                        color="text.primary"
                      ></Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
            </Link>
          </>
        ) : (
          <></>
        )}

        <Divider></Divider>

        {cookies.loggedin === "true" || login ? (
          <>
            <Link
              to={"/uploadppmcdata"}
              style={{ textDecoration: "none", color: "black" }}
            >
              <ListItem button key="Upload PPMC Data">
                <ListItemIcon>
                  <Tooltip title="Upload PPMC Data">
                    <BackupIcon />
                  </Tooltip>
                </ListItemIcon>
                <ListItemText primary="Upload PPMC Data" />
              </ListItem>
            </Link>

            {ManageUser ? (
              <>
                <Link
                  to={"/user"}
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <ListItem button key="Manage User">
                    <ListItemIcon>
                      <Tooltip title="Manage User">
                        <ManageAccountsIcon />
                      </Tooltip>
                    </ListItemIcon>
                    <ListItemText primary="Manage User" />
                  </ListItem>
                </Link>
              </>
            ) : (
              <></>
            )}

            {ManageRole ? (
              <>
                <Link
                  to={"/role"}
                  style={{ textDecoration: "none", color: "black" }}
                >
                  <ListItem button key="Manage Role">
                    <ListItemIcon>
                      <Tooltip title="Manage Role">
                        <EngineeringIcon />
                      </Tooltip>
                    </ListItemIcon>
                    <ListItemText primary="Manage Role" />
                  </ListItem>
                </Link>
              </>
            ) : (
              <></>
            )}

            <Link
              to={"/appsetting"}
              style={{ textDecoration: "none", color: "black" }}
            >
              <ListItem button key="Setting">
                <ListItemIcon>
                  <Tooltip title="Setting">
                    <SettingsApplicationsIcon />
                  </Tooltip>
                </ListItemIcon>
                <ListItemText primary="Setting" />
              </ListItem>
            </Link>

            <Link
              to={"/logout"}
              style={{ textDecoration: "none", color: "black" }}
            >
              <ListItem button key="Logout">
                <ListItemIcon>
                  <Tooltip title="Logout">
                    <LogoutIcon />
                  </Tooltip>
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </Link>
          </>
        ) : (
          <Link
            to={"/login"}
            style={{ textDecoration: "none", color: "black" }}
          >
            <ListItem button key="Login">
              <ListItemIcon>
                <Tooltip title="Login">
                  <LockIcon />
                </Tooltip>
              </ListItemIcon>
              <ListItemText primary="Login" />
            </ListItem>
          </Link>
        )}
      </List>
    </div>
  );
};

export default SideNav;
