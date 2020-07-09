import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { blue } from "@material-ui/core/colors";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import logo from "./logo.jpeg";
import Tooltip from "@material-ui/core/Tooltip";
import SettingsBrightnessIcon from "@material-ui/icons/SettingsBrightness";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
    backgroundColor: blue[900],
  },
  indicator: {
    backgroundColor: blue[300],
  },
  button: {
    display: "inline-block",
    padding: 0,
    minHeight: 0,
    minWidth: 0,
  },
});

export default function Header() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const refreshPage = () => {
    window.location.reload(false);
  };

  return (
    <React.Fragment>
      <AppBar position="fixed" className={classes.root}>
        <Toolbar>
          <Grid container alignItems="center">
            <Grid item xs={1}>
              <Tooltip title="Homepage">
                <Button onClick={refreshPage} className={classes.button}>
                  <Avatar variant="square">
                    <img alt="logo" src={logo} width="100%" />
                  </Avatar>
                </Button>
              </Tooltip>
            </Grid>
            <Grid item xs={10}>
              <Tabs
                indicatorColor="primary"
                classes={{ indicator: classes.indicator }}
                value={value}
                onChange={handleChange}
                centered
              >
                <Tab classes={{ label: classes.label }} label="Titan 1" />
                <Tab classes={{ label: classes.label }} label="Titan 2" />
                <Tab classes={{ label: classes.label }} label="Titan 3" />
              </Tabs>
            </Grid>
            <Grid item xs={1}>
              <Grid container alignItems="center" justify="flex-end">
                <Tooltip title="Toggle light/dark theme">
                  <Button className={classes.button}>
                    <SettingsBrightnessIcon style={{ color: "white" }}  />
                  </Button>
                </Tooltip>
              </Grid>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Toolbar />
    </React.Fragment>
  );
}
