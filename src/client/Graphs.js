import React, { Component } from "react";
import Plot from "react-plotly.js";

export default class Graphs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      response: true,
      revision: 0,
      line1: {
        x: [props.x],
        y: [props.y], 
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
        //height: 300,
      }
    };
  }

  addData = () =>  {
    const { line1, layout } = this.state;
    line1.x.push(this.props.x)
    line1.y.push(this.props.y)
    this.setState({ revision: this.state.revision + 1 });
  }

  render() {
    return (
      <div>
        {this.state.response ? (
          <Plot
            revision={this.state.revision}
            data={[this.state.line1]}
            layout={this.state.layout}
          />
        ) : (
          <p>Loading...</p>
        )}
      </div>
    );
  }
}