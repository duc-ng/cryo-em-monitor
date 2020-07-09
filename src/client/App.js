import React, { Component, Fragment } from "react";
import socketIOClient from "socket.io-client";
import NavBar from "./Header";
import Backdrop from "./Backdrop";
import PlotContainer from "./PlotContainer";
import DataContainer from "./DataContainer";
import Status from "./Status";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/styles";
import { blueGrey } from "@material-ui/core/colors";
import config from "./../config.json";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: blueGrey[50],
  },
});

class App extends Component {
  //constructor
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
      lastDate: config.app.rootDirDaysOld * 24 * 60 * 60 * 1000
    };
  }

  componentDidMount() {

    //init
    const socket = socketIOClient(
      "ws://" +
        config.app.api_host +
        ":" +
        config.app.api_port
    );
    socket.on("initLastDate", () => {
      socket.emit("lastDate", this.state.lastDate);
    });

    //receiving data
    socket.on("data", (item) => {
      
      //send and save last Date
      console.log("Data received:");
      console.log(item);
      var maxDate = new Date(Math.max.apply(null, item.map((x) => {
        return new Date(x._mmsdateAuqired_Value);
      })));
      if (maxDate !== null) {
        let currentDate = Date.now() - maxDate;
        socket.emit("lastDate", currentDate);
        this.setState((state) => {
          return {
            lastDate: currentDate,
          };
        });
      }

      //set state
      this.setState((state) => {
        return {
          itemsLoaded: true,
          items: state.items.concat(item),
          counter: state.counter + 1,
        };
      });
    });

    //receive images
    // socket.on("images", (item) => {
    //   this.setState((state) => {
    //     return {
    //       imageData: state.imageData.concat([item]),
    //       imagesChanged: true,
    //     };
    //   });
    // });
    // this.interval = setInterval(() => this.updateImages(), 1000);
  }

  // updateImages() {
  //   if (this.state.imagesChanged) {
  //     this.setState((state) => ({
  //       recentImages: [
  //         ...this.state.imageData[this.state.imageData.length - 1].images,
  //       ],
  //       imagesChanged: false,
  //     }));
  //   }
  // }

  componentWillUnmount() {
    //clearInterval(this.interval);
  }

  //return
  render() {
    const { classes } = this.props;

    if (!this.state.itemsLoaded) {
      return <Backdrop />;
    } else {
      return (
        <div className={classes.root}>
          <Fragment>
            <NavBar />
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
          </Fragment>
        </div>
      );
    }
  }
}

export default withStyles(styles)(App);