import React, { useContext } from "react";
import {
  Toolbar,
  CssBaseline,
  Typography,
  Divider,
  IconButton,
  MenuIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ListItem,
} from "./NavbarImport";
import { MenuList } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import { styled, useTheme } from "@mui/material/styles";
import AppRoute from "../../../AppRoute";
import Stack from "@mui/material/Stack";
import SideNav from "./SideNav";
import MenuItem from "@mui/material/MenuItem";
import { RoleContext, UserContext } from "../../../App";
import { useNavigate } from "react-router-dom";
import LockResetIcon from "@mui/icons-material/LockReset";
import PersonIcon from "@mui/icons-material/Person";
import LogoutIcon from "@mui/icons-material/Logout";
import Chip from "@mui/material/Chip";
import { Cookies, useCookies } from "react-cookie";
import logo1 from "../../../img/Logo.png";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

const Navbar = () => {
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);
  const [anchorElUser, setAnchorElUser] = React.useState(false);
  //const settings = ["My Profile", "Change Password", "Logout"];
  const { login, dispatchLogin } = useContext(UserContext);
  // const { admin, dispatchAdmin } = useContext(RoleContext);
  const [cookies, setCookie] = useCookies(["hop"]);
  const navigate = useNavigate();
  const cookieProfile = new Cookies();
  const uData = cookieProfile.get("UserObj");
  const fullName = uData?.firstname + " " + uData?.lastname;

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(false);
  };
  const handleProfile = () => {
    navigate("/profile");
    setAnchorElUser(false);
  };
  const handleChangePassword = () => {
    navigate("/changepassword");
    setAnchorElUser(false);
  };
  const handleLogout = () => {
    navigate("/logout");
    setAnchorElUser(false);
  };
  // dxc color code: #5F249F

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} sx={{ backgroundColor: "#000" }}>
        <Toolbar justifyContent="right" style={{ display: "flex" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            OTAA PORTAL
          </Typography>
          {cookies.loggedin === "true" || login ? (
            <>
              <Tooltip title="Profile Settings">
                <Toolbar
                  // justifyContent="right"
                  style={{ display: "flex", alignSelf: "flex-end" }}
                >
                  <IconButton
                    color="inherit"
                    onClick={handleOpenUserMenu}
                    // sx={{ p: 0 }}
                    // justifyContent="right"
                  >
                    <Chip
                      color="primary"
                      style={{ background: "#000", cursor: "pointer" }}
                      avatar={<Avatar>{fullName?.substr(0, 1)}</Avatar>}
                      label={fullName}
                      // variant="outlined"
                    />
                  </IconButton>
                </Toolbar>
              </Tooltip>
              <Menu
                sx={{ mt: "45px" }}
                id="menu-appbar"
                //anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={anchorElUser}
                onClose={handleCloseUserMenu}
              >
                {/* {settings.map((setting) => (
              <MenuItem key={setting} onClick={handleCloseUserMenu}>
                <MenuList key="My Profile" onClick={handleProfile}></MenuList>
                <MenuList key="Change Password" onClick={handleChangePassword}></MenuList>
                <MenuList key="Logout" onClick={handleLogout}></MenuList>
                <Typography textAlign="end">{setting}</Typography>
              </MenuItem>
            ))} */}
                <MenuItem onClick={handleProfile}>
                  <PersonIcon color="primary"></PersonIcon>&nbsp; My Profile
                </MenuItem>
                <MenuItem onClick={handleChangePassword}>
                  <LockResetIcon color="primary"></LockResetIcon>&nbsp; Change
                  Password
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <LogoutIcon color="primary"></LogoutIcon>&nbsp; Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <></>
          )}
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              padding: theme.spacing(0, 1),
              // necessary for content to be below app bar
              ...theme.mixins.toolbar,
            }}
          >
            <div style={{ paddingRight: "35%" }}>
              <img height={55} src={logo1} alt=""></img>
            </div>
            <IconButton onClick={handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </div>
          {/* </Stack> */}
        </DrawerHeader>
        <Divider />
        <SideNav></SideNav>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <AppRoute></AppRoute>
      </Box>
    </Box>
  );
};

export default Navbar;
