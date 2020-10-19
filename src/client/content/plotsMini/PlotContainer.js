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
    const yName = config["data.star"][index].value;
    const { minOptimum, maxOptimum } = config["data.star"][index].plot;

    const filterValues = (isTrace1, isX) => {
      return dataContext.data
        .filter((item) => {
          return item[yName] !== undefined;
        })
        .filter((item) => {
          const cond = item[yName] >= minOptimum && item[yName] <= maxOptimum;
          return isTrace1 ? cond : !cond;
        })
        .map((item) => {
          return isX ? item[config["times.star"].main] : item[yName];
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
        {Object.keys(config["data.star"]).map((key) => {
          return (
            <Grid item xs={12} sm={6} key={key}>
              <PlotMini
                attr={calculateData(key)}
                title={config["data.star"][key].name}
              />
            </Grid>
          );
        })}
      </Grid>
      <SmallDivider />
    </React.Fragment>
  );
}
