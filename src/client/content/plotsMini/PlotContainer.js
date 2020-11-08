import React from "react";
import config from "./../../../config.json";
import Grid from "@material-ui/core/Grid";
import PlotMini from "./PlotMini";
import SmallDivider from "./../../utils/SmallDivider";
import { DataContext } from "./../../global/Data";
import PlotsFullscreen from "./PlotsFullscreen";

export default function PlotContainer(props) {
  const dataContext = React.useContext(DataContext);

  //clean data
  const calculateData = (index) => {
    const { minOptimum, maxOptimum, value } = config["data.star"][index];

    const filterValues = (isTrace1, isX) => {
      return dataContext.data
        .filter((item) => {
          return item[value] !== undefined;
        })
        .filter((item) => {
          const cond = item[value] >= minOptimum && item[value] <= maxOptimum;
          return isTrace1 ? cond : !cond;
        })
        .map((item) => {
          return isX ? item[config["times.star"][0].value] : item[value];
        });
    };

    return {
      trace1: {
        x: filterValues(true, true),
        y: filterValues(true, false),
      },
      trace2: {
        x: filterValues(false, true),
        y: filterValues(false, false),
      },
    };
  };

  //render
  return (
    <React.Fragment>
      <PlotsFullscreen calculateData={calculateData} />
      <Grid container justify="center" spacing={2}>
        <div id="section_plots" />
        {config["data.star"].map((x, i) => {
          return (
            <Grid item xs={12} sm={6} key={i}>
              <PlotMini
                attr={calculateData(i)}
                title={config["data.star"][i].label}
              />
            </Grid>
          );
        })}
      </Grid>
      <SmallDivider />
    </React.Fragment>
  );
}
