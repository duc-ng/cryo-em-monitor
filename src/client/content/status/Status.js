import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import Box from "@material-ui/core/Box";
import SmallDivider from "./../../utils/SmallDivider";
import Typography from "@material-ui/core/Typography";
import config from "../../../config.json";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import SystemUpdateAltIcon from "@material-ui/icons/SystemUpdateAlt";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import DataUsageIcon from "@material-ui/icons/DataUsage";
import CheckIcon from "@material-ui/icons/Check";
import HelpIcon from "@material-ui/icons/Help";
import { DataContext } from "./../../global/Data";
import Fade from "@material-ui/core/Fade";

const useStyles = makeStyles(() => ({
  root: {
    height: "100%",
  },
}));

export default function Status() {
  const classes = useStyles();
  const theme = useTheme();
  const dataContext = React.useContext(DataContext);

  const getIcon = (i) => {
    switch (i) {
      case 0:
        return <PhotoCameraIcon />;
      case 1:
        return <SystemUpdateAltIcon />;
      case 2:
        return <DataUsageIcon />;
      case 3:
        return <CheckIcon />;
      case 4:
        return <ErrorOutlineIcon />;
      default:
        return <HelpIcon />;
    }
  };

  const getColor = (i) => {
    switch (i) {
      case 3:
        return theme.palette.success.main;
      case 4:
        return theme.palette.warning.main;
      default:
        return theme.palette.primary.main;
    }
  };

  const getValue = (name) => {
    return dataContext.data.filter(
      (item) => item[name] !== 0 && item[name] !== undefined
    ).length;
  };

  return (
    <Box m={1}>
      <div id="section_status" />
      <Grid container spacing={2} justify="center">
        {config["times.star"].map(({ label, value }, i) => {
          return (
            <Grid item xs={6} md={2} key={i}>
              <Card className={classes.root}>
                <Fade in={true} timeout={1000}>
                  <CardContent>
                    <Grid container justify="space-between">
                      <Typography gutterBottom variant="h5" component="h2">
                        {getValue(value)}
                      </Typography>
                      <Avatar style={{ backgroundColor: getColor(i) }}>
                        {getIcon(i)}
                      </Avatar>
                    </Grid>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      component="p"
                      align="left"
                    >
                      {label}
                    </Typography>
                  </CardContent>
                </Fade>
              </Card>
            </Grid>
          );
        })}
      </Grid>
      <SmallDivider />
    </Box>
  );
}
