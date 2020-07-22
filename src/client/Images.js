import React, { Fragment } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import { makeStyles, useTheme } from '@material-ui/core/styles';
import { blueGrey } from "@material-ui/core/colors";
import MobileStepper from '@material-ui/core/MobileStepper';
import Button from '@material-ui/core/Button';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 400,
    flexGrow: 1,
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    height: 50,
    paddingLeft: theme.spacing(2),
    backgroundColor: theme.palette.background.default,
  },
  img: {
    maxHeight: 255,
    //maxWidth: 255,
    overflow: 'hidden',
    display: 'block',
    width: '100%',
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



}


export default function Images(props) {
  const classes = useStyles();
  const theme = useTheme();
  const [activeStep, setActiveStep] = React.useState(4);
  const maxSteps = tutorialSteps.length;

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  if (props.color === "transparent") {
    classes = transparentStyles();
  }
  if (props.attr.length === 0) {
    return <div />;
  } else {
    return (
      <Fragment>
        {props.attr.map((item, i) => (
          <Grid item key={i} xs={props.xs} sm={props.sm} md={props.md}>
            {/* <Card className={classes.root}>
              <CardMedia className={classes.content}>
                <Zoom zoomMargin={40}>
                  <img alt="image" src={item.data} width="100%" />
                </Zoom>
              </CardMedia>
              <CardContent className={classes.content}>
                <Typography variant="body2" color="textSecondary" component="p">
                  {item.label}
                </Typography>
              </CardContent>
            </Card> */}
            <div className={classes.root}>
              <Paper square elevation={0} className={classes.header}>
                <Typography variant="caption">{item.label}</Typography>
              </Paper>
              <Zoom zoomMargin={40} wrapStyle={{"display": "block"}}>
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
                  <Button
                    size="small"
                    onClick={handleBack}
                    disabled={activeStep === 0}
                  >
                    {theme.direction === "rtl" ? (
                      <KeyboardArrowRight />
                    ) : (
                      <KeyboardArrowLeft />
                    )}
                  </Button>
                }
              />
            </div>
          </Grid>
        ))}
      </Fragment>
    );
  }
}
