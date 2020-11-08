import React from "react";
import Plot from "react-plotly.js";
import SmallDivider from "./../../utils/SmallDivider";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import { useTheme } from "@material-ui/core/styles";
import { DataContext } from "./../../global/Data";
import config from "./../../../config.json";

export default function PlotMain() {
  const theme = useTheme();
  const dataContext = React.useContext(DataContext);
  var minDate = dataContext.dateFrom;
  const maxDate =
    dataContext.dateTo === undefined ? new Date() : dataContext.dateTo;

  const getData = (plotNr) => {
    let allData = [];
    for (let i = 0; i < dataContext.data.length; i++) {
      let date = dataContext.data[i][config["times.star"][plotNr].value];

      if (date !== 0) {
        allData = [...allData, date];
        if (minDate === undefined || new Date(date) < new Date(minDate)) {
          minDate = date;
        }
      }
    }
    return allData;
  };

  // data<=4h => 10min bins
  // data<=4d => 1h bins
  // else 1d bins
  const getBinSize = () => {
    const diff = new Date(maxDate) - new Date(minDate);
    if (diff <= 14400000) {
      return 600000;
    } else if (diff <= 345600000) {
      return 3600000;
    } else {
      return 86400000;
    }
  };

  const data = [
    {
      x: getData(0),
      type: "histogram",
      mode: "lines",
      marker: { color: theme.palette.info.light },
      xbins: {
        size: getBinSize(),
      },
    },
  ];

  const updatemenus = [
    {
      buttons: config["times.star"].map((x, i) => {
        return {
          args: ["x", [getData(i)]],
          label: config["times.star"][i].label,
          method: "restyle",
        };
      }),
      showactive: true,
      active: 0,
      type: "dropdown",
      x: 1,
      y: 1.43,
      yref: "paper",
      font: {
        color: theme.palette.primary.main,
        size: 15,
      },
      bgcolor: theme.palette.background.paper,
      bordercolor: "rgba(0,0,0,0)",
    },
  ];

  const layout = {
    autosize: true,
    height: 270,
    title: {
      text: "Volume",
      x: 0,
      xref: "container",
      pad: {
        l: 17,
      },
    },
    margin: {
      t: 80,
      b: 50,
      l: 40,
      r: 40,
    },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    updatemenus: updatemenus,
    bargap: 0.01,
    font: {
      family: theme.typography.fontFamily,
      color: theme.palette.text.primary,
    },
    titlefont: {
      size: 15,
      color: theme.palette.warning.main,
    },
    xaxis: {
      type: "date",
      range: [minDate, maxDate],
      gridcolor: theme.palette.divider,
      linecolor: theme.palette.divider,
    },
    yaxis: {
      rangemode: "tozero",
      gridcolor: theme.palette.divider,
      linecolor: theme.palette.divider,
    },
  };

  const configuration = {
    displayModeBar: false,
  };

  const style = {
    width: "100%",
  };

  console.log("Updated: plot main");
  return (
    <Grid container>
      <Grid item xs={12}>
        <div id="section_volume" />
        {dataContext.data.length !== 0 ? (
          <Paper>
            <Plot
              data={data}
              layout={layout}
              config={configuration}
              style={style}
            />
          </Paper>
        ) : (
          <Paper style={{ height: layout.height }}>
            <Grid
              container
              justify="center"
              alignItems="center"
              style={{ height: "100%" }}
            >
              No Data
            </Grid>
          </Paper>
        )}
        <SmallDivider />
      </Grid>
    </Grid>
  );
}
