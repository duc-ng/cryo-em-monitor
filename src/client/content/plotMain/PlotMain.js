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
  const dataContext = React.useContext(DataContext);
  const [plotNr, setPlotNr] = React.useState(0);

  const minDate =
    dataContext.dateFrom === undefined
      ? dataContext.data.length === 0
        ? new Date(0)
        : dataContext.data[0][config["times.star"][plotNr].value]
      : dataContext.dateFrom;

  const maxDate =
    dataContext.dateTo === undefined ? new Date() : dataContext.dateTo;

  // data<=4h => 10min bins
  // data<=4d => 1h bins
  // else 1d bins
  const getBinSize = () => {
    const diff = maxDate - minDate;
    if (diff <= 14400000) {
      return 600000;
    } else if (diff <= 345600000) {
      return 3600000;
    } else {
      return 86400000;
    }
  };

  const plotData = dataContext.data
    .filter((obj) => obj[config["times.star"][plotNr].value] !== 0)
    .map((obj) => obj[config["times.star"][plotNr].value]);

  const data = [
    {
      x: plotData,
      type: "histogram",
      mode: "lines",
      opacity: 0.3,
      marker: {
        color: theme.palette.primary.main,
        line: {
          color: theme.palette.primary.main,
          width: 5,
        },
      },
      xbins: {
        size: getBinSize(),
      },
    },
  ];

  const layout = {
    autosize: true,
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
        <Button aria-haspopup="true" onClick={handleOpen} color="primary">
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
      subtitle="Image count"
      height={layout.height}
      button={SimpleMenu}
    >
      <Plot
        data={data}
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
