import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import Plot from "./Plot";
import NavBar from "./Header";
import Backdrop from "./Backdrop";
import Table from "./Table";
import Typography from "@material-ui/core/Typography";
import { Divider } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/styles";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
});

class App extends Component {
  //constructor
  constructor(props) {
    super(props);

    //init state
    this.state = {
      config: require("./../config.json"),
      timesLoaded: false,
      dataLoaded: false,
      times: [],
      data: [],
      plots: [],
    };

    //init plot element
    const nrPlots = Object.keys(this.state.config["data.star"]).length - 1;
    var temp = [];
    for (var i = 0; i < nrPlots; i++) {
      temp.push({
        x: [],
        y: [],
        info: [],
      });
    }
    this.state.plots = temp;
  }

  //receive data
  componentDidMount() {
    const socket = socketIOClient(
      this.state.config.app.host + ":" + this.state.config.app.port
    );

    socket.on("newTimes", (item) => {
      this.setState((state) => {
        return {
          timesLoaded: true,
          times: state.times.concat([item]),
        };
      });
    });

    socket.on("newData", (item) => {
      this.setState((state) => {
        return {
          dataLoaded: true,
          data: state.data.concat([item]),
        };
      });
    });
  }

  //update component data
  updatePlot = (number) => {
    const { config, times, data } = this.state;
    if (times.length > 0 && data.length > 0) {
      //init
      var mergedData = [];
      var keyTimes = config["times.star"].key;
      var keyData = config["data.star"].key;

      //innerjoin data received
      for (var a = 0; a < times.length; a++) {
        for (var j = 0; j < data.length; j++) {
          if (times[a][keyTimes] === data[j][keyData]) {
            const mergedObj = { ...times[a], ...data[j] };
            mergedData.push(mergedObj);
          }
        }
      }

      //move data to components
      var tempPlot = JSON.parse(JSON.stringify(this.state.plots[number]));
      const xName = config["times.star"]["1"];
      const yName = config["data.star"][(number + 1).toString(10)].value;
      const infoName = config["data.star"][(number + 1).toString(10)].info;

      for (var c = 0; c < mergedData.length; c++) {
        tempPlot.x.push(mergedData[c][xName]);
        tempPlot.y.push(mergedData[c][yName]);
        tempPlot.info.push(mergedData[c][infoName]);

        //remove
        //const keyName = config["times.star"].key;
        // const key = mergedData[j][keyName];
        // this.removeDataPoint(key, "times.star", "times")
        // this.removeDataPoint(key, "data.star", "data")
      }
      return tempPlot;
    }
  };

  // removeDataPoint = (key, name, array) => {
  //   const keyName = this.state.config[name].key;
  //   var temp = [...this.state[array]];
  //   console.log(keyName);

  //   var index = temp.findIndex((x) => x[keyName] === key);

  //   if (index !== -1) {
  //     temp.splice(index, 1);
  //     this.setState((state) => {
  //       return {
  //         times: temp,
  //       };
  //     });
  //   }
  // };

  render() {
    //init
    const { timesLoaded, dataLoaded, config } = this.state;
    const { classes } = this.props;
    const nrPlots = Object.keys(config["data.star"]).length - 1;
    var graphs = [];
    //for (var i = 0; i < Object.keys(config.plots).length; i++) {
    for (var i = 0; i < nrPlots; i++) {
      graphs.push(
        <Grid item xs={11} lg={5} key={i}>
          <Plot
            attr={this.updatePlot(i)}
            title={config["data.star"][(i + 1).toString(10)].name}
          />
        </Grid>
      );
    }

    //return
    if (!(timesLoaded || dataLoaded)) {
      return <Backdrop />;
    } else {
      return (
        <React.Fragment>
          <div className={classes.root}>
            <NavBar />
            <Grid container spacing={0} justify="center">
      
              <Grid item xs={10}>
                <Typography variant="h5" gutterBottom>
                  Table
                </Typography>
                <Divider light={true} variant={"middle"} />
              </Grid>
              <Grid item xs={10}>
                <Table />
              </Grid>

              <Grid item xs={10}>
                <Typography variant="h5" gutterBottom>
                  Plots
                </Typography>
                <Divider light={true} variant={"middle"} />
              </Grid>
              {graphs}
            </Grid>

          </div>
        </React.Fragment>

        //<Activity />
        //<Table />
        //<div>Hello!!!It is {times._mmsdateAuqired_Value} </div>
      );
    }
  }
}

export default withStyles(styles)(App);
