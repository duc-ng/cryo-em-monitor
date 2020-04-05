//call API: images recorded
function fetchImagesRecorded() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var myObj = JSON.parse(this.responseText);
      document.getElementById("imagesRecorded").innerHTML = myObj.number;
    }
  };
  xmlhttp.open("GET", "/api/imagesrecorded", true);
  xmlhttp.send();
}
fetchImagesRecorded()
setInterval(fetchImagesRecorded, 1000);

//call API: images recorded
function fetchImagesImported() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var myObj = JSON.parse(this.responseText);
      document.getElementById("imagesImported").innerHTML = myObj.number;
    }
  };
  xmlhttp.open("GET", "/api/imagesimported", true);
  xmlhttp.send();
}
fetchImagesImported()
setInterval(fetchImagesImported, 1000);

//call API: images processed
function fetchImagesProcessed() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var myObj = JSON.parse(this.responseText);
      document.getElementById("ImagesProcessed").innerHTML = myObj.number;
    }
  };
  xmlhttp.open("GET", "/api/imagesprocessed", true);
  xmlhttp.send();
}
fetchImagesProcessed()
setInterval(fetchImagesProcessed, 1000);


//call API: processing errors
function fetchProcessingErrors() {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var myObj = JSON.parse(this.responseText);
      document.getElementById("processingErrors").innerHTML = myObj.number;
    }
  };
  xmlhttp.open("GET", "/api/processingerrors", true);
  xmlhttp.send();
}
fetchProcessingErrors()
setInterval(fetchProcessingErrors, 1000);


//call API: get plot data
function fetchMeanValue(callback) {
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      return callback (JSON.parse(this.responseText));
    }
  };
  xmlhttp.open("GET", "/api/plotdata", true);
  xmlhttp.send();
}

//draw charts
function drawPlot(type) {
  fetchMeanValue(function (plotdata) {

    //init variables
    var xData = plotdata.map((a) => a.mmsdateProcessed_Value);
    var yData;
    var info;
    var divElement;

    switch(type){
      case 1: 
        yData = plotdata.map((a) => a.mmsmean_Value);
        info = plotdata[0].mmsmean_Info;
        divElement = "chart1";
        break;
      case 2: 
        yData = plotdata.map((a) => a.mmsdrift_Value);
        info = plotdata[0].mmsdrift_Info;
        divElement = "chart2";
        break;
      case 3: 
        yData = plotdata.map((a) => a.mmsiciness_Value);
        info = plotdata[0].mmsiciness_Info;
        divElement = "chart3";
        break;
      case 4: 
        yData = plotdata.map((a) => a.mmsdefocus_Value);
        info = plotdata[0].mmsdefocus_Info;
        divElement = "chart4";
        break;
      case 5: 
        yData = plotdata.map((a) => a.mmsresolution_Value);
        info = plotdata[0].mmsresolution_Info;
        divElement = "chart5";
        break;
      case 6: 
        yData = plotdata.map((a) => a.mmsccOfCtfFit_Value);
        info = plotdata[0].mmsccOfCtfFit_Info;
        divElement = "chart6";
        break;
      default: console.log ("error: Wrong plot type number")
    }

    //init plot
    var data = [
      {
        x: xData,
        y: yData,
        mode: "markers",
        type: "scatter",
      },
    ];

    var layout = {
      title: info,
      xaxis: {
        type: "date",
        //tickformat: '%H:%M'
      },
    };

    //draw plot
    Plotly.react(divElement, data, layout);
  });
}
setInterval(drawPlot, 1000, 1);
setInterval(drawPlot, 1000, 2);
setInterval(drawPlot, 1000, 3);
setInterval(drawPlot, 1000, 4);
setInterval(drawPlot, 1000, 5);
setInterval(drawPlot, 1000, 6);
