import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  }
}));


export default function Activity() {
  const classes = useStyles();
  const [activeStep] = React.useState(0);
  const steps = ['Images Recorded', 'Images Imported', 'Images processed', 'Error'];


  return (
    <div className={classes.root}>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      
    </div>
  );
}
