import React from "react";
import config from "./../../../config.json";
import Grid from "@material-ui/core/Grid";
import Plot from "./Plot";
import SmallDivider from "./../../utils/SmallDivider";
import { DataContext } from "./../../global/Data";
import PlotsFullscreen from "./PlotsFullscreen";

export default function Plots(props) {
  const dataContext = React.useContext(DataContext);

  //clean data
  const calculateData = (index) => {
    return {
      x: dataContext.data.map((item) => item[config["times.star"].main]),
      y: dataContext.data.map((item) => item[config["data.star"][index].value]),
      info: dataContext.data.map(
        (item) => item[config["data.star"][index].value]
      ),
    };
  };

  //render
  return (
    <React.Fragment>
      <PlotsFullscreen calculateData={calculateData} />
      <Grid container justify="center" spacing={2}>
        {Object.keys(config["data.star"]).map((key) => {
          return (
            <Grid item xs={12} sm={6} key={key}>
              <Plot
                attr={calculateData(key)}
                title={config["data.star"][key].name}
                counter={dataContext.counter}
                color={config["data.star"][key].plot}
              />
            </Grid>
          );
        })}
      </Grid>
      <SmallDivider />
    </React.Fragment>
  );
}
