import React from "react";
import Button from "@material-ui/core/Button";
import Hidden from "@material-ui/core/Hidden";
import Dialog from "@material-ui/core/Dialog";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import FullscreenIcon from "@material-ui/icons/Fullscreen";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import config from "./../../../config.json";
import { makeStyles } from "@material-ui/core/styles";
import { DataContext } from "./../../global/Data";
import Plot from "./Plot";

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
    boxShadow: "none",
    backgroundColor: theme.palette.background.default,
  },
  container: {
    backgroundColor: theme.palette.background.default,
  },
}));

export default function PlotsFullscreen(props) {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();
  const dataContext = React.useContext(DataContext);

  const handleClick = () => {
    setOpen(!open);
  };

  return (
    <Hidden mdDown>
      {/* Fullscreen Button */}
      <Grid container justify="flex-end" alignItems="flex-start">
        <Button
          startIcon={<FullscreenIcon />}
          onClick={handleClick}
          color="primary"
          edge="end"
        >
          Fullscreen
        </Button>
      </Grid>

      {/* Fullscreen Content */}
      <Dialog fullScreen open={open} onClose={handleClick}>
        <AppBar className={classes.appBar} variant="dense">
          <Toolbar>
            <IconButton edge="start" color="primary" onClick={handleClick}>
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <Grid container justify="space-around" className={classes.container}>
          {Object.keys(config["data.star"]).map((key) => {
            return (
              <Grid item xs={4} key={key}>
                <Box m={1} >
                  <Plot
                    attr={props.calculateData(key)}
                    title={config["data.star"][key].name}
                    counter={dataContext.counter}
                    color={config["data.star"][key].plot}
                  />
                </Box>
              </Grid>
            );
          })}
        </Grid>
      </Dialog>
    </Hidden>
  );
}
