import React from "react";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import { DataContext } from "./../../global/Data";
import { makeStyles } from "@material-ui/core/styles";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import FiberManualRecordIcon from "@material-ui/icons/FiberManualRecord";
import config from "./../../../config.json";
import FormatDate from "./../../utils/FormatDate";

const useStyles = makeStyles((theme) => ({
  timeline: {
    paddingTop: 5,
    paddingLeft: 10,
  },
  icon: {
    color: theme.palette.secondary.main,
  },
}));

export default function Updates() {
  const dataContext = React.useContext(DataContext);
  const classes = useStyles();
  const [datesLast4, setDatesLast4] = React.useState([]);

  React.useEffect(() => {
    var dates = [];
    for (var i = 0; i < 4; i++) {
      if (dataContext.data.length - i > 0) {
        const date = new Date(
          dataContext.data[dataContext.data.length - i - 1][
            config["times.star"][0].value
          ]
        );
        dates.push(FormatDate(date));
      }
    }
    setDatesLast4(dates);
  }, [dataContext.data]);

  return (
    <Box mt={4}>
      <Typography
        variant="body2"
        gutterBottom
        color="textSecondary"
        paragraph={true}
      >
        Latest update
      </Typography>
      <Stepper orientation="vertical" className={classes.timeline}>
        {datesLast4.map((item, i) => (
          <Step key={i}>
            <StepLabel
              StepIconComponent={() => {
                return i === 0 ? (
                  <AddCircleIcon className={classes.icon} fontSize="small" />
                ) : (
                  <FiberManualRecordIcon fontSize="small" color="disabled" />
                );
              }}
            >
              <Typography
                color={i === 0 ? "initial" : "textSecondary"}
                variant="body2"
                noWrap
              >
                {item}
              </Typography>
            </StepLabel>
          </Step>
        ))}
      </Stepper>
    </Box>
  );
}
