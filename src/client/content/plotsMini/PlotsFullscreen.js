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

const useStyles = makeStyles((theme) => ({
  appBar: {
    position: "relative",
    boxShadow: "none",
    backgroundColor: theme.palette.background.default,
  },
  container: {
    backgroundColor: theme.palette.background.default,
  },
  button: {
    color: theme.palette.text.secondary,
  },
}));

export default function PlotsFullscreen(props) {
  const [open, setOpen] = React.useState(false);
  const classes = useStyles();

  const handleClick = () => {
    setOpen(!open);
  };

  const MiniPlot = props.miniPlot

  return (
    <Hidden mdDown>
      {/* Fullscreen Button */}
      <Grid container justify="flex-end" alignItems="flex-start">
        <Button
          className={classes.button}
          endIcon={<FullscreenIcon />}
          onClick={handleClick}
          edge="end"
          size="small"
        >
          Fullscreen
        </Button>
      </Grid>
      {/*  Fullscreen Content  */}
      {open ? (
        <Dialog fullScreen open={open} onClose={handleClick}>
          <AppBar className={classes.appBar}>
            <Toolbar variant="dense">
              <IconButton edge="start" color="primary" onClick={handleClick}>
                <CloseIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <Grid container justify="center" className={classes.container}>
            {config["data.star"].map((x, i) => (
              <Grid xs={4} key={i}>
                <Box m={1}>
                  <MiniPlot x={x} i={i} />
                </Box>
              </Grid>
            ))}
          </Grid>
        </Dialog>
      ) : (
        <div />
      )}
    </Hidden>
  );
}
