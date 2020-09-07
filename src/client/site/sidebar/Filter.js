import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import { DataContext } from "./../../global/Data";

const marks = [
  {
    value: undefined,
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
  const [value, setValue] = React.useState(undefined);
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
      <Grid container spacing={1}>
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
                  item.value === undefined
                    ? undefined
                    : new Date(Date.now() - item.value * 60 * 60 * 1000)
                );
              }}
            >
              {item.label}
            </Button>
          </Grid>
        ))}
      </Grid>
    </React.Fragment>
  );
}
