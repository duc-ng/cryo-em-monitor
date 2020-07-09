import React, { Fragment } from "react";
import Card from "./Card";
import Grid from "@material-ui/core/Grid";
import { blue, green, red } from "@material-ui/core/colors";
import Divider from "@material-ui/core/Divider";
import Slider from "@material-ui/core/Slider";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import config from "./../config.json";

export default function Activity(props) {
  //data
  const calculateData = (index) => {
    let label = config["times.star"][index];
    var filtered = props.data.filter((item) => {
      return (
        item[label] !== 0 &&
        item[label] !== undefined &&
        ageIsValid(new Date(item[label]))
      );
    });
    return filtered.length;
  };

  const ageIsValid = (objDate) => {
    let delta = new Date() - objDate;
    if (hours[1] === 2) return true; //TODO: remove this line
    return (
      delta > hours[0] * 60 * 60 * 1000 && delta < hours[1] * 60 * 60 * 1000
    );
  };

  //slider
  const [hours, setHours] = React.useState([0, 2]);

  const handleSliderChange = (event, newValue) => {
    setHours(newValue);
  };

  const marks = [
    {
      value: 0,
      label: "Now",
    },
    {
      value: 1,
      label: "1h",
    },
    {
      value: 2,
      label: "2h",
    },
    {
      value: 3,
      label: "3h",
    },
    {
      value: 4,
      label: "4h",
    },
  ];

  const handleValueLabel = (x) => {
    return marks.filter((item) => {
      return item.value === x;
    })[0].label;
  };

  //render
  return (
    <Fragment>
      <Typography variant="subtitle1" gutterBottom>
        Status
      </Typography>
      <Divider light={true} variant={"middle"} />
      <Box pt={3} pb={2}>
        <Grid container spacing={2} justify="center">
          <Grid item xs={4} md={2}>
            <Card
              name={"Images acquired"}
              value={calculateData(0)}
              icon={1}
              color={blue[700]}
            />
          </Grid>
          <Grid item xs={4} md={2}>
            <Card
              name={"Images imported"}
              value={calculateData(1)}
              icon={2}
              color={blue[700]}
            />
          </Grid>
          <Grid item xs={4} md={2}>
            <Card
              name={"Images processed"}
              value={calculateData(2)}
              icon={3}
              color={blue[700]}
            />
          </Grid>
          <Grid item xs={4} md={2}>
            <Card
              name={"Images exported"}
              value={calculateData(3)}
              icon={4}
              color={green[400]}
            />
          </Grid>
          <Divider orientation="vertical" flexItem />
          <Grid item xs={4} md={2}>
            <Card
              name={"Processing errors"}
              value={calculateData(4)}
              icon={5}
              color={red[400]}
            />
          </Grid>
          <Grid item xs={1}>
            <Slider
              orientation="vertical"
              aria-labelledby="discrete-slider-custom"
              step={1}
              valueLabelDisplay="auto"
              valueLabelFormat={handleValueLabel}
              value={hours}
              marks={marks}
              min={0}
              max={4}
              onChange={handleSliderChange}
              style={{ color: blue[800] }}
            />
          </Grid>
        </Grid>
      </Box>
    </Fragment>
  );
}
