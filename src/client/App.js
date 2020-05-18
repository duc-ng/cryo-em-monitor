import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import Graphs from "./Graphs";
import NavBar from "./Header";
import Backdrop from "./Backdrop";
import Typography from "@material-ui/core/Typography";
import { Divider } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/styles";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      config: require("./../config.json"),
      timesLoaded: false,
      dataLoaded: false,
      times: [],
      data: [],
    };
  }

  componentDidMount() {
    const socket = socketIOClient(
      this.state.config.app.host + ":" + this.state.config.app.port
    );

    //new times.star
    socket.on("newTimes", (item) => {
      this.setState({
        timesLoaded: true,
        times: this.state.times.concat([item]),
      });
    });

    //new data.star
    socket.on("newData", (item) => {
      this.setState({
        dataLoaded: true,
        data: this.state.data.concat([item]),
      });
    });
  }

  //filter data for graphs
  getGraphData = (value) => {
    //init
    const { config, times, data } = this.state;
    const key1 = config.files[Object.keys(config.files)[0]].value0;
    const key2 = config.files[Object.keys(config.files)[1]].value0;
    const dateAcquired = "_mmsdateAuqired_Value";
    const valueNames = [];
    const infoNames = [];
    for (
      var i = 1;
      i < Object.values(Object.values(config.files)[1]).length - 1;
      i = i + 2
    ) {
      valueNames.push(Object.values(Object.values(config.files)[1])[i]);
      infoNames.push(Object.values(Object.values(config.files)[1])[i + 1]);
    }

    //inner join by key
    var mergedArray = [];
    for (var a = 0; a < times.length; a++) {
      for (var j = 0; j < data.length; j++) {
        if (times[a][key1] === data[j][key2]) {
          const mergedObj = { ...times[a], ...data[j] };
          mergedArray.push(mergedObj);
        }
      }
    }

    //filter
    const x = mergedArray.map((elem) => {
      return elem[dateAcquired];
    });
    const y = mergedArray.map((elem) => {
      return elem[valueNames[value]];
    });
    const info = mergedArray.map((elem) => {
      return elem[infoNames[value]];
    });
    var result = { x, y, info };
    return result;
  };

  render() {
    //init
    const { timesLoaded, dataLoaded, config } = this.state;
    var graphs = [];
    for (var i = 0; i < Object.keys(config.plots).length; i++) {
      graphs.push(
        <Grid item xs={12} lg={6}>
          <Graphs
            attr={this.getGraphData(i)}
            key={i}
            title={Object.values(config.plots)[i]}
          />
        </Grid>
      );
    }

    const { classes } = this.props;

    //return
    if (!(timesLoaded && dataLoaded)) {
      return <Backdrop />;
    } else {
      return (
        <React.Fragment>
          <div className={classes.root}>
            <NavBar />
            <Grid container spacing={0} justify="center">
              <Grid item xs={11}>
                <Typography variant="h5" gutterBottom>
                  {" "}
                  Graphs{" "}
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

App.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(App);
