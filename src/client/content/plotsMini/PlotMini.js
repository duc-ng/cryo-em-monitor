import React, { Component } from "react";
import Plot from "react-plotly.js";
import Paper from "@material-ui/core/Paper";
import { withStyles } from "@material-ui/core/styles";
import { DataContext } from "./../../global/Data";
import Grid from "@material-ui/core/Grid";

class Graphs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      response: true,
      trace1: {
        x: [],
        y: [],
        marker: {
          color: props.theme.palette.success.main,
        },
        name: "",
        mode: "markers",
        type: "scattergl",
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
        type: "scattergl",
        showlegend: false,
        xbins: {
          size: 0.1,
        },
        hoverinfo: "y",
      },
      layout: {
        title: {
          text: "",
          x: 0.03,
          // y: 0.93,
        },
        font: {
          family: props.theme.typography.fontFamily,
          color: {},
        },
        titlefont: {
          size: 15,
          color: props.theme.palette.warning.main,
        },
        // annotations: [
        //   {
        //     text: "Cras mattis consectetur purus sit amet fermentum.",
        //     font: {
        //       size: 14,
        //       color: props.theme.palette.text.secondary,
        //     },
        //     showarrow: false,
        //     x: -0.031,
        //     y: 1.22,
        //     xref: "paper",
        //     yref: "paper",
        //   },
        // ],
        hovermode: "closest",
        updatemenus: [
          {
            buttons: [
              {
                args: [{ type: "scattergl" }, {}],
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
              size: 13,
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
          gridcolor: {},
          linecolor: {},
          rangemode: "tozero",
        },
        yaxis: {
          rangemode: "tozero",
          gridcolor: {},
          linecolor: {},
        },
        autosize: true,
        height: 320,
        margin: {
          t: 80,
          b: 50,
          l: 40,
          r: 0,
        },
        modebar: {
          bgcolor: "rgba(0,0,0,0)",
          color: props.theme.palette.divider,
        },
      },
      config: {
        // displayModeBar: true,
        displaylogo: false,
        modeBarButtonsToRemove: [
          "toImage",
          "zoom2d",
          "pan2d",
          "select2d",
          "autoScale2d",
          "lasso2d",
          "toggleSpikelines",
          "toggleHover",
          "hoverClosestCartesian",
          "hoverCompareCartesian",
        ],
      },
      style: {
        width: "100%",
      },
    };
  }

  //resizing window
  static contextType = DataContext;
  componentDidMount() {
    window.addEventListener("resize", () => this.handleResize());
  }
  componentWillUnmount() {
    window.removeEventListener("resize", () => this.handleResize());
  }
  debounce = (time) => {
    let timer;
    return (_) => {
      clearTimeout(timer);
      timer = setTimeout((_) => {
        timer = null;
        this.context.incCounter();
      }, time);
    };
  };
  handleResize = this.debounce(400);

  //render
  render() {
    var trace1 = this.state.trace1;
    trace1.x = this.props.attr.trace1.x;
    trace1.y = this.props.attr.trace1.y;

    var trace2 = this.state.trace2;
    trace2.x = this.props.attr.trace2.x;
    trace2.y = this.props.attr.trace2.y;

    var layout = this.state.layout;
    layout.title.text = this.props.title;
    layout.font.color = this.props.theme.palette.text.primary;
    layout.modebar.color = this.props.theme.palette.divider;
    layout.xaxis.gridcolor = this.props.theme.palette.divider;
    layout.xaxis.linecolor = this.props.theme.palette.divider;
    layout.yaxis.gridcolor = this.props.theme.palette.divider;
    layout.yaxis.linecolor = this.props.theme.palette.divider;
    layout.updatemenus[0].buttons[0].args[0].x = [trace1.x, trace2.x];
    layout.updatemenus[0].buttons[1].args[0].x = [trace1.y, trace2.y];

    console.log("Updated: Plots");
    return (
      <React.Fragment>
        {trace1.x.length !== 0 || trace2.x.length !== 0 ? (
          <Paper>
            <Plot
              data={[trace1, trace2]}
              layout={layout}
              config={this.state.config}
              style={this.state.style}
            />
          </Paper>
        ) : (
          <Paper style={{ height: layout.height }}>
            <Grid
              container
              justify="center"
              alignItems="center"
              style={{ height: "100%" }}
            >
              No Data
            </Grid>
          </Paper>
        )}
      </React.Fragment>
    );
  }
}

export default withStyles({}, { withTheme: true })(Graphs);
