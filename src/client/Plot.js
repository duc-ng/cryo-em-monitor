import React, { Component, Fragment } from "react";
import Plot from "react-plotly.js";
import Paper from '@material-ui/core/Paper';

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
        },
        "titlefont": {
          "size": 14,
        },
        // paper_bgcolor: 'rgba(0,0,0,0)',
        // plot_bgcolor: 'rgba(0,0,0,0)',
        
        xaxis: {
          type: "date",
          //tickformat: '%H:%M'
        },
        yaxis: {
          range: [0,1]
        },
        autosize: true,
        height: 320,
        margin: {
          't': 80,
          'b': 70,
          'l': 50,
          'r': 30,
        },
        datarevision: 0,
      },
      config: {
        displayModeBar: false
      },
      style: { 
        width: "100%", 
      },
      counter: 0,
      
    };
  }

  updateDimensions = () => {    
    this.setState({ 
      revision: this.state.revision+1
    });
  };

  updateData = () => {
      var temp = this.state.line1;
      temp.x = this.props.attr.x;
      temp.y = this.props.attr.y;
      temp.hovertext = this.props.attr.info;
      var temp2 = this.state.layout;
      temp2.title.text = this.props.title;
      temp2.datarevision = this.state.revision + 1;

      this.setState({ 
        line1: temp,
        layout: temp2,
        revision: this.state.revision+1,
      });
  }

  componentDidMount() {
    this.updateData();
  }

  componentDidUpdate(prevProps) {
    if(this.props.counter !== prevProps.counter){
      this.updateData();
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
          <Paper>
          <Plot
            revision={this.state.revision}
            data={[this.state.line1]}
            layout={this.state.layout}
            config={this.state.config}
            style={this.state.style}
          />
          </Paper>
        
        ) : (
          <p>Loading...</p>
        )}
      </Fragment>
    );
  }
}