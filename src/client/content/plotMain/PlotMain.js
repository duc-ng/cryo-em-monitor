import React from 'react';
import Plotly from 'plotly.js-dist-min';
import createPlotlyComponent from 'react-plotly.js/factory';
import { useTheme } from '@material-ui/core/styles';
import { DataContext } from './../../global/Data';
import config from './../../../config.json';
import ContentContainer from './../../utils/ContentContainer';
import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import { fade } from '@material-ui/core/styles/colorManipulator';

const Plot = createPlotlyComponent(Plotly)

const getLastDate = (date, roundValue) => {
  return date.setMinutes(
    Math.floor(date.getMinutes() / roundValue) * roundValue,
    0,
    0
  )
};

function PlotMain () {
  const theme = useTheme()
  const { dateFrom, dateTo, data } = React.useContext(DataContext)
  const [plotNr, setPlotNr] = React.useState(0)
  const maxDate = dateTo === undefined ? new Date() : dateTo
  const minDate =
    dateFrom === undefined
      ? data.length === 0
          ? new Date(0)
          : data[0][config['times.star'][plotNr].value]
      : dateFrom

  //init sizes
  var xData2 = []
  var yData2 = []
  const isSmall = maxDate - minDate < 14400000 //less than 4h
  var stepSize = isSmall ? 5 * 60 * 1000 : 3600000 //5min or 1h
  const count = Math.floor((maxDate - minDate) / stepSize) + 1
  const firstStep = isSmall
    ? getLastDate(new Date(), 5)
    : new Date().setMinutes(0, 0, 0)

  //calc x + y values
  for (let i = 0; i < count; i++) {
    const currStep = new Date(firstStep - i * stepSize)
    const nextStep = new Date(firstStep - (i - 1) * stepSize)
    xData2.push(currStep)

    let y = 0
    for (let c = 0; c < data.length; c++) {
      const date = new Date(data[c][config['times.star'][plotNr].value])
      if (date >= currStep && date < nextStep) {
        y++
      }
    }
    yData2.push(isSmall ? 12 * y : y)
  }

  const dataPlot = [
    {
      x: xData2,
      y: yData2,
      mode: 'lines',
      line: {
        shape: 'spline',
        smoothing: 1.0,
        color: theme.palette.secondary.main
      },
      fill: 'tozeroy',
      fillcolor: fade(theme.palette.primary.main, 0.5),
      hoverinfo: 'x+y'
    }
  ]

  const layout = {
    autosize: true,
    showlegend: false,
    height: 270,
    margin: {
      t: 10,
      b: 55,
      l: 45,
      r: 10,
      pad: 0
    },
    paper_bgcolor: 'rgba(0,0,0,0)',
    plot_bgcolor: 'rgba(0,0,0,0)',
    bargap: 0.001,
    font: {
      family: theme.typography.fontFamily,
      color: theme.palette.text.primary
    },
    titlefont: {
      size: 15,
      color: theme.palette.warning.main
    },
    xaxis: {
      type: 'date',
      range: [minDate, maxDate],
      gridcolor: theme.palette.divider,
      linecolor: theme.palette.divider
    },
    yaxis: {
      rangemode: 'tozero',
      gridcolor: theme.palette.divider,
      linecolor: theme.palette.divider,
      zerolinecolor: theme.palette.divider
    }
  }

  const configuration = {
    displayModeBar: false,
    responsive: true
  }

  const SimpleMenu = () => {
    const [anchorEl, setAnchorEl] = React.useState(null)

    const handleOpen = (event) => {
      setAnchorEl(event.currentTarget)
    };

    const handleClose = () => {
      setAnchorEl(null)
    };

    return (
      <div>
        <Button
          aria-haspopup='true'
          onClick={handleOpen}
          variant='outlined'
          color='primary'
        >
          {config['times.star'][plotNr].label}
        </Button>
        <Menu
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {config['times.star'].map((obj, i) => (
            <MenuItem
              key={i}
              onClick={() => {
                setAnchorEl(null)
                setPlotNr(i)
              }}
            >
              {obj.label}
            </MenuItem>
          ))}
        </Menu>
      </div>
    )
  };

  return (
    <ContentContainer
      id='section_volume'
      title='Volume'
      subtitle='Images per hour'
      height={layout.height}
      button={SimpleMenu()}
    >
      <Plot
        data={dataPlot}
        layout={layout}
        config={configuration}
        style={{
          width: '100%'
        }}
      />
    </ContentContainer>
  )
}

export default React.memo(PlotMain)
