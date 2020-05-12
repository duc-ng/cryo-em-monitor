const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");
const fs = require("fs");
const reader = require("./src/server/reader");
const chokidar = require("chokidar");
const config = require("./src/config.json");

//init
const host = config.app.host;
const port = process.env.PORT || config.app.port;
var folder = config.data.folder;
var maxAge = config.data.maxAge_min;
app.get("/", (req, res) => res.send("Server is running!"));

//create websocket connection
io.on("connection", function (socket) {
  //start notification
  console.log("a user connected");

  //if new star file is added -> push to client
  var watcher = chokidar.watch(folder, {
    ignored: /^\./,
    persistent: true,
  });
  watcher.on("add", function (file) {

    //times.star
    if (
      file.endsWith(Object.keys(config.files)[0]) &&
      reader.fileIsYoungerThan(file, maxAge)
    ) {
      reader.readStarFile(file).then((res) => {
        socket.emit("newTimes", res);
      });
    }

    //data.star
    if (
      file.endsWith(Object.keys(config.files)[1]) &&
      reader.fileIsYoungerThan(file, maxAge)
    ) {
      reader.readStarFile(file).then((res) => {
        socket.emit("newData", res);
      });
    }

    //images
    // if (
    //   file.endsWith(config.get("starFiles.names.file3")) &&
    //   reader.fileIsYoungerThan(file, maxHours)
    // ) {
    //   reader.readStarFile(file).then((res) => {
    //     var fixedValues = 1;
    //     for (i = fixedValues; i < Object.keys(res).length; i = i + 2) {
    //       var filePath = path.join(
    //         __dirname,
    //         path.dirname(file),
    //         Object.values(res)[i]
    //       );
    //       fs.readFile(filePath, function (err, data) {
    //         socket.emit(
    //           "newImages",
    //           "data:image/png;base64," + data.toString("base64")
    //         );
    //         console.log("Image sent");
    //       });
    //     }
    //     socket.emit("newImageData", res);
    //   });
    // }
  });

  //end notification
  socket.on("disconnect", function () {
    console.log("user disconnected");
  });
});

//listen for incoming connections
http.listen(port, () => {
  console.log(`Server app listening at ${host}:${port}`);
});
