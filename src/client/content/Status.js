import React, { Fragment } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import { blue, green, red } from "@material-ui/core/colors";
import Slider from "@material-ui/core/Slider";
import SmallDivider from "./../utils/SmallDivider";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import config from "../../config.json";
import CardContent from "@material-ui/core/CardContent";
import Avatar from "@material-ui/core/Avatar";
import PhotoCameraIcon from "@material-ui/icons/PhotoCamera";
import SystemUpdateAltIcon from "@material-ui/icons/SystemUpdateAlt";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
import DataUsageIcon from "@material-ui/icons/DataUsage";
import CheckIcon from "@material-ui/icons/Check";
import { DataContext } from "./../global/Data";

const useStyles = makeStyles({
  root: {
    height: "100%",
  },
});

export default function Status(props) {
  //slider
  // const [hours, setHours] = React.useState([0, 2]);

  // const handleSliderChange = (event, newValue) => {
  //   setHours(newValue);
  // };

  // const marks = [
  //   {
  //     value: 0,
  //     label: "Now",
  //   },
  //   {
  //     value: 1,
  //     label: "1h",
  //   },
  //   {
  //     value: 2,
  //     label: "2h",
  //   },
  //   {
  //     value: 3,
  //     label: "3h",
  //   },
  //   {
  //     value: 4,
  //     label: "4h",
  //   },
  // ];

  // const handleValueLabel = (x) => {
  //   return marks.filter((item) => {
  //     return item.value === x;
  //   })[0].label;
  // };

  // const render = (
  //   <Fragment>
  //     <Divider light={true} variant={"middle"} />
  //     <Box pt={3} pb={2}>
  //       <Grid container spacing={2} justify="center">
  //         <Grid item xs={1}>
  //           <Slider
  //             orientation="vertical"
  //             aria-labelledby="discrete-slider-custom"
  //             step={1}
  //             valueLabelDisplay="auto"
  //             valueLabelFormat={handleValueLabel}
  //             value={hours}
  //             marks={marks}
  //             min={0}
  //             max={4}
  //             onChange={handleSliderChange}
  //             style={{ color: blue[800] }}
  //           />
  //         </Grid>
  //       </Grid>
  //     </Box>
  //   </Fragment>
  // );

  // const calculateData = (index) => {
  //   let label = config["times.star"][index];
  //   var filtered = props.data.filter((item) => {
  //     return (
  //       item[label] !== 0 &&
  //       item[label] !== undefined &&
  //       ageIsValid(new Date(item[label]))
  //     );
  //   });
  //   return filtered.length;
  // };

  // const ageIsValid = (objDate) => {
  //   let delta = new Date() - objDate;
  //   if (hours[1] === 2) return true; //TODO: remove this line
  //   return (
  //     delta > hours[0] * 60 * 60 * 1000 && delta < hours[1] * 60 * 60 * 1000
  //   );
  // };

  //render
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

  return (
    <React.Fragment>
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
