import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { blue} from "@material-ui/core/colors";

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
  indicator: {
    backgroundColor: blue[700]
  }
});

export default function Header() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Paper className={classes.root}>
      <Tabs 
        indicatorColor="primary" 
        classes={{ indicator: classes.indicator }} 
        value={value} onChange={handleChange}
        centered
      >
        <Tab classes={{ label: classes.label }} label="Titan 1" />
        <Tab classes={{ label: classes.label }} label="Titan 2" />
        <Tab classes={{ label: classes.label }} label="Titan 3" />
      </Tabs>
    </Paper>
  );
}
