import React from "react";
import { DataContext } from "./../global/Data";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import CloseIcon from "@material-ui/icons/Close";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import StopIcon from "@material-ui/icons/Stop";
import PauseIcon from "@material-ui/icons/Pause";
import config from "./../../config.json";
import Paper from "@material-ui/core/Card";
import Typography from "@material-ui/core/Typography";

const useStyles = makeStyles((theme) => ({
  box: {
    paddingTop: "47%",
    paddingBottom: "47%",
    width: "100%",
    borderColor: theme.palette.divider,
  },
  img: {
    width: "100%",
  },
  appBar: {
    position: "relative",
    backgroundColor: "transparent",
    boxShadow: "none",
  },
  paper: {
    padding: 5,
  },
  white: {
    color: theme.palette.common.white,
  },
}));

export default function ImageFullscreen(props) {
  const { data, microscope } = React.useContext(DataContext);
  const classes = useStyles();
  const [image, setImage] = React.useState(props.img);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const getInitIndex = () => {
    return data.length === 0
      ? 0
      : data.findIndex((elem) => elem[config.key] === props.item[config.key]);
  };

  const [currentIndex, setIndex] = React.useState(getInitIndex());

  const loadImage = (ind) => {
    if (data[ind] !== undefined) {
      const key = data[ind][config.key];
      fetch(
        "http://" +
          config.app.api_host +
          ":" +
          config.app.api_port +
          "/image?key=" +
          key +
          "&type=" +
          props.i +
          "&microscope=" +
          microscope
      )
        .then((res) => res.json())
        .then((res) => setImage(res));
    }
  };

  const onPrevImage = () => {
    const ind = currentIndex === 0 ? 0 : (currentIndex + 1) % data.length;
    setIndex(ind);
    loadImage(ind);
  };

  const onNextImage = () => {
    const ind =
      currentIndex === 0 ? 0 : (currentIndex - 1 + data.length) % data.length;
    setIndex(ind);
    loadImage(ind);
  };

  const onReset = () => {
    setIsPlaying(false);
    setButtonPlay(
      <IconButton onClick={onPlay}>
        <PlayArrowIcon fontSize="small" className={classes.white} />
      </IconButton>
    );
    const ind = getInitIndex();
    setIndex(ind);
    loadImage(ind);
  };

  const onPlay = () => {
    setIsPlaying(true);
    setButtonPlay(
      <IconButton onClick={onPause}>
        <PauseIcon fontSize="small" color="primary" />
      </IconButton>
    );
  };

  const [ButtonPlay, setButtonPlay] = React.useState(
    <IconButton onClick={onPlay}>
      <PlayArrowIcon fontSize="small" className={classes.white} />
    </IconButton>
  );

  const onPause = () => {
    setIsPlaying(false);
    setButtonPlay(
      <IconButton onClick={onPlay}>
        <PlayArrowIcon fontSize="small" />
      </IconButton>
    );
  };

  React.useEffect(() => {
    if (isPlaying) {
      var interval = setInterval(onNextImage, 500);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  });

  const ButtonPrevImage = () => (
    <IconButton onClick={onPrevImage}>
      <KeyboardArrowLeftIcon fontSize="large" className={classes.white} />
    </IconButton>
  );

  const ButtonNextImage = () => (
    <IconButton onClick={onNextImage}>
      <KeyboardArrowRightIcon fontSize="large" className={classes.white} />
    </IconButton>
  );

  const ButtonReset = () => (
    <IconButton onClick={onReset}>
      <StopIcon fontSize="small" className={classes.white} />
    </IconButton>
  );

  return (
    <React.Fragment>
      <AppBar className={classes.appBar}>
        <Toolbar>
          <Grid container justify="flex-end">
            <IconButton color="inherit" onClick={props.handleOpen}>
              <CloseIcon />
            </IconButton>
          </Grid>
        </Toolbar>
      </AppBar>
      <Grid container justify="center">
        <Grid item xs={11} sm={9} lg={7}>
          <Grid container justify="space-around" alignItems="center">
            <Grid item xs={12}>
              <Grid container justify="center">
                <Grid item>
                  <Typography variant="subtitle1" className={classes.white}>
                    {image.info}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12}>
              <Grid container justify="center">
                <Grid item>
                  <Typography variant="subtitle1" className={classes.white}>
                    {image.data === undefined
                      ? ""
                      : data[currentIndex][config["times.star"][0].value]}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={2}>
              <Grid container justify="center">
                <ButtonPrevImage />
              </Grid>
            </Grid>
            <Grid item xs={8}>
              {image.data === undefined ? (
                <div>
                  <Box m={6} /> {/* padding */}
                  <Box border={1} className={classes.box}>
                    <Grid container justify="center">
                      <Typography variant="subtitle1" className={classes.white}>
                        No Image
                      </Typography>
                    </Grid>
                  </Box>
                </div>
              ) : (
                <img
                  className={classes.img}
                  src={image.data}
                  alt={image.info}
                />
              )}
            </Grid>
            <Grid item xs={2}>
              <Grid container justify="center">
                <ButtonNextImage />
              </Grid>
            </Grid>
            <Grid item>
              <ButtonReset />
              {ButtonPlay}
            </Grid>
            <Grid item>
              <Paper className={classes.paper}>
                {data.length - currentIndex + "/ " + data.length}
              </Paper>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
