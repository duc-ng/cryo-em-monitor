import React, { Component } from "react";
import socketIOClient from "socket.io-client";
import Plot from "react-plotly.js";

class Graphs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      response: false,
      endpoint: "localhost:5000",
      nrGraphs: 5, 
      data: [
        {
          y: [],
          x: [],
          mode: "markers",
          type: "scatter",
        },
      ],
      layout: {
        title: "Graph 1",
        xaxis: {
          type: "date",
          range: ['2020-07-01', '2020-12-31'],
          //tickformat: '%H:%M'
        },
        //autosize: false,
        //height: 300,
      },
      frames: [],
      config: {},
    };
  }

  componentDidMount() {
    const { endpoint } = this.state;
    const socket = socketIOClient(endpoint);
    socket.on("newData", (data) => this.setState({ response: data }));
  }

  render() {
    const { response } = this.state;
    return (
      <div>
        {response ? (
          <Plot
            data={this.state.data}
            layout={this.state.layout}
            frames={this.state.frames}
            config={this.state.config}
            onInitialized={(figure) => this.setState(figure)}
            onUpdate={(figure) => this.setState(figure)}
          />
        ) : (
          //The temperature in Florence is: {response._mmsImageKey_Value} °F

          <p>Loading...</p>
        )}
      </div>
    );
  }
}

export default Graphs;
