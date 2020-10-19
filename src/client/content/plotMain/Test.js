import React from "react";
import Plot from "react-plotly.js";
import SmallDivider from "./../../utils/SmallDivider";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";
import Grid from "@material-ui/core/Grid";
import { useTheme } from "@material-ui/core/styles";
import { DataContext } from "./../../global/Data";
import config from "./../../../config.json";

export default function PlotMain() {
  const theme = useTheme();
  const dataContext = React.useContext(DataContext);

  const dataRaw = ["main", "1", "2", "3", "4"].map((k) =>
    dataContext.data
      .map((item) => item[config["times.star"][k]])
      .filter((item) => item !== 0)
  );

  const data = [
    {
      x: dataRaw[0],
      type: "histogram",
      mode: "lines",
      marker: { color: theme.palette.info.light },
      xbins: {
        size: 10000,
      },
      hoverinfo: "y",
    },
  ];

  const updatemenus = [
    {
      buttons: [
        {
          args: ["x", [dataRaw[0]]],
          label: "Images acquired",
          method: "restyle",
        },
        {
          args: ["x", [dataRaw[1]]],
          label: "Images imported",
          method: "restyle",
        },
        {
          args: ["x", [dataRaw[2]]],
          label: "Images processed",
          method: "restyle",
        },
        {
          args: ["x", [dataRaw[3]]],
          label: "Images exported",
          method: "restyle",
        },
        {
          args: ["x", [dataRaw[4]]],
          label: "Processing errors",
          method: "restyle",
        },
      ],
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
    hovermode: "closest",
    updatemenus: updatemenus,
    bargap: 0.02,
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
      showgrid: false,
      rangemode: "tozero",
    },
    yaxis: {
      rangemode: "tozero",
      showgrid: false,
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
              <CircularProgress color="primary" />
            </Grid>
          </Paper>
        )}
        <SmallDivider />
      </Grid>
    </Grid>
  );
}
