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
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import CellTowerIcon from "@mui/icons-material/CellTower";
import EqualizerIcon from "@mui/icons-material/Equalizer";
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
  const [cookies, setCookie] = useCookies(["hop"]);
  const cookiesData = new Cookies();
  const userdata = cookiesData.get("UserObj");

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
            <Link
              to={"/asset-summery"}
              style={{ textDecoration: "none", color: "black" }}
            >
              <ListItem button key="Assets">
                <ListItemIcon>
                  <Tooltip title="Assets">
                    <DvrIcon />
                  </Tooltip>
                </ListItemIcon>
                <ListItemText primary="Assets" />
              </ListItem>
            </Link>

            <Link
              to={"/networkstats"}
              style={{ textDecoration: "none", color: "black" }}
            >
              <ListItem button key="Network Stats">
                <ListItemIcon>
                  <Tooltip title="Network Stats">
                    <CellTowerIcon />
                  </Tooltip>
                </ListItemIcon>
                <ListItemText primary="Network Stats" />
              </ListItem>
            </Link>

            <Link
              to={"/network-graph"}
              style={{ textDecoration: "none", color: "black" }}
            >
              <ListItem button key="Network Graph">
                <ListItemIcon>
                  <Tooltip title="Network Graph">
                    <EqualizerIcon />
                  </Tooltip>
                </ListItemIcon>
                <ListItemText primary="Network Graph" />
              </ListItem>
            </Link>

            <Link
              to={"/events"}
              style={{ textDecoration: "none", color: "black" }}
            >
              <ListItem button key="Events">
                <ListItemIcon>
                  <Tooltip title="Events">
                    <EventAvailableIcon />
                  </Tooltip>
                </ListItemIcon>
                <ListItemText primary="Events" />
              </ListItem>
            </Link>

            <Link
              to={"/vulnerability-summery"}
              style={{ textDecoration: "none", color: "black" }}
            >
              <ListItem button key="Vulnerability">
                <ListItemIcon>
                  <Tooltip title="Vulnerability">
                    <EventAvailableIcon />
                  </Tooltip>
                </ListItemIcon>
                <ListItemText primary="Vulnerability" />
              </ListItem>
            </Link>

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
              to={"/assets"}
              style={{ textDecoration: "none", color: "black" }}
            >
              <ListItem button key="Upload PCAP">
                <ListItemIcon>
                  <Tooltip title="Upload PCAP">
                    <BackupIcon />
                  </Tooltip>
                </ListItemIcon>
                <ListItemText primary="Upload PCAP" />
              </ListItem>
            </Link>

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
              to={"/about"}
              style={{ textDecoration: "none", color: "black" }}
            >
              <ListItem button key="About">
                <ListItemIcon>
                  <Tooltip title="About">
                    <SettingsApplicationsIcon />
                  </Tooltip>
                </ListItemIcon>
                <ListItemText primary="About" />
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
