import React, { useEffect } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import { blue } from "@material-ui/core/colors";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import logo from "./../logo.jpeg";
import Tooltip from "@material-ui/core/Tooltip";
import SettingsBrightnessIcon from "@material-ui/icons/SettingsBrightness";
import Badge from "@material-ui/core/Badge";

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

const StyledBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: "#d50000",
    top: 2,
    right: -12,
  },
}))(Badge);

const RedTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: "#d50000",
    color: "#fff",
  },
}))(Tooltip);

export default function Header(props) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [invisible, setInvisible] = React.useState(true);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const refreshPage = () => {
    window.location.reload(false);
  };

  //notification, when no data has arrived for x min
  useEffect(() => {
    let interval = setInterval(() => {
      let d = Date.now();
      if (d - new Date(props.lastItemDate) > 10000) {
        setInvisible(false);
      } else {
        setInvisible(true);
      }
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [props.lastItemDate]);

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
                <Tab
                  classes={{ label: classes.label }}
                  label={
                    <RedTooltip
                      title={
                        invisible
                          ? ""
                          : "Data has not arrived for more than 10 seconds."
                      }
                      color="error"
                    >
                      <StyledBadge invisible={invisible} badgeContent={"!"}>
                        Titan 1
                      </StyledBadge>
                    </RedTooltip>
                  }
                />
                <Tab classes={{ label: classes.label }} label="Titan 2" />
                <Tab classes={{ label: classes.label }} label="Titan 3" />
              </Tabs>
            </Grid>
            <Grid item xs={1}>
              <Grid container alignItems="center" justify="flex-end">
                <Tooltip title="Toggle light/dark theme">
                  <Button className={classes.button}>
                    <SettingsBrightnessIcon style={{ color: "white" }} />
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
