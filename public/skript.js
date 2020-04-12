//variables
var fixedDataPoints = 5;

/*
initializes variables and plots
assumption: all star files have the same object structure
*/
function init(firstDataPoint) {
  //iterate through all non-fixed star values
  for (i = fixedDataPoints; i < Object.keys(firstDataPoint).length; i = i + 2) {
    //create div
    var div = document.createElement("div");
    div.id = "chart" + i;
    var container = document.getElementById("chart-container");
    container.appendChild(div);

    //init plot
    var data = [
      {
        y: [],
        x: [],
        mode: "markers",
        type: "scatter",
      },
    ];
    var layout = {
      title: Object.values(firstDataPoint)[i + 1],
      xaxis: {
        type: "date",
        //tickformat: '%H:%M'
      },
      //autosize: false,
      //height: 300,
    };
    Plotly.newPlot(div.id, data, layout);
  }
}

/*
fill data points in plots
assumption: all star files have the same object structure
*/
function updatePlot(datapoint) {
  for (i = fixedDataPoints; i < Object.keys(datapoint).length; i = i + 2) {
    Plotly.extendTraces(
      "chart" + i,
      {
        x: [[Object.values(datapoint)[4]]],
        y: [[Object.values(datapoint)[i]]],
      },
      [0]
    );
  }
}

/*
TODO: update activity boxes
*/
function updateActivity(datapoint) {
  //TODO: check for real default value
  var default_value = "0";

  //Box 1: Images Recorded
  if (datapoint._mmsdateAuqired_Value != default_value) {
    var value = parseInt(document.getElementById("imagesRecorded").innerHTML);
    document.getElementById("imagesRecorded").innerHTML = value + 1;
  }

  //Box 2: Images Imported
  if (datapoint._mmsdateImported_Value != default_value) {
    var value = parseInt(document.getElementById("imagesImported").innerHTML);
    document.getElementById("imagesImported").innerHTML = value + 1;
  }

  //Box 3: Images Processed
  if (datapoint._mmsdateProcessed_Value != default_value) {
    var value = parseInt(document.getElementById("imagesProcessed").innerHTML);
    document.getElementById("imagesProcessed").innerHTML = value + 1;
  }

  //Box 4: Processing errors
  if (datapoint._mmsdateExported_Value != default_value) {
    var value = parseInt(document.getElementById("processingErrors").innerHTML);
    document.getElementById("processingErrors").innerHTML = value + 1;
  }
}

//main: receive new data
var socket = io();
var noData = true;
socket.on("newData", function (datapoint) {
  if (noData) {
    init(datapoint);
    noData = false;
  }
  updateActivity(datapoint);
  updatePlot(datapoint);
});

socket.on("newImages", function (datapoint) {});
