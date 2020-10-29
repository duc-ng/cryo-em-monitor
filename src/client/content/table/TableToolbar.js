import React from "react";
import { lighten, makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import clsx from "clsx";
import { useTheme } from "@material-ui/core/styles";
import TableExport from "./TableExport";

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
}));

export default function TableToolbar(props) {
  const classes = useToolbarStyles();
  const theme = useTheme();
  const numSelected = props.selected.length;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <Grid
        container
        direction="row"
        justify="space-between"
        alignItems="center"
      >
        <Grid item>
          {numSelected > 0 ? (
            <Typography
              className={classes.title}
              color="inherit"
              variant="subtitle1"
              component="div"
            >
              {numSelected} selected
            </Typography>
          ) : (
            <React.Fragment>
              <Typography
                variant="body1"
                style={{ color: theme.palette.warning.main }}
                id="section_2"
              >
                Data
              </Typography>
              <Typography
                variant="body2"
                gutterBottom
                color="textSecondary"
                paragraph={true}
              >
                All data recorded
              </Typography>
            </React.Fragment>
          )}
        </Grid>
        <Grid item>
          {numSelected > 0 ? (
            <TableExport selected={props.selected} rows={props.rows} />
          ) : null}
        </Grid>
      </Grid>
    </Toolbar>
  );
}
