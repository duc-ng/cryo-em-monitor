import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import Graphs from "./Graphs";
import NavBar from "./NavBar";
import Backdrop from "./Backdrop";
import Typography from '@material-ui/core/Typography';

export default class App extends Component {
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
  getGraphData = () => {
    //init 
    const { config, times, data } = this.state;
    var key1 = config.files[Object.keys(config.files)[0]].value0;
    var key2 = config.files[Object.keys(config.files)[1]].value0;

    //inner join by key
    var mergedArray = [];
    for (var i = 0; i < times.length; i++) {
      for (var j = 0; j < data.length; j++) {
        if (times[i][key1] === data[j][key2]) {
          const mergedObj = { ...times[i], ...data[j] };
          mergedArray.push(mergedObj);
        }
      }
    }

    //filter by x and y
    const x = mergedArray.map((elem) => {
      return elem._mmsdateAuqired_Value;
    });
    const y = mergedArray.map((elem) => {
      return elem._mmsmean_Value;
    });
    var result = { x, y };

    return result;
  };

  render() {
    //init
    const { timesLoaded, dataLoaded } = this.state;
    var graphs = [];
    for (var i = 0; i < 3; i++) {
        graphs.push(<Graphs coord={this.getGraphData()} key={i} />);
    } 

    //return
    if (!(timesLoaded && dataLoaded)) {
      return <Backdrop />
    } else {
      return (
        <React.Fragment>
          <NavBar />
          <Typography variant="h5" gutterBottom> Graphs </Typography>
          <Graphs coord={this.getGraphData()} />
          <div>{graphs}</div>;
        </React.Fragment>
      
        //<Activity />
        //<Table />
        //<div>Hello!!!It is {times._mmsdateAuqired_Value} </div>
      );
    }
  }
}