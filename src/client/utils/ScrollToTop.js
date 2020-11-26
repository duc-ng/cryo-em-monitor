import React from "react";
import KeyboardArrowUpIcon from "@material-ui/icons/Navigation";
import Fab from "@material-ui/core/Fab";
import { makeStyles } from "@material-ui/core/styles";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Zoom from "@material-ui/core/Zoom";

const useStyles = makeStyles((theme) => ({
  scroll: {
    position: "fixed",
    bottom: theme.spacing(5),
    right: theme.spacing(2),
  },
}));

export default function ScrollToTop(props) {
  const classes = useStyles();
  const { window } = props;

  const trigger = useScrollTrigger({
    target: window ? window() : undefined,
    disableHysteresis: true,
    threshold: 2000,
  });

  const handleClick = (event) => {
    const anchor = (event.target.ownerDocument || document).querySelector(
      "#section_start"
    );

    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <Zoom in={trigger}>
      <div onClick={handleClick} role="presentation" className={classes.scroll}>
        <Fab color="primary" size="small">
          <KeyboardArrowUpIcon />
        </Fab>
      </div>
    </Zoom>
  );
}
