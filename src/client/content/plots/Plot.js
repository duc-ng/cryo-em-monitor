import React, { Component, Fragment } from "react";
import Plot from "react-plotly.js";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

const styles = (theme) => ({});

class Graphs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      revision: 0,
      response: true,
      trace1: {
        x: [],
        y: [],
        marker: {
          color: props.theme.palette.success.main,
        },
        name: "",
        mode: "markers",
        type: "scatter",
        showlegend: false,
        //hoverinfo: "text",
        xbins: {
          size: 0.1,
        },
        hoverinfo: "y",
      },
      trace2: {
        x: [],
        y: [],
        marker: {
          color: props.theme.palette.primary.main,
        },
        name: "",
        mode: "markers",
        type: "scatter",
        showlegend: false,
        xbins: {
          size: 0.1,
        },
        hoverinfo: "y",
      },
      layout: {
        title: {
          text: "",
          x: 0.06,
        },
        font: {
          family: props.theme.typography.fontFamily,
          color: props.theme.palette.text.primary,
        },
        titlefont: {
          size: 14,
          color: props.theme.palette.warning.main,
        },
        hovermode: "closest",
        updatemenus: [
          {
            buttons: [
              {
                args: [{ type: "scatter" }, {}],
                label: "Scatter",
                method: "update",
              },
              {
                args: [{ type: "histogram" }, {}],
                label: "Histogram",
                method: "update",
              },
            ],
            direction: "left",
            pad: { r: 10, t: 10 },
            showactive: true,
            type: "buttons",
            x: 1.05,
            xanchor: "right",
            y: 1.35,
            yanchor: "top",
            font: {
              color: props.theme.palette.primary.main,
            },
            bgcolor: "rgba(0,0,0,0)",
            bordercolor: "rgba(0,0,0,0)",
            color: props.theme.palette.primary.main,
          },
        ],
        barmode: "stack",
        bargap: 0.1,
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",

        xaxis: {
          type: "date",
          //tickformat: '%H:%M'
          zeroline: true,
          gridcolor: props.theme.palette.text.secondary,
          linecolor: props.theme.palette.text.secondary,
        },
        yaxis: {
          rangemode: "tozero",
          gridcolor: props.theme.palette.text.secondary,
        },
        autosize: true,
        height: 320,
        margin: {
          t: 80,
          b: 50,
          l: 40,
          r: 0,
        },
        datarevision: 0,
      },
      config: {
        displayModeBar: false,
      },
      style: {
        width: "100%",
      },
      counter: 0,
    };
  }

  //update dimensions
  updateDimensions = () => {
    this.setState({
      revision: this.state.revision + 1,
    });
  };

  updateData = () => {
    //split data
    const { minOptimum, maxOptimum } = this.props.color;
    var trace1 = this.state.trace1;
    var trace2 = this.state.trace2;
    trace1.x = [];
    trace2.x = [];
    trace1.y = [];
    trace2.y = [];
    for (let i = 0; i < this.props.attr.x.length; i++) {
      let value = this.props.attr.y[i];
      if (value >= minOptimum && value <= maxOptimum) {
        trace1.x.push(this.props.attr.x[i]);
        trace1.y.push(value);
      } else {
        trace2.x.push(this.props.attr.x[i]);
        trace2.y.push(value);
      }
    }

    //update plot info
    var temp2 = this.state.layout;
    temp2.title.text = this.props.title;
    temp2.datarevision = this.state.revision + 1;

    //update scatter and histogram
    temp2.updatemenus[0].buttons[0].args[0].x = [trace1.x, trace2.x];
    temp2.updatemenus[0].buttons[1].args[0].x = [trace1.y, trace2.y];

    //set state
    this.setState({
      trace1: trace1,
      trace2: trace2,
      layout: temp2,
      revision: this.state.revision + 1,
    });
  };

  componentDidMount() {
    this.updateData();
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.counter !== prevProps.counter ||
      this.props.counter2 !== prevProps.counter2
    ) {
      this.updateData();
    }
    window.addEventListener("resize", this.updateDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  render() {
    console.log("Updated: " + this.props.title);

    return (
      <Fragment>
        {this.state.response ? (
          <Paper>
            <Plot
              revision={this.state.revision}
              data={[this.state.trace1, this.state.trace2]}
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

export default withStyles(styles, { withTheme: true })(Graphs);
