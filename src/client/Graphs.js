import React, { Component } from "react";
import Plot from "react-plotly.js";

export default class Graphs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      response: true,
      line1: {
        x: this.props.attr.x,
        y: this.props.attr.y, 
        name: 'Line 1',
        mode: "markers",
        type: "scatter",
        hoverinfo: "text",
        hovertext: this.props.attr.info,
      },
      layout: {
        title: this.props.title,
        xaxis: {
          type: "date",
          //range: [],
          //tickformat: '%H:%M'
        },
        //autosize: false,
        height: 300,
      },
      config: {
        displayModeBar: false
      }
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.attr !== prevProps.attr) {
      var temp = this.state.line1;
      temp.x = this.props.attr.x;
      temp.y = this.props.attr.y;
      temp.hovertext = this.props.attr.info;
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
            config={this.state.config}
          />
        ) : (
          <p>Loading...</p>
        )}
      </React.Fragment>
    );
  }
}