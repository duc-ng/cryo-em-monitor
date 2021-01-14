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
import { fade } from "@material-ui/core/styles/colorManipulator";

const Plot = createPlotlyComponent(Plotly);

const options = [{ label: "All" }].concat(
  config["times.star"].map((obj) => ({ label: obj.label }))
);

function PlotMain() {
  const theme = useTheme();
  const { dateFrom, dateTo, data } = React.useContext(DataContext);
  const [plotNr, setPlotNr] = React.useState(0);
  const maxDate = dateTo === undefined ? new Date() : dateTo;
  const minDate = dateFrom;

  //get rounded last date
  const getLastDate = (date, roundValue) => {
    return date.setMinutes(
      Math.floor(date.getMinutes() / roundValue) * roundValue,
      0,
      0
    );
  };

  //get color
  const getColor = (i) => {
    switch (i) {
      case 0:
        return theme.palette.primary.main;
      case 1:
        return "#00bcd4";
      case 2:
        return "#1769aa";
      case 3:
        return theme.palette.success.main;
      case 4:
        return theme.palette.warning.main;
      default:
        return theme.palette.primary.main;
    }
  };

  //get X and Y Data of chosen plot
  const calcXY = (nr) => {
    var xData2 = [];
    var yData2 = [];
    const isSmall = maxDate - minDate < 14400000; //less than 4h
    var stepSize = isSmall ? 20 * 60 * 1000 : 3600000; //20min or 1h
    const count = Math.floor((maxDate - minDate) / stepSize) + 1;
    const firstStep = isSmall
      ? getLastDate(new Date(), 5)
      : new Date().setMinutes(0, 0, 0);

    for (let i = 0; i < count; i++) {
      const currStep = new Date(firstStep - i * stepSize);
      const nextStep = new Date(firstStep - (i - 1) * stepSize);
      xData2.push(currStep);
      let y = 0;
      for (let c = 0; c < data.length; c++) {
        const date = new Date(data[c][config["times.star"][nr].value]);
        if (date >= currStep && date < nextStep) {
          y++;
        }
      }
      yData2.push(isSmall ? 3 * y : y);
    }

    return {
      x: xData2,
      y: yData2,
      mode: "lines+markers",
      name: config["times.star"][nr].label,
      line: {
        shape: "spline",
        smoothing: 1.0,
        color: getColor(nr),
        width: 2,
      },
      fill: "tozeroy",
      fillcolor: fade(theme.palette.grey[50], 0.1),
      hoverinfo: "y",
    };
  };

  //Configs for plot
  const configData =
    plotNr === 0
      ? config["times.star"].map((_, i) => calcXY(i))
      : [calcXY(plotNr - 1)];

  const configLayout = {
    autosize: true,
    showlegend: plotNr === 0 ? true : false,
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
    bargap: 0.001,
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

  const configGeneral = {
    displayModeBar: false,
    responsive: true,
  };

  const MenuSimple = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClickListItem = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleMenuItemClick = (event, index) => {
      setAnchorEl(null);
      setPlotNr(index);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
      <div>
        <Button
          aria-haspopup="true"
          onClick={handleClickListItem}
          variant="outlined"
          color="primary"
        >
          {options[plotNr].label}
        </Button>
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          selected={plotNr === 0}
          onClose={handleClose}
        >
          {options.map((obj, i) => (
            <MenuItem
              key={i}
              selected={plotNr === i}
              onClick={(event) => handleMenuItemClick(event, i)}
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
      height={configLayout.height}
      button={MenuSimple()}
    >
      <Plot
        data={configData}
        layout={configLayout}
        config={configGeneral}
        style={{
          width: "100%",
        }}
      />
    </ContentContainer>
  );
}

export default React.memo(PlotMain);
