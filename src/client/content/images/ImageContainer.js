import React from "react";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import SmallDivider from "./../../utils/SmallDivider";
import config from "./../../../config.json";
import ImageViewer from "./../../utils/ImageViewer";
import { DataContext } from "./../../global/Data";

const useStyles = makeStyles((theme) => ({
  paper: {
    width: "100%",
  },
}));

//main
export default function ImageContainer(props) {
  const classes = useStyles();
  const theme = useTheme();
  const { data } = React.useContext(DataContext);
  const item = data[data.length - 1];

  return (
    <React.Fragment>
      <Grid container justify="center">
        <div id="section_images" />
        <Paper className={classes.paper}>
          <Box m={2}>
            <Typography
              variant="body1"
              style={{ color: theme.palette.warning.main }}
            >
              Images
            </Typography>
            <Typography
              variant="body2"
              gutterBottom
              color="textSecondary"
              paragraph={true}
            >
              Most recent images recorded
            </Typography>
            <Grid container spacing={2} justify="center">
              {config["images.star"].map((x, i) => (
                <Grid item xs={4} sm={3} key={i}>
                  <ImageViewer i={i} item={item} />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Paper>
      </Grid>
      <SmallDivider />
    </React.Fragment>
  );
}
