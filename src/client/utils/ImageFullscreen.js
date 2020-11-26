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
import FormatDate from "./FormatDate";
import Hidden from "@material-ui/core/Hidden";

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
  pause: {
    color: theme.palette.warning.main,
  },
}));

export default function ImageFullscreen(props) {
  const { data, microscope } = React.useContext(DataContext);
  const classes = useStyles();
  const [image, setImage] = React.useState(props.img);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const [currentIndex, setIndex] = React.useState(
    data.length === 0
      ? 0
      : data.findIndex((elem) => elem[config.key] === props.item[config.key])
  );

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
    const ind = data.length === 0 ? 0 : (currentIndex + 1) % data.length;
    setIndex(ind);
    loadImage(ind);
  };

  const onNextImage = () => {
    const ind =
      data.length === 0 ? 0 : (currentIndex - 1 + data.length) % data.length;
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
    const ind =
      data.length === 0
        ? 0
        : data.findIndex((elem) => elem[config.key] === props.item[config.key]);
    setIndex(ind);
    loadImage(ind);
  };

  const onPlay = () => {
    setIsPlaying(true);
    setButtonPlay(
      <IconButton onClick={onPause}>
        <PauseIcon fontSize="small" className={classes.pause} />
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

  const ButtonReset = () => (
    <IconButton onClick={onReset}>
      <StopIcon fontSize="small" className={classes.white} />
    </IconButton>
  );

  const date =
    data.length === 0
      ? 0
      : FormatDate(new Date(data[currentIndex][config["times.star"][0].value]));

  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      onNextImage();
    } else if (e.key === "ArrowLeft") {
      onPrevImage();
    } else if (e.key === " ") {
      isPlaying ? onPause() : onPlay();
    }
  };

  React.useEffect(() => {
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  });

  const TitleMain = () => (
    <Grid item xs={12}>
      <Grid container justify="center">
        <Grid item>
          <Typography variant="h6" className={classes.white}>
            {image.data === undefined ? <Box m={4} /> : image.info}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );

  const TitleSub = () => (
    <Grid item xs={12}>
      <Grid container justify="center">
        <Grid item>
          <Typography variant="subtitle1" className={classes.white}>
            {image.data === undefined ? <Box m={4} /> : date}
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );

  const ArrowLeftDesktop = () => (
    <Grid item xs={0} md={1} lg={2}>
      <Hidden mdDown>
        <Grid container justify="center">
          <IconButton onClick={onPrevImage}>
            <KeyboardArrowLeftIcon fontSize="large" className={classes.white} />
          </IconButton>
        </Grid>
      </Hidden>
    </Grid>
  );

  const ArrowRightDesktop = () => (
    <Grid item xs={0} md={1} lg={2}>
      <Hidden mdDown>
        <Grid container justify="center">
          <IconButton onClick={onNextImage}>
            <KeyboardArrowRightIcon
              fontSize="large"
              className={classes.white}
            />
          </IconButton>
        </Grid>
      </Hidden>
    </Grid>
  );

  const ArrowLeftRightMobile = () => (
    <Hidden lgUp>
      <Grid item>
        <IconButton onClick={onPrevImage} edge="end">
          <KeyboardArrowLeftIcon className={classes.white} />
        </IconButton>
        <IconButton onClick={onNextImage}>
          <KeyboardArrowRightIcon className={classes.white} />
        </IconButton>
      </Grid>
    </Hidden>
  );

  const ImageDisplay = () => (
    <Grid item xs={12} md={10} lg={8}>
      {image.data === undefined ? (
        <div>
          <Box border={1} className={classes.box}>
            <Grid container justify="center">
              <Typography variant="subtitle1" className={classes.white}>
                No Image
              </Typography>
            </Grid>
          </Box>
        </div>
      ) : (
        <img className={classes.img} src={image.data} alt={image.info} />
      )}
    </Grid>
  );

  const PlayReset = () => (
    <Grid item>
      <ButtonReset />
      {ButtonPlay}
    </Grid>
  );

  const ImageCount = () => (
    <Grid item>
      <Paper className={classes.paper}>
        {data.length - currentIndex + "/ " + data.length}
      </Paper>
    </Grid>
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
        <Grid item xs={12} sm={9} lg={7}>
          <Grid container justify="space-around" alignItems="center">
            <TitleMain />
            <TitleSub />
            <ArrowLeftDesktop />
            <ImageDisplay />
            <ArrowRightDesktop />
            <PlayReset />
            <ImageCount />
            <ArrowLeftRightMobile />
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}
