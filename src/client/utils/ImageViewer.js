import React from "react";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import ImageSelector from "./ImageSelector";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import { DataContext } from "./../global/Data";
import config from "./../../config.json";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Color from "color";

const useStyles = makeStyles((theme) => ({
  img: {
    width: "100%",
    height: "100%",
    "&:hover": {
      opacity: 0.7,
    },
  },
  button: {
    padding: 0,
    width: "100%",
  },
  dialogpaper: {
    backgroundColor: "transparent",
    boxShadow: "none",
  },
  dialog: {
    backgroundColor: Color(theme.palette.grey[900]).alpha(0.9).string(),
  },
  box: {
    paddingTop: "45%",
    paddingBottom: "45%",
    width: "100%",
    borderColor: theme.palette.divider,
  },
}));

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ImageViewer(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [image, setImage] = React.useState(undefined);
  const dataContext = React.useContext(DataContext);

  //fetch image
  React.useEffect(() => {
    if (props.item !== undefined) {
      const key = props.item[config.key];
      const file = props.item[config["images.star"][props.i].value];
      fetch(
        "http://" +
          config.app.api_host +
          ":" +
          config.app.api_port +
          "/image?key=" +
          key +
          "&filename=" +
          file +
          "&microscope=" +
          dataContext.microscope
      )
        .then((res) => res.blob())
        .then((res) => URL.createObjectURL(res))
        .then((res) => setImage(res));
    }
  }, [props.item, props.i, dataContext.microscope]);

  const handleOpen = () => {
    setOpen(!open);
  };

  console.log("Updated: images");
  return (
    <React.Fragment>
      {/* image button */}
      <Tooltip title={config["images.star"][props.i].label}>
        <Button onClick={handleOpen} className={classes.button}>
          {image === undefined ? (
            <Box className={classes.box} border={1}>
              No Image
            </Box>
          ) : (
            <img src={image} alt="" className={classes.img} />
          )}
        </Button>
      </Tooltip>

      {/* image fullscreen */}
      <Dialog
        open={open}
        unmountOnExit
        onClose={handleOpen}
        TransitionComponent={Transition}
        PaperProps={{
          classes: {
            root: classes.dialogpaper,
          },
        }}
        BackdropProps={{
          classes: {
            root: classes.dialog,
          },
        }}
        maxWidth="xl"
      >
        <ImageSelector i={props.i} />
      </Dialog>
    </React.Fragment>
  );
}
