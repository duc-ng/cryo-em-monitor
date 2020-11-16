import React from "react";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import { useTheme } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import SmallDivider from "./SmallDivider";
import { DataContext } from "./../global/Data";

//main
export default function ContentContainer(props) {
  const theme = useTheme();
  const { data } = React.useContext(DataContext);
  const id = props.id !== undefined ? props.id : "";
  const title = props.title !== undefined ? props.title : "";
  const subtitle = props.subtitle !== undefined ? props.subtitle : "";
  const button = props.button !== undefined ? props.button() : undefined;
  const height = props.height !== undefined ? props.height : "100%";
  const noData = props.noData === false ? false : true;
  const divider = props.divider === false ? false : true;

  return (
    <React.Fragment>
      <div id={id} />
      <Grid container justify="center">
        <Paper style={{ width: "100%" }}>
          <Box m={2}>
            <Grid
              container
              direction="row"
              justify="space-between"
              alignItems="center"
            >
              <Grid item>
                <Typography
                  variant="body1"
                  style={{ color: theme.palette.warning.main }}
                >
                  {title}
                </Typography>
                <Typography
                  variant="body2"
                  gutterBottom
                  color="textSecondary"
                  paragraph={true}
                >
                  {subtitle}
                </Typography>
              </Grid>
              <Grid item>{button}</Grid>
            </Grid>
            {data.length === 0 && noData ? (
              <Grid
                container
                justify="center"
                alignItems="center"
                style={{ height: height }}
              >
                <Typography variant="body1">No Data</Typography>
              </Grid>
            ) : (
              props.children
            )}
          </Box>
        </Paper>
      </Grid>
      {divider ? <SmallDivider /> : <div />}
    </React.Fragment>
  );
}
