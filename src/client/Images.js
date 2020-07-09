import React, { Fragment } from "react";
import Zoom from "react-medium-image-zoom";
import "react-medium-image-zoom/dist/styles.css";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import { blueGrey } from "@material-ui/core/colors";

// const Images = () => (
//   <Fragment>

//     <Zoom>
//       <img alt="that wanaka tree" src="./example.png" width="200" />
//     </Zoom>
//     <Zoom>
//       <img alt="that wanaka tree" src="./example.png" width="200" />
//     </Zoom>
//   </Fragment>
// );

// export default Images;

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
  content: {
    //backgroundColor: blueGrey[50],
  },
});

const transparentStyles = makeStyles({
  root: {
    maxWidth: 345,
    boxShadow: "none",
    borderRadius: 0,
  },
  media: {
    height: 140,
  },
  content: {
    backgroundColor: blueGrey[50],
  },
});

export default function Images(props) {
  var classes = useStyles();
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
            <Card className={classes.root}>
              <CardMedia className={classes.content}>
                <Zoom zoomMargin={40}>
                  <img alt="that wanaka tree" src={item.data} width="100%" />
                </Zoom>
              </CardMedia>

              <CardContent className={classes.content}>
                <Typography variant="body2" color="textSecondary" component="p">
                  {item.label}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Fragment>
    );
  }
}
