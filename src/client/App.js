import React from "react";
import Header from "./site/Header";
import Footer from "./site/Footer";
import PlotsMini from "./content/plotsMini/PlotsMini";
import PlotMain from "./content/plotMain/PlotMain";
import ImageContainer from "./content/images/ImageContainer";
import Status from "./content/status/Status";
import Data from "./global/Data";
import Theme from "./global/Theme";
import { makeStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import Sidebar from "./site/sidebar/Sidebar";
import Toolbar from "@material-ui/core/Toolbar";
import Grid from "@material-ui/core/Grid";
import TableContainer from "./content/table/TableContainer";
import ScrollToTop from "./utils/ScrollToTop";

//theme
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  content: {
    padding: theme.spacing(2),
  },
}));

//main class
function App() {
  const classes = useStyles();

  //render
  return (
    <Data>
      <Theme>
        <CssBaseline />
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
            <PlotMain />
            <TableContainer />
            <ImageContainer />
            <PlotsMini />
            <Footer />
            <ScrollToTop />
          </Grid>
        </div>
      </Theme>
    </Data>
  );
}

export default React.memo(App);
