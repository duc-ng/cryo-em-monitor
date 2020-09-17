import React from "react";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import { DataContext } from "./../../global/Data";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Paper from "@material-ui/core/Paper";
import SmallDivider from "./../../utils/SmallDivider";
import config from "./../../../config.json";
import ImageSelector from "./ImageSelector";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import Color from "color";
import Slide from "@material-ui/core/Slide";

const useStyles = makeStyles((theme) => ({
  paper: {
    width: "100%",
  },
  img: {
    width: "100%",
    height: "100%",
    "&:hover": {
      opacity: 0.7,
    },
  },
  gridList: {
    flexWrap: "nowrap",
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
    backgroundColor: Color(theme.palette.grey[900])
      .alpha(0.9)
      .string(),
  },
  skeleton: {
    paddingTop: "40%",
    paddingBottom: "40%",
  },
}));

//image button
const ImageButton = ({ handleCarousel, i }) => {
  const classes = useStyles();
  const { dataLastImages } = React.useContext(DataContext);

  return (
    <Tooltip title={config["images.star"][i].name}>
      <Button onClick={handleCarousel} className={classes.button}>
        {dataLastImages[i] === undefined ? (
          <Box className={classes.skeleton}>
            <CircularProgress color="primary" />
          </Box>
        ) : (
          <img
            src={dataLastImages[i].data}
            alt={dataLastImages[i].label}
            className={classes.img}
          />
        )}
      </Button>
    </Tooltip>
  );
};

//image popover
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ImageContent = (props) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleCarousel = () => {
    setOpen(!open);
  };

  return (
    <React.Fragment>
      <ImageButton i={props.i} handleCarousel={handleCarousel} />
      <Dialog
        open={open}
        unmountOnExit
        onClose={handleCarousel}
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
};

//main
export default function ImageContainer(props) {
  const classes = useStyles();
  const theme = useTheme();
  const imgConfig = Object.keys(config["images.star"]);

  return (
    <React.Fragment>
      <Grid container justify="center">
        <Paper className={classes.paper} id="section_1">
          <Box m={2}>
            <Typography
              variant="body1"
              style={{ color: theme.palette.warning.main }}
            >
              Images
            </Typography>
            <Typography
              variant="body2"
              gutterBottom
              color="textSecondary"
              paragraph={true}
            >
              Cras mattis consectetur purus sit amet fermentum.
            </Typography>
            <GridList
              className={classes.gridList}
              cols={imgConfig.length}
              cellHeight="auto"
              spacing={10}
            >
              {Object.keys(config["images.star"]).map((item) => (
                <GridListTile key={item}>
                  <ImageContent i={item} />
                </GridListTile>
              ))}
            </GridList>
          </Box>
        </Paper>
      </Grid>
      <SmallDivider />
    </React.Fragment>
  );
}
