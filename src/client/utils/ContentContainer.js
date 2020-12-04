import React from "react";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import SmallDivider from "./SmallDivider";
import { DataContext } from "./../global/Data";
import Fade from "@material-ui/core/Fade";

//main
export default function ContentContainer(props) {
  const { data } = React.useContext(DataContext);
  const id = props.id !== undefined ? props.id : "";
  const title = props.title !== undefined ? props.title : "";
  const subtitle = props.subtitle !== undefined ? props.subtitle : "";
  const button = props.button !== undefined ? props.button() : undefined;
  const height = props.height !== undefined ? props.height : "100%";
  const noData = props.noData === false ? false : true;
  const divider = props.divider === false ? false : true;

  return (
    <React.Fragment>
      <div id={id} />
      <Grid container justify="center">
        <Fade in={true} timeout={1000}>
          <Paper style={{ width: "100%" }}>
            <Box pt={2} px={2}>
              <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="center"
              >
                <Grid item>
                  <Typography
                    variant="subtitle1"
                    // style={{ color: theme.palette.secondary.main }}
                    align="left"
                  >
                    {title}
                  </Typography>
                  <Typography
                    variant="body2"
                    gutterBottom
                    color="textSecondary"
                    paragraph={true}
                    align="left"
                  >
                    {subtitle}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body2" color="textSecondary">
                    {props.midtext}
                  </Typography>
                </Grid>
                <Grid item>{button}</Grid>
              </Grid>
            </Box>
            {data.length === 0 && noData ? (
              <Grid
                container
                justify="center"
                alignItems="center"
                style={{ height: height }}
              >
                <Typography variant="body1">No Data</Typography>
              </Grid>
            ) : (
              props.children
            )}
          </Paper>
        </Fade>
      </Grid>
      {divider ? <SmallDivider /> : <div />}
    </React.Fragment>
  );
}
