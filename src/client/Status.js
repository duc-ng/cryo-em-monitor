import React, { Fragment } from "react";
import Card from "./Card";
import Grid from "@material-ui/core/Grid";
import { blue, green, red } from "@material-ui/core/colors";
import Divider from '@material-ui/core/Divider';

export default function Activity(props) {
  return (
    <Fragment>
      <Grid item xs={4} md={2}>
        <Card name={"Images acquired"} value={props.values[1]} icon={1} color={blue[700]} />
      </Grid>
      <Grid item xs={4} md={2}>
        <Card name={"Images imported"} value={props.values[2]} icon={2} color={blue[700]} />
      </Grid>
      <Grid item xs={4} md={2}>
        <Card name={"Images processed"} value={props.values[3]} icon={3} color={blue[700]} />
      </Grid>
      <Grid item xs={5} md={2}>
        <Card name={"Images exported"} value={props.values[4]} icon={4} color={green[400]} />
      </Grid>
      <Divider orientation="vertical" flexItem />
      <Grid item xs={5} md={2}>
        <Card name={"Processing errors"} value={props.values[5]} icon={5} color={red[400]} />
      </Grid>
    </Fragment>
  );
}
