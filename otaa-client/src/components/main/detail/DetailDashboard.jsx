import React from "react";
import { useParams } from "react-router-dom";
import AssetSummery from "./AssetSummery";
import NetworkDetails from "./NetworkDetails";
import NetworkGraphDetails from "./NetworkGraphDetails";
import Vulnerability from "./Vulnerability";
import { useTheme } from "@mui/material/styles";
// import SwipeableViews from "react-swipeable-views";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import PropTypes from "prop-types";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

const DetailDashboard = () => {
  const theme = useTheme();
  // const assetId = useParams();

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  // const handleChangeIndex = (index) => {
  //   setValue(index);
  // };
  return (
    <div>
      <Box sx={{ bgcolor: "background.paper", width: "100%" }}>
        <AppBar position="static">
          <Tabs
            value={value}
            onChange={handleChange}
            indicatorColor="secondary"
            textColor="inherit"
            variant="fullWidth"
            aria-label="full width tabs example"
          >
            <Tab label="Assets Summery" {...a11yProps(0)} />
            <Tab label="Network Stat" {...a11yProps(1)} />
            <Tab label="Network Map" {...a11yProps(2)} />
            <Tab label="Vulnerability" {...a11yProps(3)} />
          </Tabs>
        </AppBar>
        {/* <SwipeableViews
          axis={theme.direction === "rtl" ? "x-reverse" : "x"}
          index={value}
          onChangeIndex={handleChangeIndex}
        ></SwipeableViews> */}
        <TabPanel value={value} index={0} dir={theme.direction}>
          <AssetSummery />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <NetworkDetails />
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          <NetworkGraphDetails />
        </TabPanel>
        <TabPanel value={value} index={3} dir={theme.direction}>
          <Vulnerability />
        </TabPanel>
      </Box>
    </div>
  );
};

export default DetailDashboard;
