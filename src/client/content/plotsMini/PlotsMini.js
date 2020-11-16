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

const Plot = createPlotlyComponent(Plotly);

function PlotsMini(props) {
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

    const aggregateValue = //plot max. 5.000 random values
      type === "scattergl" ? Math.ceil(data.length / 5000) : 1;

    const { minOptimum, maxOptimum, value } = config["data.star"][props.i];

    const getPlotData = () => {
      let xValues = [];
      let yValues = [];
      let colorValues = [];

      for (let i = 0; i < data.length; i = i + aggregateValue) {
        xValues.push(data[i][config["times.star"][0].value]);
        yValues.push(data[i][value]);
        if (data[i][value] >= minOptimum && data[i][value] < maxOptimum) {
          colorValues.push(theme.palette.success.main);
        } else {
          colorValues.push(theme.palette.primary.main);
        }
      }

      return {
        x: type === "scattergl" ? xValues : yValues,
        y: yValues,
        marker: {
          color:
            type === "scattergl" ? colorValues : theme.palette.primary.main,
        },
        mode: "markers",
        type: type,
        showlegend: false,
        hoverinfo: "y",
      };
    };

    // const subtitle =
    //   data.length === 0
    //     ? ""
    //     : data[data.length - 1][config["data.star"][props.i].info];
    const subtitle = config["data.star"][props.i].info;

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
      bargap: 0.01,
      paper_bgcolor: "rgba(0,0,0,0)",
      plot_bgcolor: "rgba(0,0,0,0)",
      hovermode: "closest",
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
        b: 40,
        l: 35,
        r: 25,
      },
      modebar: {
        bgcolor: "rgba(0,0,0,0)",
        color: theme.palette.divider,
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
        height={layout.height}
        divider={false}
        button={SimpleMenu}
      >
        <Plot
          data={[getPlotData()]}
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
