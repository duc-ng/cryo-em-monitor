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

const HEIGHT = 320;

function PlotsMini() {
  const { data, dateFrom, dateTo } = React.useContext(DataContext);
  const theme = useTheme();
  const [type, setType] = React.useState(
    new Array(config["data.star"].length).fill("scattergl")
  );
  const maxPointsPlotted = 5000;
  const percentPlotted = Math.floor((maxPointsPlotted / data.length) * 100);
  const maxDate = dateTo === undefined ? new Date() : dateTo;
  const minDate =
    dateFrom === undefined
      ? data.length === 0
        ? new Date(0)
        : data[0][config["times.star"][0].value]
      : dateFrom;

  const MiniPlot = (props) => {
    const { plotType, i } = props;
    const { minOptimum, maxOptimum, value } = config["data.star"][i];
    const Plot = createPlotlyComponent(Plotly);
    const aggregateValue = //plot max. x random values
      plotType === "scattergl" ? Math.ceil(data.length / maxPointsPlotted) : 1;

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
          x: plotType === "scattergl" ? xValues1 : yValues1,
          y: yValues1,
          marker: {
            color: theme.palette.success.main,
            line: {
              color: theme.palette.grey[900],
              width: 1,
            },
          },
          opacity: 0.8,
          name: "Good",
          mode: "markers",
          type: plotType,
          hoverinfo: plotType === "scattergl" ? "y" : "x+y",
        },
        {
          x: plotType === "scattergl" ? xValues2 : yValues2,
          y: yValues2,
          opacity: 0.8,
          name: "Ok",
          marker: {
            color: theme.palette.primary.light,
            line: {
              color: theme.palette.grey[900],
              width: 1,
            },
          },
          mode: "markers",
          type: plotType,
          hoverinfo: plotType === "scattergl" ? "y" : "x+y",
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
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)",
      hovermode: plotType === "scattergl" ? "closest" : "x",
      barmode: "stack",
      xaxis: {
        type: plotType === "scattergl" ? "date" : "",
        zeroline: true,
        gridcolor: theme.palette.divider,
        linecolor: theme.palette.divider,
        range: plotType === "scattergl" ? [minDate, maxDate] : [],
      },
      yaxis: {
        rangemode: "tozero",
        gridcolor: theme.palette.divider,
        linecolor: theme.palette.divider,
      },
      autosize: true,
      height: HEIGHT,
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

    return (
      <Plot
        data={getPlotData()}
        layout={layout}
        config={configuration}
        style={style}
      />
    );
  };

  const SimpleMenu = (props) => {
    const setScatter = () => {
      let newType = [...type];
      newType[props.i] = "scattergl";
      setType(newType);
    };

    const setHistogram = () => {
      let newType = [...type];
      newType[props.i] = "histogram";
      setType(newType);
    };

    return (
      <ButtonGroup variant="text">
        <Button onClick={setScatter}>
          <Typography
            variant="body2"
            color={type[props.i] === "scattergl" ? "primary" : "textSecondary"}
          >
            Scatter
          </Typography>
        </Button>
        <Button onClick={setHistogram}>
          <Typography
            variant="body2"
            color={type[props.i] === "histogram" ? "primary" : "textSecondary"}
          >
            Histogram
          </Typography>
        </Button>
      </ButtonGroup>
    );
  };

  //All plots
  return (
    <React.Fragment>
      <div id="section_plots" />
      <PlotsFullscreen miniPlot={MiniPlot} HEIGHT={HEIGHT} plotType={type} />
      <Grid container justify="center" spacing={2}>
        {config["data.star"].map((x, i) => (
          <Grid item xs={12} sm={6} key={i}>
            <ContentContainer
              id={"section_images_" + i}
              title={x.label}
              subtitle={config["data.star"][i].description}
              midtext={percentPlotted < 100 ? percentPlotted + "% plotted" : ""}
              height={HEIGHT}
              divider={false}
              button={<SimpleMenu i={i} />}
            >
              <MiniPlot i={i} plotType={type[i]} />
            </ContentContainer>
          </Grid>
        ))}
      </Grid>
      <SmallDivider />
    </React.Fragment>
  );
}

export default React.memo(PlotsMini);
