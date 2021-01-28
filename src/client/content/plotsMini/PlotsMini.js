import React from "react";
import Plotly from "plotly.js-dist-min";
import createPlotlyComponent from "react-plotly.js/factory";
import PlotsFullscreen from "./PlotsFullscreen";
import ContentContainer from "./../../utils/ContentContainer";
import Grid from "@material-ui/core/Grid";
import SmallDivider from "./../../utils/SmallDivider";
import config from "./../../../config.json";
import { DataContext } from "./../../global/Data";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";
import Typography from "@material-ui/core/Typography";

const HEIGHT = 320;
const MaxPointsPlotted = 5000;
const Plot = createPlotlyComponent(Plotly);

function MiniPlot(props) {
  const { dateTo, dateFrom } = React.useContext(DataContext);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [type, setType] = React.useState("scattergl");
  const [redraw, setRedraw] = React.useState(false);
  const {
    i,
    percentPlotted,
    setRevision,
    revision,
    xValues1,
    xValues2,
    yValues1,
    yValues2,
    range,
    nrOutliers,
  } = props;

  const plotData = [
    {
      x: type === "scattergl" ? xValues1 : yValues1,
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
      type: type,
      hoverinfo: type === "scattergl" ? "y" : "x+y",
    },
    {
      x: type === "scattergl" ? xValues2 : yValues2,
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
      type: type,
      hoverinfo: type === "scattergl" ? "y" : "x+y",
    },
  ];

  const layout = {
    font: {
      family: theme.typography.fontFamily,
      color: theme.palette.text.primary,
    },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    hovermode: type === "scattergl" ? "closest" : "x",
    barmode: "stack",
    uirevision: "true", //keep ui state after update
    datarevision: revision,
    xaxis: {
      type: type === "scattergl" ? "date" : "",
      zeroline: true,
      gridcolor: theme.palette.divider,
      linecolor: theme.palette.divider,
      range:
        type === "scattergl"
          ? [dateFrom, dateTo === undefined ? new Date() : dateTo]
          : [],
      fixedrange: isMobile, //no zoom if mobile
    },
    yaxis: {
      rangemode: "tozero",
      gridcolor: theme.palette.divider,
      linecolor: theme.palette.divider,
      range: type === "scattergl" ? range : [],
      fixedrange: isMobile, //no zoom if mobile
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

  const SimpleButton = () => {
    const switchType = () => {
      if (type === "scattergl") {
        setType("histogram");
      } else {
        setType("scattergl");
      }
      setRedraw(true);
    };

    return (
      <ButtonGroup variant="text">
        <Button onClick={switchType}>
          <Typography
            variant="body2"
            color={type === "scattergl" ? "primary" : "textSecondary"}
          >
            Scatter
          </Typography>
        </Button>
        <Button onClick={switchType}>
          <Typography
            variant="body2"
            color={type === "histogram" ? "primary" : "textSecondary"}
          >
            Histogram
          </Typography>
        </Button>
      </ButtonGroup>
    );
  };

  //WebGl discards values, when switching plots
  React.useEffect(() => {
    if (redraw) {
      setRedraw(false);
      setRevision((x) => x + 1);
    }
  }, [redraw, setRevision]);

  return (
    <ContentContainer
      id={"section_images_" + i}
      title={config["data.star"][i].label}
      subtitle={config["data.star"][i].description}
      midtext={
        percentPlotted < 100
          ? percentPlotted + "% plotted"
          : nrOutliers === 1
          ? nrOutliers + " outlier"
          : nrOutliers > 1
          ? nrOutliers + " outliers"
          : ""
      }
      height={HEIGHT}
      divider={false}
      button={<SimpleButton />}
    >
      <Plot
        divId={"graph" + i}
        data={plotData}
        layout={layout}
        config={configuration}
        style={style}
        revision={revision}
      />
    </ContentContainer>
  );
}

//Split data for each MiniPlot
export default function AllPlots() {
  const { data } = React.useContext(DataContext);
  const [revision, setRevision] = React.useState(0);
  const percentPlotted = Math.floor((MaxPointsPlotted / data.length) * 100);
  const aggregateValue = Math.ceil(data.length / MaxPointsPlotted);

  const plotData = config["data.star"].map((x) => {
    const { minOptimum, maxOptimum, value, std } = x;
    let xAll = [];
    let yAll = [];
    let xValues1 = [];
    let xValues2 = [];
    let yValues1 = [];
    let yValues2 = [];

    for (let i = 0; i < data.length; i = i + aggregateValue) {
      xAll.push(data[i][config["times.star"][0].value]);
      yAll.push(data[i][value]);
      if (data[i][value] >= minOptimum && data[i][value] < maxOptimum) {
        xValues1.push(data[i][config["times.star"][0].value]);
        yValues1.push(data[i][value]);
      } else {
        xValues2.push(data[i][config["times.star"][0].value]);
        yValues2.push(data[i][value]);
      }
    }

    const mean = yAll.reduce((a, b) => a + b, 0) / yAll.length;
    const nrOutliers = yAll.filter((x) => x < mean - std || x > mean + std)
      .length;

    return {
      xValues1: xValues1,
      xValues2: xValues2,
      yValues1: yValues1,
      yValues2: yValues2,
      range: [
        Math.max(Math.min(...yAll), mean - std),
        Math.min(Math.max(...yAll), mean + std),
      ],
      nrOutliers: nrOutliers,
    };
  });

  return (
    <React.Fragment>
      <div id="section_plots" />
      {/* <PlotsFullscreen
        MiniPlot={MiniPlot}
        setRevision={setRevision}
        plotData={plotData}
        revision={revision}
      /> */}
      <Grid container justify="center" spacing={2}>
        {config["data.star"].map((_, i) => (
          <Grid item xs={12} sm={6} key={i}>
            <MiniPlot
              i={i}
              percentPlotted={percentPlotted}
              setRevision={setRevision}
              revision={revision}
              xValues1={plotData[i].xValues1}
              xValues2={plotData[i].xValues2}
              yValues1={plotData[i].yValues1}
              yValues2={plotData[i].yValues2}
              range={plotData[i].range}
              nrOutliers={plotData[i].nrOutliers}
            />
          </Grid>
        ))}
      </Grid>
      <SmallDivider />
    </React.Fragment>
  );
}
