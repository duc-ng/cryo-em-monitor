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

const useStyles = makeStyles((theme) => ({
  timeline: {
    paddingTop: 5,
    paddingLeft: 10,
  },
}));

export default function Updates() {
  const dataContext = React.useContext(DataContext);
  const classes = useStyles();

  return (
    <Box mt={4}>
      <Typography
        variant="body2"
        gutterBottom
        color="textSecondary"
        paragraph={true}
      >
        Last update
      </Typography>
      {/* <Timeline className={classes.timeline}>
        {dataContext.datesLast4.map((item, i) => (
          <div>
            <TimelineSeparator>
              <TimelineDot
                variant="outlined"
                color={i === 0 ? "primary" : "grey"}
              />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent>
              <Typography
                color={i === 0 ? "initial" : "textSecondary"}
                variant="body2"
                noWrap
              >
                {item}
              </Typography>
            </TimelineContent>
          </div>
        ))}
      </Timeline> */}
      <Stepper
        orientation="vertical"
        className={classes.timeline}
      >
        {dataContext.datesLast4.map((item, i) => (
          <Step key={i}>
            <StepLabel
              StepIconComponent={() => {
                return i === 0 ? (
                  <AddCircleIcon color="action" fontSize="small" />
                ) : (
                  <FiberManualRecordIcon fontSize="small" color="disabled" />
                );
              }}
            >
              <Typography
                color={i === 0 ? "initial" : "textSecondary"}
                variant={i === 0 ? "body1" : "body2"}
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
