import React from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
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

const useStyles = makeStyles({
  root: {
    height: "100%",
  },
});

export default function Status(props) {
  const classes = useStyles();
  const theme = useTheme();
  const dataContext = React.useContext(DataContext);

  const statusCards = [
    [
      1,
      config["times.star"].main,
      "Images acquired",
      <PhotoCameraIcon />,
      theme.palette.primary.main,
    ],
    [
      2,
      config["times.star"][1],
      "Images imported",
      <SystemUpdateAltIcon />,
      theme.palette.primary.main,
    ],
    [
      3,
      config["times.star"][2],
      "Images processed",
      <DataUsageIcon />,
      theme.palette.primary.main,
    ],
    [
      4,
      config["times.star"][3],
      "Images exported",
      <CheckIcon />,
      theme.palette.success.main,
    ],
    [
      5,
      config["times.star"][4],
      "Processing errors",
      <ErrorOutlineIcon />,
      theme.palette.warning.main,
    ],
  ];

  const calcStatusValues = (name) => {
    return dataContext.data.filter(
      (item) => item[name] !== 0 && item[name] !== undefined
    ).length;
  };

  console.log("Updated: status");
  return (
    <React.Fragment>
      <div id="section_status" />
      <Grid container spacing={2} justify="center">
        {statusCards.map(([index, name, label, icon, color]) => {
          return (
            <Grid item xs={4} md={2} key={index}>
              <Card className={classes.root}>
                <CardContent>
                  <Grid container justify="space-between">
                    <Typography gutterBottom variant="h4" component="h2">
                      {calcStatusValues(name)}
                    </Typography>
                    <Avatar style={{ backgroundColor: color }}>{icon}</Avatar>
                  </Grid>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    component="p"
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
    </React.Fragment>
  );
}
