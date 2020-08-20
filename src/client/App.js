import React from "react";
import Header from "./site/Header";
import Footer from "./site/Footer";
import PlotContainer from "./content/plots/PlotContainer";
// import DataContainer from "./DataContainer";
import Data from "./global/Data";
import Status from "./content/Status";
import Theme from "./global/Theme";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Sidebar from "./site/sidebar/Sidebar";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import TableContainer from "./content/table/TableContainer";

//theme
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  toolbar: theme.mixins.toolbar, //content below header
  content: {
    // flexGrow: 1,
    padding: theme.spacing(2),
  },
}));

//main class
export default function App() {
  // const [imageData, setImageData] = React.useState([]);
  // const [recentImages, setRecentImages] = React.useState([]);
  // const [imagesChanged, setImagesChanged] = React.useState(false);
  const classes = useStyles();

  //render
  return (
    <Theme>
      <CssBaseline />
      <Data>
        <div className={classes.root}>
          <Header />
          <Sidebar />
          <Grid
            container
            direction="column"
            spacing={0}
            justify="center"
            className={classes.content}
          >
            <Toolbar />
            <Status />
            <TableContainer />
            <PlotContainer />
            <Footer />
          </Grid>
        </div>
      </Data>
    </Theme>
  );
}
