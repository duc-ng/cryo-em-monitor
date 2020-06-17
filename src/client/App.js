import React, { Component, Fragment } from "react";
import socketIOClient from "socket.io-client";
import Plot from "./Plot";
import NavBar from "./Header";
import Backdrop from "./Backdrop";
import Table from "./Table";
import Status from "./Status";
import Images from "./Images";
import Typography from "@material-ui/core/Typography";
import { Divider } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/styles";
import { blueGrey } from "@material-ui/core/colors";

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
      config: require("./../config.json"),
      itemsLoaded: false,
      counter: 0,
      items: [],
      plots: [],
      table: [],
      tableNames: [],
      status: {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      },
      imageData:[],
      recentImages:[],
      imagesChanged: false
    };

    //init plot element
    let nrPlots = Object.keys(this.state.config["data.star"]).length - 1;
    var temp = [];
    for (let i = 0; i < nrPlots; i++) {
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
      this.state.config.app.api_host + ":" + this.state.config.app.api_port
    );

    socket.on("data", (item) => {
      //init
      const { config, plots, status } = this.state;
      const nrValues = Object.keys(this.state.config["data.star"]).length - 1;

      //update plot data
      let plotData = [...plots];
      for (let i = 0; i < nrValues; i++) {
        const xName = config["times.star"]["1"];
        const yName = config["data.star"][(i + 1).toString(10)].value;
        const infoName = config["data.star"][(i + 1).toString(10)].info;
        plotData[i].x.push(item[xName]);
        plotData[i].y.push(item[yName]);
        plotData[i].info.push(item[infoName]);
      }

      //update table data
      let tableValueNames = [];
      let tableData = {
        data: Object.assign({}, item), //may not work for more complex objects
        key: item[config["data.star"].key]
      };
      tableValueNames.push(config["times.star"][1]);
      for (let i = 1; i <= nrValues; i++) {
        tableValueNames.push(config["data.star"]["" + i].value);
      }
      for (let prop in tableData.data) {
        if (tableValueNames.indexOf(prop) === -1) {
          delete tableData.data[prop];
        }
      }
      for (let key in tableData.data) {
        let obj = tableData.data[key];
        if (Number(obj) === obj && obj % 1 !== 0) {
          tableData.data[key] = obj.toFixed(2);
        }
      }

      //update status data
      let statusObject = Object.assign({}, status);
      for (let i = 1; i < Object.keys(config["times.star"]).length; i++) {
        let value = item[config["times.star"][i]];
        if (value !== 0 && value !== undefined) {
          statusObject[i] = statusObject[i] + 1;
        }
      }

      //set state
      this.setState((state) => {
        return {
          itemsLoaded: true,
          items: state.items.concat([item]),
          plots: plotData,
          table: state.table.concat([tableData]),
          tableNames: tableValueNames,
          counter: state.counter + 1,
          status: statusObject,
        };
      });
    });

    //receive images
    socket.on("images", (item) => {
      this.setState((state) => {
        return {
          imageData: state.imageData.concat([item]),
          imagesChanged: true
        };
      });
    })
    this.interval = setInterval(() => this.updateImages(), 1000);
  }

  updateImages() {
    if(this.state.imagesChanged){
      this.setState(state => ({
        recentImages: [...(this.state.imageData[this.state.imageData.length-1].images)],
        imagesChanged: false
      }));
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  render() {
    //init
    const { itemsLoaded, config, plots } = this.state;
    const { classes } = this.props;
    const nrPlots = Object.keys(config["data.star"]).length - 1;
    var graphs = [];

    for (let i = 0; i < nrPlots; i++) {
      graphs.push(
        <Grid item xs={11} md={5} key={i}>
          <Plot
            attr={plots[i]}
            title={config["data.star"][(i + 1).toString(10)].name}
            counter={this.state.counter}
          />
        </Grid>
      );
    }

    //return
    if (!itemsLoaded) {
      return <Backdrop />;
    } else {
      return (
        <div className={classes.root}>
          <Fragment>
            <NavBar />
            <div style={{ padding: 20 }}>
              <Grid container spacing={4} justify="center">
                {/* Status */}
                <Grid item xs={10}>
                  <Typography variant="subtitle1" gutterBottom>
                    Status
                  </Typography>
                  <Divider light={true} variant={"middle"} />
                </Grid>
                <Grid item xs={11}>
                  <Grid container spacing={2} justify="center">
                    <Status values={this.state.status} />
                  </Grid>
                </Grid>

                {/* Data */}
                <Grid item xs={10}>
                  <Typography variant="subtitle1" gutterBottom>
                    Data
                  </Typography>
                  <Divider light={true} variant={"middle"} />
                </Grid>
                <Grid item xs={10}>
                  <Grid container spacing={2} justify="center">
                     <Images attr={this.state.recentImages} xs={4} sm={3} md={3} />
                  </Grid>
                </Grid>
                <Grid item xs={10}>
                  <Table
                    attr={this.state.table}
                    img ={this.state.recentImages}
                    images ={this.state.imageData}
                    valueNames={this.state.tableNames}
                  />
                </Grid>

                {/* Plots */}
                <Grid item xs={10}>
                  <Typography variant="subtitle1" gutterBottom>
                    Plots
                  </Typography>
                  <Divider light={true} variant={"middle"} />
                </Grid>
                {graphs}

                
              </Grid>
            </div>
          </Fragment>
        </div>
      );
    }
  }
}

export default withStyles(styles)(App);
