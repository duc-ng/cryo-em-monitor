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
import Slide from "@material-ui/core/Slide";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import GitHubIcon from "@material-ui/icons/GitHub";
import Switch from "@material-ui/core/Switch";
import Box from "@material-ui/core/Box";
import { DataContext } from "../global/Data";
import { ThemeContext } from "../global/Theme";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  appbar: {
    [theme.breakpoints.up("md")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
    boxShadow: "none",
    padding: 0,
  },
  toolbar: {
    padding: 0,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
}));

const StyledBadge = withStyles((theme) => ({
  badge: {
    backgroundColor: theme.palette.warning.main,
    color: theme.palette.common.white,
    top: 2,
    right: -7,
  },
}))(Badge);

const StyledTooltip = withStyles((theme) => ({
  tooltip: {
    backgroundColor: theme.palette.warning.main,
  },
}))(Tooltip);

export default function Header(props) {
  const classes = useStyles();
  const dataContext = React.useContext(DataContext);
  const themeContext = React.useContext(ThemeContext);
  const [invisible, setInvisible] = React.useState(true);
  const [tabValue, setTabValue] = React.useState(0);

  //notification, when no data has arrived for x min
  React.useEffect(() => {
    let interval = setInterval(() => {
      const isOld = Date.now() - new Date(dataContext.lastItemDate) > 10000;
      isOld ? setInvisible(false) : setInvisible(true);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [dataContext]);

  //hide header when scrolling down
  function HideOnScroll(props) {
    const { children } = props;
    const trigger = useScrollTrigger();
    return (
      <Slide appear={false} direction="down" in={!trigger}>
        {children}
      </Slide>
    );
  }

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

  //Tabs, displaying TEMS
  function TabSwitch() {
    const label = (
      <StyledTooltip title={invisible ? "" : "No data for 10 seconds."}>
        <StyledBadge invisible={invisible} variant="dot">
          Titan 1
        </StyledBadge>
      </StyledTooltip>
    );
    return (
      <Tabs
        value={tabValue}
        onChange={(event, newValue) => setTabValue(newValue)}
        variant="scrollable"
        scrollButtons="on"
        indicatorColor="primary"
        textColor="primary"
        className={classes.tabs}
      >
        <Tab label={label} />
        <Tab label="Titan 2" />
        <Tab label="Titan 3" />
        <Tab label="Titan 4" />
        <Tab label="Titan 5" />
        <Tab label="Titan 6" />
        <Tab label="Titan 7" />
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
      <Tooltip title="Project on Github">
        <IconButton href="https://github.com/duc-ng/web-monitoring">
          <GitHubIcon fontSize="small" />
        </IconButton>
      </Tooltip>
    );
  }

  //render
  console.log("Updated: header");
  return (
    <HideOnScroll {...props}>
      <AppBar color="inherit" className={classes.appbar}>
        <Toolbar variant="dense" className={classes.toolbar}>
          <Grid container justify="space-between" alignItems="center">
            <Grid item xs={3}>
              <DarkModeToggle />
            </Grid>
            <Grid item xs={6}>
              <TabSwitch />
            </Grid>
            <Grid item xs={3}>
              <Grid container alignItems="center" justify="flex-end">
                <GithubButton />
                <SideBarButton />
              </Grid>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </HideOnScroll>
  );
}
