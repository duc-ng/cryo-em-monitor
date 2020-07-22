import React, { Fragment, useEffect } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { blueGrey } from "@material-ui/core/colors";
import MobileStepper from "@material-ui/core/MobileStepper";
import Button from "@material-ui/core/Button";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import Paper from "@material-ui/core/Paper";
import SkipPreviousIcon from "@material-ui/icons/SkipPrevious";
import PlayArrowIcon from "@material-ui/icons/PlayArrow";
import SkipNextIcon from "@material-ui/icons/SkipNext";
import IconButton from "@material-ui/core/IconButton";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 400,
    flexGrow: 1,
  },
  header: {
    display: "flex",
    alignItems: "center",
    height: 50,
    paddingLeft: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
  },
  img: {
    maxHeight: 255,
    //maxWidth: 255,
    overflow: "hidden",
    display: "block",
    width: "100%",
  },
  controls: {
    display: "flex",
    alignItems: "center",
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  playIcon: {
    height: 38,
    width: 38,
  },
  details: {
    display: "flex",
    flexDirection: "column",
  },
  content: {
    flex: "1 0 auto",
  },
}));

const transparentStyles = makeStyles({
  // root: {
  //   maxWidth: 345,
  //   boxShadow: "none",
  //   borderRadius: 0,
  // },
  // media: {
  //   height: 140,
  // },
  // content: {
  //   backgroundColor: blueGrey[50],
  // },
});

const tutorialSteps = [
  {
    label: "San Francisco",
    imgPath:
      "https://images.unsplash.com/photo-1537944434965-cf4679d1a598?auto=format&fit=crop&w=400&h=250&q=60",
  },
  {
    label: "Bird",
    imgPath:
      "https://images.unsplash.com/photo-1538032746644-0212e812a9e7?auto=format&fit=crop&w=400&h=250&q=60",
  },
  {
    label: "Bali, Indonesia",
    imgPath:
      "https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=400&h=250&q=80",
  },
  {
    label: "NeONBRAND Digital Marketing, Las Vegas, United States",
    imgPath:
      "https://images.unsplash.com/photo-1518732714860-b62714ce0c59?auto=format&fit=crop&w=400&h=250&q=60",
  },
  {
    label: "Goč, Serbia",
    imgPath:
      "https://images.unsplash.com/photo-1512341689857-198e7e2f3ca8?auto=format&fit=crop&w=400&h=250&q=60",
  },
];

export function Image(props) {
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(4);
  const maxSteps = tutorialSteps.length;
  const { item } = props;
  const classes = useStyles();

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <div className={classes.root}>
      <Paper square elevation={0} className={classes.header}>
        <Typography variant="caption">{item.label}</Typography>
      </Paper>
      <Zoom zoomMargin={40} wrapStyle={{ display: "block" }}>
        <img className={classes.img} alt={item.label} src={item.data} />
      </Zoom>
      <MobileStepper
        steps={maxSteps}
        position="static"
        variant="progress"
        activeStep={activeStep}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={activeStep === maxSteps - 1}
          >
            {theme.direction === "rtl" ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === "rtl" ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
          </Button>
        }
      />
    </div>
  );
}

export default function Images(props) {
  //update items
  const [items, setItems] = React.useState([]);
  useEffect(() => {
    setItems(props.attr);
  }, [props.attr]);

  const classes = useStyles();
  const theme = useTheme();

  //fetch last image
  // const [images, setImages] = React.useState([]);
  // useEffect(() => {
  //   let temp = props.imgKeys
  //   if(temp.length!==0){
  //     let key = temp[temp.length-1].key
  //     fetch("http://localhost:5000/imagesAPI?key=" + key)
  //       .then((response) => response.json())
  //       .then((res) => {temp[temp.length-1].data=res})
  //       .then(setImages(temp))
  //   }
  // }, [props.imgKeys]);

  // async function fetchData(imgKeys) {
  //   let temp = imgKeys
  //   if(temp.length!==0){
  //     let key = temp[temp.length-1].key

  //   const res = await fetch("http://localhost:5000/imagesAPI?key=" + key)
  //   res
  //     .json()
  //     .then(res => {temp[temp.length-1].data=res})
  //     .then(res => setImages(res))
  //   }
  // // }

  // useEffect(() => {
  //   fetchData(props.imgKeys);
  // }, [props.imgKeys]);

  //return
  if (items.length === 0) {
    return <div />;
  } else {
    // console.log(images)
    // let index = Math.max(images.length-1,0)
    // console.log(images[index].data)
    return (
      <Grid
        container
        direction="row"
        justify="flex-start"
        alignItems="center"
        spacing={2}
      >
        <Grid item xs={props.xs} sm={props.sm} md={props.md}>
          <Card className={classes.root}>
            <div className={classes.details}>
              <CardContent className={classes.content}>
                <Typography component="h5" variant="h5">
                  1/20
                </Typography>
                <Typography variant="subtitle1" color="textSecondary">
                  Last 20 Thumbnails
                </Typography>
              </CardContent>
              <div className={classes.controls}>
                <IconButton aria-label="previous">
                  {theme.direction === "rtl" ? (
                    <SkipNextIcon />
                  ) : (
                    <SkipPreviousIcon />
                  )}
                </IconButton>
                <IconButton aria-label="play/pause">
                  <PlayArrowIcon className={classes.playIcon} />
                </IconButton>
                <IconButton aria-label="next">
                  {theme.direction === "rtl" ? (
                    <SkipPreviousIcon />
                  ) : (
                    <SkipNextIcon />
                  )}
                </IconButton>
              </div>
            </div>
          </Card>
        </Grid>

        {items.map((item, i) => (
          <Grid item key={i} xs={props.xs} sm={props.sm} md={props.md}>
            <Image item={item} />
          </Grid>
        ))}
      </Grid>
    );
  }
}
