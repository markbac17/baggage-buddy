import React , { useState, useEffect }from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Vendor from "../components/vendor/Vendor";
import Airport from "./customer/Airport";
import Customer from "./customer/Customer";
import Dashboard from "../components/dashboard/Dashboard";

function TabPanel(tab_props) {
  const defaultCenter = { lat: 40.7517, lng: -73.979 };
  const [userLocation, setUserLocation] = useState(defaultCenter);
  const { children, value, index, ...other } = tab_props;
  
  const [token, setToken] = useState(sessionStorage.getItem("token") || "");
  useEffect(() => {
    const getUserLocation = async () => {
      navigator.geolocation.getCurrentPosition(
        function(position) {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })

        }
      )
    }
    getUserLocation()
  }, [token]);
  console.log(userLocation)
  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
}));

function NavBar() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange}>
          <Tab label="Airport view" {...a11yProps(0)} />
          <Tab label="Customer view" {...a11yProps(1)} />
          <Tab label="Vendor view" {...a11yProps(2)} />
          <Tab label="Customers to process" {...a11yProps(3)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}><Airport /></TabPanel>
      <TabPanel value={value} index={1}><Customer /></TabPanel>
      <TabPanel value={value} index={2}><Vendor /></TabPanel>
      <TabPanel value={value} index={3}><Dashboard /></TabPanel>
    </div>
  );
}

export default NavBar;