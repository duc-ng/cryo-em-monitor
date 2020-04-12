//init server and load modules
const express = require("express");
const http = require("http");
const app = express();
app.set("port", process.env.PORT || 3000);
const server = http.createServer(app);
const io = require("socket.io").listen(server);
const path = require("path");
const reader = require("./reader");
const chokidar = require("chokidar");

//set static folder
app.use(express.static(path.join(__dirname, "public")));

//create websocket connection
io.on("connection", function (socket) {
  //start notification
  console.log("a user connected");

  //init variables
  var folder = "4Duc/data4Web/Titan1/";
  var maxHours = 1000000;

  //if new star file is added -> push to client
  var watcher = chokidar.watch(folder, { ignored: /^\./, persistent: true });
  watcher.on("add", function (path) {
    //data.star
    if (
      path.endsWith("data.star") &&
      reader.fileIsYoungerThan(path, maxHours)
    ) {
      file = reader.readStarFile(path);
      socket.emit("newData", file);
    }

    //image.star
    if (
      path.endsWith("images.star") &&
      reader.fileIsYoungerThan(path, maxHours)
    ) {
      file = reader.readStarFile(path);
      console.log(file);
      socket.emit("newImages", file);
    }
  });

  //end notification
  socket.on("disconnect", function () {
    console.log("user disconnected");
  });
});

//Create server
server.listen(app.get("port"), () =>
  console.log(`App listening at http://localhost:${app.get("port")}`)
);
