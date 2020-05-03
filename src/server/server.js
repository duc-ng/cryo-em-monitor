const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");
const fs = require("fs");
const reader = require("./reader");
const chokidar = require("chokidar");

//start
const port = process.env.PORT || 5000;
var folder = "4Duc/data4Web/Titan1/";
var maxHours = 1000000;
app.get("/", (req, res) => res.send("Server is running!"));

//create websocket connection
io.on("connection", function (socket) {
  //start notification
  console.log("a user connected");

  //if new star file is added -> push to client
  var watcher = chokidar.watch(folder, { ignored: /^\./, persistent: true });
  watcher.on("add", function (file) {
    //data.star
    if (
      file.endsWith("data.star") &&
      reader.fileIsYoungerThan(file, maxHours)
    ) {
      reader.readStarFile(file).then((res) => {
        socket.emit("newData", res);
      });
    }

    //image.star
    if (
      file.endsWith("images.star") &&
      reader.fileIsYoungerThan(file, maxHours)
    ) {
      reader.readStarFile(file).then((res) => {
        var fixedValues = 1;
        for (i = fixedValues; i < Object.keys(res).length; i = i + 2) {
          var filePath = path.join(
            __dirname,
            path.dirname(file),
            Object.values(res)[i]
          );
          fs.readFile(filePath, function (err, data) {
            socket.emit(
              "newImages",
              "data:image/png;base64," + data.toString("base64")
            );
            console.log("Image sent");
          });
        }
        socket.emit("newImageData", res);
      });
    }
  });

  //end notification
  socket.on("disconnect", function () {
    console.log("user disconnected");
  });
});

//listen for incoming connections
http.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
