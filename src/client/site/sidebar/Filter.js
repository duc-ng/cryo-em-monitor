import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { DataContext } from "./../../global/Data";
import { DateTimePicker } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import config from "./../../../config.json";

const marks = [
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
];

export default function Filter() {
  const [value, setValue] = React.useState(3);
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
      <MuiPickersUtilsProvider utils={DateFnsUtils}>
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
                  ? new Date(dataContext.data[0][config["times.star"][0].value])
                  : null
              }
              onChange={(date) => {
                setValue(undefined);
                dataContext.setFromTo(date, dataContext.dateTo);
              }}
              label="From"
              format={value < 24 ? "HH:mm" : "MMM do"}
            />
          </Grid>
          <Grid item xs={6}>
            <DateTimePicker
              ampm={false}
              inputVariant="filled"
              disableFuture
              value={
                dataContext.dateTo === undefined
                  ? new Date()
                  : dataContext.dateTo
              }
              onChange={(date) => {
                setValue(undefined);
                dataContext.setFromTo(dataContext.dateFrom, date);
              }}
              label="To"
              format={value < 24 ? "HH:mm" : "MMM do"}
            />
          </Grid>

          {/* Filter */}
          {marks.map((item, i) => (
            <Grid item xs={6} key={i}>
              <Button
                fullWidth
                disableElevation
                variant="outlined"
                color={item.value === value ? "secondary" : "default"}
                onClick={() => {
                  setValue(item.value);
                  dataContext.setFilter(item.value);
                  dataContext.setFromTo(
                    new Date(Date.now() - item.value * 60 * 60 * 1000),
                    undefined
                  );
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
