import React, { useEffect, useRef } from "react";
import Chartjs from "chart.js";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import SmallDivider from "./../../utils/SmallDivider";
import { useTheme } from "@material-ui/core/styles";

const chartConfig = {
  type: "bar",
  data: {
    labels: [12, 19, 3, 5, 2, 3, 12, 19, 3, 5, 2, 3, 12, 19, 3, 5, 2, 3],
    datasets: [
      {
        data: [12, 19, 3, 5, 2, 3, 12, 19, 3, 5, 2, 3, 12, 19, 3, 5, 2, 3],
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  },
  options: {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
    legend: {
      display: false,
    },
    maintainAspectRatio: false, //adjust height
  },
};

export default function Chart() {
  const theme = useTheme();
  const chartContainer = useRef(null);

  useEffect(() => {
    if (chartContainer && chartContainer.current) {
      const newChartInstance = new Chartjs(chartContainer.current, chartConfig);
    }
  }, [chartContainer]);

  console.log("Updated: Plot main");
  return (
    <Grid container>
      <Grid item xs={12}>
        <div id="section_volume" />
        <Paper>
          <Box p={2}>
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
              Data points per hour
            </Typography>
            <div style={{ height: 320 }}>
              <canvas ref={chartContainer} />
            </div>
          </Box>
        </Paper>
        <SmallDivider />
      </Grid>
    </Grid>
  );
}
