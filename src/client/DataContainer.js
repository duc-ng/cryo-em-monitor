import React, { Fragment, useState, useEffect } from "react";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import { Divider } from "@material-ui/core";
import Table from "./content/table/Table.js";
import Grid from "@material-ui/core/Grid";
import Images from "./Images";
import config from "./../config.json";

export default function DataContainer(props) {
  //init
  const [recentImages, setRecentImages] = useState([]);
  const [imageKeys, setImageKeys] = useState([]);

  useEffect(() => {


    //fetch most recent images
    let key = tableData.reduce((l, e) => {
      let delta = l.data._mmsdateAuqired_Value - l.data._mmsdateAuqired_Value;
      return delta > 0 ? l : e;
    }).key;

    fetch("http://localhost:5000/imagesAPI?key=" + key)
      .then((response) => response.json())
      .then((res) => setRecentImages(res));

    //calc last 20 keys
    setImageKeys(props.data
      .slice(Math.max(props.data.length - 20, 0))
      .map((x)=> {return {"key": x[config.key],"data":[]}}))

  }, [props.data]);

  //render
  return (
    <Fragment>

      {/* Thumbnails */}
      <Typography variant="subtitle1" gutterBottom>
        Thumbnails
      </Typography>
      <Divider light={true} variant={"middle"} />
      <Box pt={3} pb={2}>
        <Grid container spacing={2} justify="center">
          <Grid item xs={11}>
            <Grid container spacing={2} justify="center">
              <Images attr={recentImages} imgKeys={imageKeys} xs={4} sm={3} md={3} />
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Fragment>
  );
}
