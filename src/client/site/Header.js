import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import Tooltip from "@material-ui/core/Tooltip";
import SettingsBrightnessIcon from "@material-ui/icons/SettingsBrightness";
import Badge from "@material-ui/core/Badge";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import GitHubIcon from "@material-ui/icons/GitHub";
import Switch from "@material-ui/core/Switch";
import Box from "@material-ui/core/Box";
import Hidden from "@material-ui/core/Hidden";
import config from "./../../config.json";
import { DataContext } from "./../global/Data";
import { ThemeContext } from "../global/Theme";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import API from "./API";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  appbar: {
    [theme.breakpoints.up("lg")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
    boxShadow: "none",
    padding: 0,
    opacity: 0.9
  },
  toolbar: {
    padding: 0,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("lg")]: {
      display: "none",
    },
  },
  circle: {
    color: theme.palette.secondary.main,
  },
}));

const StyledBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: theme.palette.secondary.main,
    color: theme.palette.common.white,
    top: 2,
    right: -7,
  },
}))(Badge);

const StyledTooltip = withStyles((theme) => ({
  tooltip: {
    color: theme.palette.secondary.main,
  },
}))(Tooltip);

export default function Header() {
  const classes = useStyles();
  const dataContext = React.useContext(DataContext);
  const themeContext = React.useContext(ThemeContext);
  const [tabValue, setTabValue] = React.useState(0);
  const [isLoading, setIsLoading] = React.useState(false);

  //Displaying sidebar on mobile
  function SideBarButton() {
    return (
      <IconButton
        color="inherit"
        edge="end"
        onClick={themeContext.handleDrawerToggle}
        className={classes.menuButton}
      >
        <MenuIcon />
      </IconButton>
    );
  }

  //Tab + notification, if no data has arrived
  function EnhancedLabel(props) {
    const [invisible, setInvisible] = React.useState(true);

    React.useEffect(() => {
      let interval = setInterval(() => {
        setInvisible(
          !(
            Date.now() - new Date(dataContext.lastDate) >
              config.app.notification.ms && props.val === tabValue
          )
        );
      }, 1000);
      return () => {
        clearInterval(interval);
      };
    }, [props.val]);

    const tooltipText = (
      <Typography variant="caption">
        {config.app.notification.message}
      </Typography>
    );

    return (
      <StyledTooltip title={invisible ? "" : tooltipText}>
        <StyledBadge invisible={invisible} variant="dot">
          {props.label}
        </StyledBadge>
      </StyledTooltip>
    );
  }

  //Tabs
  function TabSwitch() {
    return (
      <Tabs
        value={tabValue}
        onChange={(event, newValue) => {
          dataContext.switchMicroscope(newValue);
          setTabValue(newValue);
        }}
        variant="scrollable"
        className={classes.tabs}
      >
        {config.microscopes.map((x, i) => (
          <Tab label={<EnhancedLabel label={x.label} val={i} />} key={i} />
        ))}
      </Tabs>
    );
  }

  //Toggle Dark mode
  function DarkModeToggle() {
    return (
      <Box pl={2}>
        <Grid container alignItems="center" justify="flex-start">
          <SettingsBrightnessIcon color="action" />
          <Tooltip title="Toggle light/dark theme">
            <Switch
              checked={themeContext.darkmodeOn}
              onChange={themeContext.switchDarkMode}
              color="primary"
            />
          </Tooltip>
        </Grid>
      </Box>
    );
  }

  //Button Github
  function GithubButton() {
    return (
      <Hidden smDown>
        <Tooltip title="Project on Github">
          <IconButton href="https://github.com/duc-ng/web-monitoring">
            <GitHubIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Hidden>
    );
  }

  //show loading button, when data is fetched
  function Loading() {
    return isLoading ? (
      <CircularProgress size={20} thickness={6} className={classes.circle} />
    ) : (
      <div />
    );
  }

  //render
  return (
    <AppBar color="inherit" className={classes.appbar}>
      <Toolbar variant="dense" className={classes.toolbar}>
        <API setIsLoading={setIsLoading} />
        <Grid container justify="space-between" alignItems="center">
          <Grid item>
            <DarkModeToggle />
          </Grid>
          <Grid item xs={5} sm={6}>
            <TabSwitch />
          </Grid>
          <Grid item>
            <Grid container alignItems="center" justify="flex-end">
              <Loading />
              <GithubButton />
              <SideBarButton />
            </Grid>
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
}
