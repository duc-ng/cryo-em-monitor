const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");
const Reader = require("./src/server/reader");
const chokidar = require("chokidar");
const config = require("./src/config.json");
const fspromises = require("fs").promises;
const cors = require('cors')

//init
const { rootDir } = config.app;
var data = [];
var images = new Map();
app.use(cors())

//file watcher
const watcher = chokidar.watch(rootDir, {
  ignored: /^\./,
  persistent: true,
});
watcher.on("addDir", async (dirPath) => {
  //read data
  const reader = new Reader();
  try {
    var files = await Promise.all([
      reader.readStarFile(path.join(dirPath, "data.star")),
      reader.readStarFile(path.join(dirPath, "times.star")),
      reader.readStarFile(path.join(dirPath, "images.star")),
    ]);
  } catch (error) {
    return;
  }
  let merge = { ...files[0], ...files[1], ...files[2] };
  data.push(merge);
  console.log(data.length);

  //read images
  let key = data[data.length - 1][[config.key]];
  let imageObjects = [];
  for (const [k, v] of Object.entries(config["images.star"])) {
    if (merge[v.file] != undefined && merge[v.info] != undefined) {
      let filePath = path.join(dirPath, merge[v.file]);
      try {
        var image = await fspromises.readFile(filePath);
      } catch (error) {
        console.log("Error image: " + filePath);
        return;
      }
      if (image != undefined) {
        imageObjects.push({
          data: "data:image/jpeg;base64," + image.toString("base64"),
          label: merge[v.info],
          key: key
        });
      }
    }
  }
  images.set("" + key, imageObjects);
});

//send data continously
io.on("connection", (socket) => {
  //init
  console.log("User connected");
  let lastDate = undefined;
  socket.emit("initLastDate", 1);
  socket.on("lastDate", (item) => {
    lastDate = item;
  });

  //sync data with client
  let interval = setInterval(() => {
    if (lastDate != undefined) {
      let filtered = data.filter((x) => {
        let delta = Date.now() - new Date(x._mmsdateAuqired_Value);
        return lastDate - delta > 0;
      });
      if (filtered.length != 0) {
        lastDate = undefined; //lock
        socket.emit("data", filtered);
        console.log("data sent: " + filtered.length);
      }
    }
  }, 1000);

  //end
  socket.on("disconnect", function (reason) {
    clearInterval(interval);
    console.log("User disconnected: " + reason);
  });
});

//send images, when requested
app.get("/imagesAPI", function (req, res) {
  if (images.has(req.query.key)) {
    res.send(images.get(req.query.key));
  } else {
    res.send([]);
  }
});

//listen for incoming connections
const { api_host, api_port } = config.app;
app.get("/", (req, res) => res.send("API is working!"));
http.listen(api_port, () => {
  console.log(`Server app listening at ${api_host}:${api_port} (API)`);
});

//exit handling
process.stdin.resume();
function exitHandler(options, exitCode) {
  if (exitCode || exitCode === 0) process.exit();
  if (options.exit) process.exit();
}
process.on("exit", exitHandler.bind(null, { cleanup: true }));
process.on("SIGINT", exitHandler.bind(null, { exit: true }));
process.on("SIGUSR1", exitHandler.bind(null, { exit: true }));
process.on("SIGUSR2", exitHandler.bind(null, { exit: true }));
process.on("uncaughtException", exitHandler.bind(null, { exit: true }));