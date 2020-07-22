import React, { Component, Fragment } from "react";
import socketIOClient from "socket.io-client";
import Header from "./Header";
import Backdrop from "./Backdrop";
import Footer from "./Footer";
import PlotContainer from "./PlotContainer";
import DataContainer from "./DataContainer";
import Status from "./Status";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/styles";
import { blueGrey } from "@material-ui/core/colors";
import config from "./../config.json";

//main class
class App extends Component {
  constructor(props) {
    super(props);

    //init state
    this.state = {
      itemsLoaded: false,
      counter: 0,
      items: [],
      imageData: [],
      recentImages: [],
      imagesChanged: false,
    };
  }

  componentDidMount() {
    //init
    const socket = socketIOClient(
      "ws://" + config.app.api_host + ":" + config.app.api_port
    );
    socket.on("initLastDate", () => {
      socket.emit(
        "lastDate",
        Date.now() - config.app.rootDirDaysOld * 24 * 60 * 60 * 1000
      );
    });

    //receiving data
    socket.on("data", (item) => {
      //send last Date
      socket.emit("lastDate", item[item.length - 1]._mmsdateAuqired_Value);

      //set state
      this.setState((state) => {
        return {
          itemsLoaded: true,
          items: state.items.concat(item),
          counter: state.counter + 1,
        };
      });
    });
  }

  //return
  render() {
    const { classes } = this.props;
    const { items } = this.state;

    if (!this.state.itemsLoaded) {
      return <Backdrop />;
    } else {
      return (
        <div className={classes.root}>
          <Fragment>
            <Header
              lastItemDate={items[items.length - 1]._mmsdateAuqired_Value}
            />
            <div style={{ padding: 20 }}>
              <Grid container justify="center">
                <Grid item xs={10}>
                  <Status data={this.state.items} />
                  <DataContainer data={this.state.items} />
                  <PlotContainer
                    data={this.state.items}
                    counter={this.state.counter}
                  />
                </Grid>
              </Grid>
            </div>
            <Footer />
          </Fragment>
        </div>
      );
    }
  }
}

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: blueGrey[50],
  },
});

export default withStyles(styles)(App);
