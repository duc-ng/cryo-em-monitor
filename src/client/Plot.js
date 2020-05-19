import React, { Component, Fragment } from "react";
import Plot from "react-plotly.js";

export default class Graphs extends Component {
    
  constructor(props) {
    super(props);
    this.state = {
      revision: 0,
      response: true,
      line1: {
        x: [],
        y: [],
        name: 'Line 1',
        mode: "markers",
        type: "scatter",
        hoverinfo: "text",
        hovertext: "",
      },
      layout: {
        title: {
          text: "",
          x: 0.06,
          size: 16
        },
        xaxis: {
          type: "date",
          //tickformat: '%H:%M'
        },
        yaxis: {
          range: [0,1]
        },
        autosize: true,
        height: 350,
        margin: {
          't': 80,
          'd': 20,
          'l': 50,
          'r': 50,
        },

      },
      config: {
        displayModeBar: false
      },
      style: { 
        width: "100%", 
        //height: "100%"
      },
    };
  }

  updateDimensions = () => {    
    this.setState({ 
      revision: this.state.revision+1
    });
  };

  componentDidUpdate(prevProps) {
    if (this.props.attr !== prevProps.attr) {
      var temp = this.state.line1;
      temp.x = this.props.attr.x;
      temp.y = this.props.attr.y;
      temp.hovertext = this.props.attr.info;
      var temp2 = this.state.layout;
      temp2.title.text = this.props.title;

      this.setState({ 
        line1: temp,
        layout: temp2
      });
    }
    window.addEventListener('resize', this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateDimensions);
  }
  
  render() {
    return (
      <Fragment>
        {this.state.response ? (
          <Plot
            revision={this.state.revision}
            data={[this.state.line1]}
            layout={this.state.layout}
            config={this.state.config}
            style={this.state.style}
          />
        ) : (
          <p>Loading...</p>
        )}
      </Fragment>
    );
  }
}