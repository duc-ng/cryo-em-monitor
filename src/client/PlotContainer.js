import React, { Fragment } from "react";
import config from "./../config.json";
import Grid from "@material-ui/core/Grid";
import Plot from "./Plot";
import Slider from "@material-ui/core/Slider";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { Divider } from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";
import { blue } from "@material-ui/core/colors";

export default function Plots(props) {
  //data
  const calculateData = (index) => {
    return {
      x: filterValues(config["times.star"][0]),
      y: filterValues(config["data.star"][index].value),
      info: filterValues(config["data.star"][index].info),
    };
  };

  const filterValues = (key) => {
    return props.data
      .filter((item) => {
        return timeIsValid(new Date(item[config["times.star"][0]]));
      })
      .map((item) => {
        return item[key];
      });
  };

  const timeIsValid = (objDate) => {
    let delta = new Date() - objDate;
    return (
      delta > convertInHours(time[0]) * 60 * 60 * 1000 &&
      delta < convertInHours(time[1]) * 60 * 60 * 1000
    );
  };

  //slider
  const [time, setTime] = React.useState([1, 5]);
  const [revision, setRevision] = React.useState(0);

  const handleValueLabel = (x) => {
    return marks.filter((item) => {
      return item.value === x;
    })[0].label;
  };

  const handleSliderChange = (event, newValue) => {
    setTime(newValue);
    setRevision(revision + 1);
  };

  const convertInHours = (value) => {
    switch (value) {
      case 1:
        return 0;
      case 2:
        return 3;
      case 3:
        return 6;
      case 4:
        return 12;
      case 5:
        return 238183212; //TODO: change to correct number
      case 6:
        return 48;
      case 7:
        return 72;
      case 8:
        return 168;
      case 9:
        return 336;
      default:
        return 0;
    }
  };

  const marks = [
    {
      value: 1,
      label: "Now",
    },
    {
      value: 2,
      label: "3h",
    },
    {
      value: 3,
      label: "6h",
    },
    {
      value: 4,
      label: "12h",
    },
    {
      value: 5,
      label: "1d",
    },
    {
      value: 6,
      label: "2d",
    },
    {
      value: 7,
      label: "3d",
    },
    {
      value: 8,
      label: "7d",
    },
    {
      value: 9,
      label: "14d",
    },
  ];

  //render
  return (
    <Fragment>
      <Typography variant="subtitle1" gutterBottom>
        Plots
      </Typography>
      <Divider light={true} variant={"middle"} />
      <Box p={3}>
        <Grid container direction="row" justify="center">
          <Grid item xs={1}>
            <Grid container justify="center">
              <FilterListIcon  style={{ color: blue[800] }} />
            </Grid>
          </Grid>
          <Grid item xs={10} sm={8} lg={5}>
            <Slider
              aria-labelledby="discrete-slider-custom"
              step={1}
              valueLabelDisplay="auto"
              valueLabelFormat={handleValueLabel}
              value={time}
              marks={marks}
              min={1}
              max={9}
              onChange={handleSliderChange}
              style={{ color: blue[800] }}
            />
          </Grid>
        </Grid>
      </Box>

      <Grid container justify="center" spacing={2}>
        {Object.keys(config["data.star"]).map((key) => {
          return (
            <Grid item xs={11} md={6} key={key}>
              <Plot
                attr={calculateData(key)}
                title={config["data.star"][key].name}
                counter={props.counter}
                counter2={revision}
              />
            </Grid>
          );
        })}
      </Grid>
    </Fragment>
  );
}
