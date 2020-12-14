import React from "react";
import Plotly from "plotly.js-dist-min";
import createPlotlyComponent from "react-plotly.js/factory";
import { useTheme } from "@material-ui/core/styles";
import { DataContext } from "./../../global/Data";
import config from "./../../../config.json";
import ContentContainer from "./../../utils/ContentContainer";
import Button from "@material-ui/core/Button";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

const Plot = createPlotlyComponent(Plotly);

function PlotMain() {
  const theme = useTheme();
  const { dateFrom, dateTo, data } = React.useContext(DataContext);
  const [plotNr, setPlotNr] = React.useState(0);
  const maxDate = dateTo === undefined ? new Date() : dateTo;
  const minDate =
    dateFrom === undefined
      ? data.length === 0
        ? new Date(0)
        : data[0][config["times.star"][plotNr].value]
      : dateFrom;

  const stepNr = 100;
  const stepSize = (maxDate - minDate) / stepNr;
  const xData = [...Array(stepNr+1).keys()].map(
    (i) => new Date(maxDate - stepSize * i)
  );
  const yData = xData.map(
    (to) =>
      data.filter((obj) => {
        let date = new Date(obj[config["times.star"][plotNr].value]);
        let from = new Date(to - 3600000);
        return date !== 0 && date >= from && date < to;
      }).length
  );

  const dataPlot = [
    {
      x: xData,
      y: yData,
      type: "scatter",
      line: { shape: "hvh" },
      marker: {
        color: theme.palette.secondary.main,
      },
      hoverinfo: "x+y",
    },
    {
      x: xData,
      y: yData,
      mode: "markers",
      type: "bar",
      opacity: 0.7,
      marker: {
        color: theme.palette.primary.main,
      },
      hoverinfo: "x",
    },
  ];

  const layout = {
    autosize: true,
    showlegend: false,
    height: 270,
    margin: {
      t: 10,
      b: 55,
      l: 45,
      r: 10,
      pad: 0,
    },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
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
      zerolinecolor: theme.palette.divider,
    },
  };

  const configuration = {
    displayModeBar: false,
    responsive: true,
  };

  const SimpleMenu = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleOpen = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
      <div>
        <Button
          aria-haspopup="true"
          onClick={handleOpen}
          variant="outlined"
          color="primary"
        >
          {config["times.star"][plotNr].label}
        </Button>
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {config["times.star"].map((obj, i) => (
            <MenuItem
              key={i}
              onClick={() => {
                setAnchorEl(null);
                setPlotNr(i);
              }}
            >
              {obj.label}
            </MenuItem>
          ))}
        </Menu>
      </div>
    );
  };

  return (
    <ContentContainer
      id="section_volume"
      title="Volume"
      subtitle="Images per hour"
      height={layout.height}
      button={SimpleMenu()}
    >
      <Plot
        data={dataPlot}
        layout={layout}
        config={configuration}
        style={{
          width: "100%",
        }}
      />
    </ContentContainer>
  );
}

export default React.memo(PlotMain);
