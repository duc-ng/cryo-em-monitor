import React from "react";
import { DataContext } from "./../../global/Data";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import config from "./../../../config.json";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import "./imageGallery.css";
import IconButton from "@material-ui/core/IconButton";
import KeyboardArrowLeftIcon from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import PauseIcon from "@material-ui/icons/Pause";
import moment from "moment";

const useStyles = makeStyles((theme) => ({
  container: {
    // backgroundColor: "transparent",
  },
  white: {
    color: theme.palette.common.white,
  },
}));

export default function ImageSelector(props) {
  const dataContext = React.useContext(DataContext);
  const classes = useStyles();
  const [ref, setRef] = React.useState(undefined);
  const [currentIndex, setCurrentIndex] = React.useState(0);

  const renderLeftNav = (onClick, disabled) => {
    return (
      <IconButton disabled={disabled} onClick={onClick}>
        {disabled ? (
          <KeyboardArrowLeftIcon />
        ) : (
          <KeyboardArrowLeftIcon className={classes.white} />
        )}
      </IconButton>
    );
  };

  const renderRightNav = (onClick, disabled) => {
    return (
      <IconButton disabled={disabled} onClick={onClick}>
        {disabled ? (
          <KeyboardArrowRightIcon />
        ) : (
          <KeyboardArrowRightIcon className={classes.white} />
        )}
      </IconButton>
    );
  };

  const renderPlayPauseButton = (onClick, isPlaying) => {
    return (
      <IconButton onClick={onClick}>
        {isPlaying ? (
          <PauseIcon fontSize="small" color="primary" />
        ) : (
          <PlayArrowIcon fontSize="small" className={classes.white} />
        )}
      </IconButton>
    );
  };

  // const handleSkipPrevious = () => {
  //   ref.slideToIndex(0);
  // };

  const handleSlide = () => {
    setCurrentIndex(ref.getCurrentIndex());
  };

  const handleRef = (i) => {
    setRef(i);
  };

  //get image urls
  const baseurl =
    "http://" +
    config.app.api_host +
    ":" +
    config.app.api_port +
    "/image";

  var images = dataContext.data
    .map((item) => ({
      original:
        baseurl +
        "?key=" +
        item[config.key] +
        "&filename=" +
        item[config["images.star"][props.i].file] +
        "&microscope=" +
        dataContext.microscope,
      text: item[config["times.star"].main], //own usage
    }))
    .reverse();

  return (
    <Box className={classes.container}>
      <Grid container justify="center" alignItems="center">
        <Grid item xs={2}>
          <Typography
            variant="subtitle1"
            paragraph={true}
            className={classes.white}
          >
            {images[currentIndex] !== undefined
              ? moment(images[currentIndex].text).calendar()
              : "undefined"}
          </Typography>
        </Grid>
        <Grid item xs={10}>
          <ImageGallery
            items={images}
            ref={handleRef}
            infinite={false}
            showThumbnails={false}
            showFullscreenButton={false}
            startIndex={currentIndex}
            showIndex={true}
            lazyLoad={true}
            slideDuration={0}
            showPlayButton={true}
            renderLeftNav={renderLeftNav}
            renderRightNav={renderRightNav}
            renderPlayPauseButton={renderPlayPauseButton}
            slideInterval={300}
            onSlide={handleSlide}
          />
        </Grid>
      </Grid>

      {/* <IconButton onClick={handleSkipPrevious}>
          <SkipPreviousIcon fontSize="small" color="primary" />
        </IconButton> */}
    </Box>
  );
}
