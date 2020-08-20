import React from "react";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import MailIcon from "@material-ui/icons/Mail";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import logo from "./../../assets/logo.jpeg";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { ThemeContext } from "../../global/Theme";

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
    <div>
      <List className={classes.toolbar}>
        <ListItem>
          <ListItemIcon>
            <Tooltip title="Homepage">
              <Button onClick={refreshPage}>
                <Avatar variant="square">
                  <img alt="logo" src={logo} width="100%" />
                </Avatar>
              </Button>
            </Tooltip>
          </ListItemIcon>
          <ListItemText>
            <Typography variant="subtitle1">
              <Box fontWeight="fontWeightBold" m={1}>
                Cryo-EM Monitor
              </Box>
            </Typography>
          </ListItemText>
        </ListItem>
      </List>
      <List>
        {["Inbox", "Starred", "Send email", "Drafts"].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>
              {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
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