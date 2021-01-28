import React from "react";
import Slide from "@material-ui/core/Slide";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import { DataContext } from "../global/Data";
import config from "../../config.json";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core/styles";
import Color from "color";
import ImageFullscreen from "./ImageFullscreen";

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

export default function ImageDisplay(props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [image, setImage] = React.useState({
    data: undefined,
    info: "",
  });
  const dataContext = React.useContext(DataContext);

  //fetch image
  React.useEffect(() => {
    if (props.item !== undefined) {
      const key = props.item[config.key];

      fetch(
        "http://" +
          process.env.REACT_APP_HOST +
          ":" +
          process.env.REACT_APP_PORT +
          "/image?key=" +
          key +
          "&type=" +
          props.i +
          "&microscope=" +
          dataContext.microscope
      )
        .then((res) => res.json())
        .then((res) => setImage(res))
        .catch(() => {
          return;
        });
    }
  }, [props.item, props.i, dataContext.microscope]);

  const handleOpen = () => {
    setOpen(!open);
  };

  return (
    <React.Fragment>
      {/* image button */}
      <Tooltip title={image.info}>
        <Button onClick={handleOpen} className={classes.button}>
          {image.data === undefined ? (
            <Box className={classes.box} border={1}>
              No Image
            </Box>
          ) : (
            <img src={image.data} alt="" className={classes.img} />
          )}
        </Button>
      </Tooltip>

      {/* image fullscreen */}
      <Dialog
        open={open}
        fullScreen
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
      >
        <ImageFullscreen
          i={props.i}
          img={JSON.parse(JSON.stringify(image))}
          handleOpen={handleOpen}
          item={props.item}
        />
      </Dialog>
    </React.Fragment>
  );
}
