import React, { Component } from "react";
import Plot from "react-plotly.js";

export default class Graphs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      response: true,
      line1: {
        x: this.props.coord.x,
        y: this.props.coord.y, 
        name: 'Line 1',
        mode: "markers",
        type: "scatter",
      },
      layout: {
        title: "Title Loading",
        xaxis: {
          type: "date",
          //range: [],
          //tickformat: '%H:%M'
        },
        //autosize: false,
        height: 300,
      }
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.coord !== prevProps.coord) {
      var temp = this.state.line1;
      temp.x = this.props.coord.x;
      temp.y = this.props.coord.y;
      this.setState((state, props) => {
        return {line1: temp};
      });
    }
  }

  
  render() {
    return (
      <React.Fragment>
        {this.state.response ? (
          <Plot
            revision={this.state.revision}
            data={[this.state.line1]}
            layout={this.state.layout}
          />
        ) : (
          <p>Loading...</p>
        )}
      </React.Fragment>
    );
  }
}