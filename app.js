const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");
const Reader = require("./src/server/reader");
const chokidar = require("chokidar");
const config = require("./src/config.json");
const fspromises = require("fs").promises;
const cors = require("cors");

//init
const { rootDir } = config.app;
const reader = new Reader();
var data = [];
var images = new Map();
app.use(cors());

//file watcher
const watcher = chokidar.watch(path.join(rootDir, "*", "*"), {
  ignored: /^\./,
  persistent: true,
});

//sorted insertion
function insertInOrder(obj) {
  let i = getIndexToInsert(new Date(obj._mmsdateAuqired_Value));
  data.splice(i, 0, obj);
}

function getIndexToInsert(date) {
  let i = 0;
  for (i = data.length - 1; i >= 0; i--) {
    let a = new Date(data[i]._mmsdateAuqired_Value);
    if (date - a >= 0) {
      break;
    }
  }
  return i + 1;
}

//reader
let nrOfErrors = 0;
watcher.on("addDir", async (dirPath) => {
  setTimeout(async () => {
    //read data
    try {
      var files = await Promise.all([
        reader.readStarFile(path.join(dirPath, "data.star")),
        reader.readStarFile(path.join(dirPath, "times.star")),
        reader.readStarFile(path.join(dirPath, "images.star")),
      ]);
    } catch (error) {
      nrOfErrors++;
      //console.log("Please increase >waitTimeFileCreationInMs< in config.app");
      console.log(nrOfErrors + " File reading errors:");
      return;
    }

    //save data
    let merge = { ...files[0], ...files[1], ...files[2] };
    insertInOrder(merge);
    console.log(data.length + ". File read: " + merge["_mmsdateAuqired_Value"]);

    //save image path + index
    let key = merge[config.key];
    images.set("" + key, { path: dirPath, data: merge });
  }, config.app.waitTimeFileCreationInMs);
});

//send data continously
var userCounter = 0;
io.on("connection", (socket) => {
  //init
  let userID = ++userCounter;
  console.log("Client " + userID + ": connected");

  //get last date of clients data
  let lastDate = undefined;
  socket.emit("initLastDate", 1);
  socket.on("lastDate", (item) => {
    lastDate = item;
  });

  //sync data with client
  let interval = setInterval(() => {
    if (lastDate != undefined) {
      let index = getIndexToInsert(new Date(lastDate));
      let filtered = data.slice(index);
      if (filtered.length != 0) {
        lastDate = undefined;
        socket.emit("data", filtered);
        console.log("Client " + userID + ": items sent: " + filtered.length);
      }
    }
  }, config.app.refreshNewDataInMs);

  //end
  socket.on("disconnect", function(reason) {
    clearInterval(interval);
    console.log("Client " + userID + ": disconnected – " + reason);
  });
});

//send images by key
app.get("/imagesAPI", async (req, res) => {
  if (images.has(req.query.key)) {
    let imageObjects = [];
    let merge = images.get(req.query.key).data;
    for (const [k, v] of Object.entries(config["images.star"])) {
      if (merge[v.file] != undefined && merge[v.info] != undefined) {
        let filePath = path.join(images.get(req.query.key).path, merge[v.file]);
        let image = undefined;
        try {
          image = await fspromises.readFile(filePath);
        } catch (error) {
          console.log("Error reading image: " + filePath);
        }
        if (image != undefined) {
          imageObjects.push({
            data: "data:image/jpeg;base64," + image.toString("base64"),
            label: merge[v.info],
            name: merge[v.file],
            key: req.query.key,
          });
        }
      }
    }
    res.send(imageObjects);
    // console.log("Fetched " + imageObjects.length + " images.");
  } else {
    res.send([]);
  }
});

//send images by key + type
app.get("/imageSingleAPI", async (req, res) => {
  if (images.has(req.query.key)) {
    let filePath = path.join(images.get(req.query.key).path, req.query.filename);
    try {
      var image = await fspromises.readFile(filePath);
      res.setHeader("Content-Type", "image/png");
      res.send(image);
    } catch (error) {
      console.log("Error reading image: " + filePath);
    }
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
