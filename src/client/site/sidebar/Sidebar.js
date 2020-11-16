import React from "react";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import logo from "./../../assets/logo.jpeg";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import { ThemeContext } from "../../global/Theme";
import Filter from "./Filter";
import Navigation from "./Navigation";
import Updates from "./Updates";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  drawer: {
    [theme.breakpoints.up("md")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },

  toolbar: theme.mixins.toolbar, //content below header
  drawerPaper: {
    width: drawerWidth,
    background: theme.palette.primary,
    border: 0,
  },
  button: {
    backgroundColor: "transparent",
    padding: 0,
  },
}));

export default function Sidebar(props) {
  const classes = useStyles();
  const theme = useTheme();
  const themeContext = React.useContext(ThemeContext);

  const refreshPage = () => {
    window.location.reload(false);
  };

  //sidebar
  const drawer = (
    <Box m={2}>
      <Grid container alignItems="flex-end">
        <Grid item xs={4}>
          <Tooltip title="Homepage">
            <IconButton
              aria-label="delete"
              className={classes.button}
              disableRipple
              onClick={refreshPage}
            >
              <img alt="logo" src={logo} width={50} />
            </IconButton>
          </Tooltip>
        </Grid>
        <Grid item xs={8}>
          <Typography variant="subtitle1">
            <Box fontWeight="fontWeightBold">Cryo-EM Monitor</Box>
          </Typography>
          <Typography variant="caption">
            <Box fontSize={11}>MPI of Biochemistry</Box>
          </Typography>
        </Grid>
      </Grid>
      <Navigation />
      <Filter />
      <Updates />
    </Box>
  );

  //render mobile and desktop
  return (
    <nav className={classes.drawer}>
      <Hidden mdUp implementation="css">
        <Drawer
          variant="temporary"
          anchor={theme.direction === "rtl" ? "right" : "left"}
          open={themeContext.mobileOpen}
          onClose={themeContext.handleDrawerToggle}
          classes={{
            paper: classes.drawerPaper,
          }}
          ModalProps={{
            keepMounted: true, // Better mobile performance
          }}
        >
          {drawer}
        </Drawer>
      </Hidden>
      <Hidden smDown implementation="css">
        <Drawer
          classes={{
            paper: classes.drawerPaper,
          }}
          variant="permanent"
          open
        >
          {drawer}
        </Drawer>
      </Hidden>
    </nav>
  );
}
