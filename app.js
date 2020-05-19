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
const port = config.app.port;
const folder = config.app.folder;
const maxAge = config.app.maxAge_min;
app.get("/", (req, res) => res.send("Server is running!"));

//websocket
io.on("connection", function (socket) {

  //init
  console.log("a user connected");
  var watcher = chokidar.watch(folder, {
    ignored: /^\./,
    persistent: true,
  });
  
  //if new star file is added -> push to client
  watcher.on("add", function (file) {

    //read times
    if (
      file.endsWith("times.star") &&
      reader.fileIsYoungerThan(file, maxAge)
    ) {
      reader.readStarFile(file).then((res) => {
        socket.emit("newTimes", res);
      });
    }

    //read data
    if (
      file.endsWith("data.star") &&
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

  //end 
  socket.on("disconnect", function () {
    console.log("user disconnected");
  });
});

//listen for incoming connections
http.listen(port, () => {
  console.log(`Server app listening at ${host}:${port}`);
});

//exit handling
process.stdin.resume();
function exitHandler(options, exitCode) {
    if (exitCode || exitCode === 0) console.log(0);
    if (options.exit) process.exit();
}
process.on('exit', exitHandler.bind(null,{cleanup:true}));
process.on('SIGINT', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));