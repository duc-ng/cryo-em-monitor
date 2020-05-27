import React from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles } from '@material-ui/core/styles';
import { blue} from "@material-ui/core/colors";


const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: blue[50],
  },
}));

export default function SimpleBackdrop() {
  const classes = useStyles();
  const [open] = React.useState(false);

  return (
    <div>   
      <Backdrop className={classes.backdrop} open={!open} >
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
