import React, { Component, Fragment } from "react";
import Plot from "react-plotly.js";

export default class Graphs extends Component {
    
  constructor(props) {
    super(props);
    this.state = {
      revision: 0,
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
          //tickformat: '%H:%M'
        },
        yaxis: {
          range: [0,1]
        },
        autosize: true,
        height: 350
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
      this.setState({ 
        line1: temp
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