import React from "react";
import Chartjs from "chart.js";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import ListIcon from "@material-ui/icons/List";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import SmallDivider from "./../../utils/SmallDivider";
import { useTheme } from "@material-ui/core/styles";
import { DataContext } from "./../../global/Data";
import config from "./../../../config.json";

export default function PlotMain() {
  const theme = useTheme();
  const chartContainer = React.useRef(null);
  const [chartInstance, setChartInstance] = React.useState(null);
  const [plotType, setPlotType] = React.useState(0);
  const dataContext = React.useContext(DataContext);
  const yLabels = React.useRef(Object.values(config["times.star"]));

  //calc data
  React.useEffect(() => {
    //x axis
    let xData = [];
    let date = new Date();
    const min = date.getMinutes();
    date.setMinutes(Math.floor(min / 10) * 10, 0, 0);
    for (let i = 0; i < 19; i++) {
      xData.unshift(new Date(date - i * 1000 * 10 * 60));
    }

    //y axis
    //-> for-loops more efficient than filter()+map()
    var yData = new Array(xData.length).fill(0);
    for (let i = 0; i < dataContext.data.length; i++) {
      for (let u = 0; u < xData.length; u++) {
        let dateObj = new Date(dataContext.data[i][yLabels.current[plotType]]);
        let datePrev = xData[u];
        let dateNext = u === xData.length - 1 ? new Date() : xData[u + 1];
        if (dateObj >= datePrev && dateNext > dateObj) {
          yData[u] += 1;
          break;
        }
      }
    }

    //update + keep scale
    if (chartInstance != null) {
      chartInstance.data.labels = xData;
      chartInstance.data.datasets[0].data = yData;
      const maxValue = chartInstance.options.scales.yAxes[0].ticks.max;
      chartInstance.options.scales.yAxes[0].ticks.max = Math.max(  
        ...yData,
        maxValue
      );
      chartInstance.update();
    }
  }, [dataContext.data, chartInstance, plotType]);

  //configuration
  React.useEffect(() => {
    const chartConfig = {
      type: "bar",
      data: {
        labels: [],
        datasets: [
          {
            data: [],
            backgroundColor: "rgba(54, 162, 235, 0.2)",
            borderColor: "rgba(54, 162, 235, 1)",
            borderWidth: 1,
            categoryPercentage: 1.0,
            barPercentage: 1.0,
          },
        ],
      },
      options: {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
                fontColor: theme.palette.text.primary,
                stepSize: 1,
                max: 1,
              },
            },
          ],
          xAxes: [
            {
              type: "time",
              time: {
                displayFormats: {
                  hour: "HH:mm",
                  minute: "HH:mm",
                },
                unit: "minute",
                unitStepSize: 10,
              },
              gridLines: {
                offsetGridLines: true,
              },
              ticks: {
                fontColor: theme.palette.text.primary,
              },
            },
          ],
        },
        tooltips: {
          callbacks: {
            title: () => "",
          },
          // displayColors: false,
        },
        legend: {
          display: false,
        },
        maintainAspectRatio: false, //adjust height
      },
    };

    if (chartContainer && chartContainer.current) {
      const newChartInstance = new Chartjs(chartContainer.current, chartConfig);
      setChartInstance(newChartInstance);
    }
  }, [chartContainer, theme.palette.text.primary]);

  //Title
  const Title = () => (
    <div>
      <Typography
        variant="body1"
        style={{ color: theme.palette.warning.main }}
        id="section_2"
      >
        Volume
      </Typography>
      <Typography
        variant="body2"
        gutterBottom
        color="textSecondary"
        paragraph={true}
      >
        Data points of last 3 hours
      </Typography>
    </div>
  );

  //Menu
  function SimpleMenu() {
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
      setAnchorEl(null);
    };

    return (
      <div>
        <IconButton onClick={handleClick}>
          <ListIcon />
        </IconButton>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          {yLabels.current.map((x, i) => (
            <MenuItem
              onClick={() => {
                setPlotType(i);
                setAnchorEl(null);
              }}
              key={i}
            >
              {x}
            </MenuItem>
          ))}
        </Menu>
      </div>
    );
  }

  //render
  console.log("Updated: Plot Main");
  return (
    <Grid container>
      <Grid item xs={12}>
        <div id="section_volume" />
        <Paper>
          <Box p={2}>
            <Grid container justify="space-between">
              <Grid item>
                <Title />
              </Grid>
              <Grid item>
                <SimpleMenu />
              </Grid>
            </Grid>

            <Grid item xs={12}>
              <div style={{ height: 320 }}>
                <canvas ref={chartContainer} />
              </div>
            </Grid>
          </Box>
        </Paper>
        <SmallDivider />
      </Grid>
    </Grid>
  );
}
