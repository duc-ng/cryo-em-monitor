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
const host = config.app.api_host;
const port = config.app.api_port;
const folder = config.app.folder;
const maxAge = config.app.maxAge_min;
app.get("/", (req, res) => res.send("Server is running!"));


//websocket
io.on("connection", function (socket) {

  //init
  console.log("User connected");
  var watcher = chokidar.watch(folder, {
    ignored: /^\./,
    persistent: true,
  });
  watcher.on("addDir", function (dirPath) {
    readDir(dirPath);
  });

  //read star files
  async function readDir(dirPath) {
    console.log("Directory read: "+dirPath);
    if (reader.fileIsYoungerThan(dirPath, maxAge)) {
      try {
        var files = await Promise.all([
          reader.readStarFile(path.join(dirPath,"data.star")),
          reader.readStarFile(path.join(dirPath,"times.star"))
        ]);
      } catch (error){
        return;
      }
      let merge = {...files[0], ...files[1]}; 
      socket.emit("data", merge);
    }
  }

  //end 
  socket.on("disconnect", function () {
    console.log("User disconnected");
  });

});

//listen for incoming connections
http.listen(port, () => {
  console.log(`Server app listening at ${host}:${port} (API)`);
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