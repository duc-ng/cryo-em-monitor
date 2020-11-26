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
import { DataContext } from "./../../global/Data";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100%",
  },
}));

export default function Status(props) {
  const classes = useStyles();
  const theme = useTheme();
  const dataContext = React.useContext(DataContext);

  const statusCards = [
    [
      1,
      config["times.star"][0].value,
      config["times.star"][0].label,
      <PhotoCameraIcon />,
      theme.palette.primary.main,
    ],
    [
      2,
      config["times.star"][1].value,
      config["times.star"][1].label,
      <SystemUpdateAltIcon />,
      theme.palette.primary.main,
    ],
    [
      3,
      config["times.star"][2].value,
      config["times.star"][2].label,
      <DataUsageIcon />,
      theme.palette.primary.main,
    ],
    [
      4,
      config["times.star"][3].value,
      config["times.star"][3].label,
      <CheckIcon />,
      theme.palette.success.main,
    ],
    [
      5,
      config["times.star"][4].value,
      config["times.star"][4].label,
      <ErrorOutlineIcon />,
      theme.palette.warning.main,
    ],
  ];

  const calcStatusValues = (name) => {
    return dataContext.data.filter(
      (item) => item[name] !== 0 && item[name] !== undefined
    ).length;
  };

  return (
    <Box m={1}>
      <div id="section_status" />
      <Grid container spacing={2} justify="center">
        {statusCards.map(([index, name, label, icon, color]) => {
          return (
            <Grid item xs={6} md={2} key={index}>
              <Card className={classes.root}>
                <CardContent>
                  <Grid container justify="space-between">
                    <Typography gutterBottom variant="h5" component="h2">
                      {calcStatusValues(name)}
                    </Typography>
                    <Avatar style={{ backgroundColor: color }}>{icon}</Avatar>
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
              </Card>
            </Grid>
          );
        })}
      </Grid>
      <SmallDivider />
    </Box>
  );
}
