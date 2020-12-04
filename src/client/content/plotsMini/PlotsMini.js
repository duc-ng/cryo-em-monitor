import React from "react";
import config from "./../../../config.json";
import Grid from "@material-ui/core/Grid";
import SmallDivider from "./../../utils/SmallDivider";
import { DataContext } from "./../../global/Data";
import PlotsFullscreen from "./PlotsFullscreen";
import ContentContainer from "./../../utils/ContentContainer";
import { useTheme } from "@material-ui/core/styles";
import Plotly from "plotly.js-dist-min";
import createPlotlyComponent from "react-plotly.js/factory";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Typography from "@material-ui/core/Typography";

function PlotsMini() {
  const { data, dateFrom, dateTo } = React.useContext(DataContext);
  const theme = useTheme();

  const minDate =
    dateFrom === undefined
      ? data.length === 0
        ? new Date(0)
        : data[0][config["times.star"][0].value]
      : dateFrom;

  const maxDate = dateTo === undefined ? new Date() : dateTo;

  const MiniPlot = (props) => {
    const [type, setType] = React.useState("scattergl");
    const { minOptimum, maxOptimum, value } = config["data.star"][props.i];
    const subtitle = config["data.star"][props.i].description;
    const maxPointsPlotted = 5000;
    const Plot = createPlotlyComponent(Plotly);

    const percentPlotted = Math.floor((maxPointsPlotted / data.length) * 100);

    const aggregateValue = //plot max. x random values
      type === "scattergl" ? Math.ceil(data.length / maxPointsPlotted) : 1;

    const getPlotData = () => {
      let xValues1 = [];
      let xValues2 = [];
      let yValues1 = [];
      let yValues2 = [];

      for (let i = 0; i < data.length; i = i + aggregateValue) {
        if (data[i][value] >= minOptimum && data[i][value] < maxOptimum) {
          xValues1.push(data[i][config["times.star"][0].value]);
          yValues1.push(data[i][value]);
        } else {
          xValues2.push(data[i][config["times.star"][0].value]);
          yValues2.push(data[i][value]);
        }
      }

      return [
        {
          x: type === "scattergl" ? xValues1 : yValues1,
          y: yValues1,
          opacity: 0.9,
          marker: {
            color: theme.palette.success.main,
          },
          name: "Good",
          mode: "markers",
          type: type,
          hoverinfo: "y",
        },
        {
          x: type === "scattergl" ? xValues2 : yValues2,
          y: yValues2,
          name: "Ok",
          opacity: 0.9,
          marker: {
            color: theme.palette.primary.light,
          },
          mode: "markers",
          type: type,
          hoverinfo: "y",
        },
      ];
    };

    const configuration = {
      displaylogo: false,
      modeBarButtonsToRemove: [
        "toImage",
        "zoom2d",
        "pan2d",
        "select2d",
        "autoScale2d",
        "lasso2d",
        "toggleSpikelines",
        "toggleHover",
        "hoverClosestCartesian",
        "hoverCompareCartesian",
      ],
      responsive: true,
    };

    const style = {
      width: "100%",
    };

    const layout = {
      font: {
        family: theme.typography.fontFamily,
        color: theme.palette.text.primary,
      },
      bargap: 0.02,
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)",
      hovermode: "closest",
      barmode: "stack",
      xaxis: {
        type: type === "scattergl" ? "date" : "",
        zeroline: true,
        gridcolor: theme.palette.divider,
        linecolor: theme.palette.divider,
        range: type === "scattergl" ? [minDate, maxDate] : [],
      },
      yaxis: {
        rangemode: "tozero",
        gridcolor: theme.palette.divider,
        linecolor: theme.palette.divider,
      },
      autosize: true,
      height: 320,
      margin: {
        t: 10,
        b: 55,
        l: 35,
        r: 15,
      },
      modebar: {
        bgcolor: "rgba(0,0,0,0)",
        color: theme.palette.divider,
      },
      legend: {
        x: 0.35,
        y: -0.15,
        orientation: "h",
        font: {
          color: theme.palette.grey[500],
        },
      },
    };

    const SimpleMenu = () => {
      const [button, setButton] = React.useState(0);

      const setScatter = () => {
        setButton(0);
        setType("scattergl");
      };

      const setHistogram = () => {
        setButton(1);
        setType("histogram");
      };

      return (
        <ButtonGroup variant="text">
          <Button onClick={setScatter}>
            <Typography
              variant="body2"
              color={button === 0 ? "primary" : "textSecondary"}
            >
              Scatter
            </Typography>
          </Button>
          <Button onClick={setHistogram}>
            <Typography
              variant="body2"
              color={button === 1 ? "primary" : "textSecondary"}
            >
              Histogram
            </Typography>
          </Button>
        </ButtonGroup>
      );
    };


    return (
      <ContentContainer
        id={"section_images_" + props.i}
        title={props.x.label}
        subtitle={subtitle}
        midtext={percentPlotted < 100 ? percentPlotted + "% plotted" : ""}
        height={layout.height}
        divider={false}
        button={SimpleMenu}
      >
        <Plot
          data={getPlotData()}
          layout={layout}
          config={configuration}
          style={style}
        />
      </ContentContainer>
    );
  };

  //All plots
  return (
    <React.Fragment>
      <div id="section_plots" />
      <PlotsFullscreen miniPlot={MiniPlot} />
      <Grid container justify="center" spacing={2}>
        {config["data.star"].map((x, i) => (
          <Grid item xs={12} sm={6} key={i}>
            <MiniPlot x={x} i={i} />
          </Grid>
        ))}
      </Grid>
      <SmallDivider />
    </React.Fragment>
  );
}

export default React.memo(PlotsMini);
