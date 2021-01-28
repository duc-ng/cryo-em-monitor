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
import config from "./../../../config.json";
import { makeStyles } from "@material-ui/core/styles";
import { DataContext } from "./../../global/Data";

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
  const { refresh } = React.useContext(DataContext);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    refresh(); //less Webgl contexts for plotly
  };

  const { MiniPlot, setRevision, plotData,revision } = props;

  return (
    <Hidden mdDown>
      {/* Fullscreen Button */}
      <Grid container justify="flex-end" alignItems="flex-start">
        <Button
          className={classes.button}
          endIcon={<FullscreenIcon />}
          onClick={handleOpen}
          edge="end"
          size="small"
        >
          Fullscreen
        </Button>
      </Grid>
      {/*  Fullscreen Content  */}
      {open ? (
        <Dialog fullScreen open={open}>
          <AppBar className={classes.appBar}>
            <Toolbar variant="dense">
              <IconButton edge="start" color="primary" onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Toolbar>
          </AppBar>
          <Grid
            container
            justify="center"
            spacing={2}
            className={classes.container}
          >
            {config["data.star"].map((x, i) => (
              <Grid item xs={4} key={i}>
                <MiniPlot
                  i={i}
                  percentPlotted={100}
                  setRevision={setRevision}
                  revision={revision}
                  xValues1={plotData[i].xValues1}
                  xValues2={plotData[i].xValues2}
                  yValues1={plotData[i].yValues1}
                  yValues2={plotData[i].yValues2}
                  range={plotData[i].range}
                  nrOutliers={plotData[i].nrOutliers}
                />
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
