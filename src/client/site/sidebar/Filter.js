import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { DataContext } from "./../../global/Data";
import { DateTimePicker } from "@material-ui/pickers";
import MomentUtils from "@date-io/moment";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import config from "./../../../config.json";

const marks = [
  {
    value: null,
    label: "All",
  },
  {
    value: 1,
    label: "Last 1h",
  },
  {
    value: 3,
    label: "Last 3h",
  },
  {
    value: 12,
    label: "Last 12h",
  },
  {
    value: 24,
    label: "Last 1d",
  },
  {
    value: 72,
    label: "Last 3d",
  },
  {
    value: 168,
    label: "Last 7d",
  },
  {
    value: 336,
    label: "Last 14d",
  },
];

export default function Filter() {
  const [value, setValue] = React.useState(null);
  const dataContext = React.useContext(DataContext);

  return (
    <React.Fragment>
      <Box mt={4}>
        <Typography
          variant="body2"
          gutterBottom
          color="textSecondary"
          paragraph={true}
        >
          Filter
        </Typography>
      </Box>
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <Grid container spacing={1}>
          {/* Date picker */}
          <Grid item xs={6}>
            <DateTimePicker
              ampm={false}
              inputVariant="filled"
              disableFuture
              value={dataContext.dateFrom}
              initialFocusedDate={
                dataContext.data.length > 0
                  ? new Date(dataContext.data[0][config["times.star"].main])
                  : null
              }
              onChange={(date) => {
                setValue(undefined);
                dataContext.setDateFrom(date);
              }}
              label="From"
              format="MMM Do"
            />
          </Grid>
          <Grid item xs={6}>
            <DateTimePicker
              ampm={false}
              inputVariant="filled"
              disableFuture
              value={dataContext.dateTo}
              onChange={(date) => {
                setValue(undefined);
                dataContext.setDateTo(date);
              }}
              label="To"
              format="MMM Do"
            />
          </Grid>

          {/* Filter */}
          {marks.map((item, i) => (
            <Grid item xs={6} key={i}>
              <Button
                fullWidth
                disableElevation
                variant={item.value === value ? "contained" : "outlined"}
                color={item.value === value ? "primary" : "default"}
                onClick={() => {
                  setValue(item.value);
                  dataContext.setDateFrom(
                    item.value === null
                      ? undefined
                      : new Date(Date.now() - item.value * 60 * 60 * 1000)
                  );
                  dataContext.setDateTo(undefined);
                }}
              >
                <Typography variant="button">{item.label}</Typography>
              </Button>
            </Grid>
          ))}
        </Grid>
      </MuiPickersUtilsProvider>
    </React.Fragment>
  );
}
