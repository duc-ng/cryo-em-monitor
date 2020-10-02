const express = require("express");
const app = express();
const path = require("path");
const Memory = require("./src/server/Memory");
const FileWatcher = require("./src/server/FileWatcher");
const config = require("./src/config.json");
const fspromises = require("fs").promises;

//init
const memory = new Memory();
const fileWatcher = new FileWatcher(memory);
fileWatcher.start();
app.use(express.static(path.join(__dirname, "build")));

//API: home
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

//API: sync data
app.get("/data", (req, res) => {
  const key = req.query.lastKey;
  if (key == "ALL") {
    const data = memory.getDataAll();
    if (data.length === 0) {
      res.send({ data: null });
    } else {
      res.send({ data: data, id: req.query.id });
      console.log("Items sent: " + data.length);
    }
  } else if (!memory.has(key)) {
    res.send({ data: "RESTART" });
  } else if (key === memory.getLastKey()) {
    res.send({ data: null });
  } else {
    const newData = memory.getDataNewerThan(key.toString());
    res.send({ data: newData, id: req.query.id });
    console.log("Items sent: " + newData.length);
  }
});

//API: images by key
app.get("/imagesAPI", async (req, res) => {
  if (memory.has(req.query.key)) {
    let imageObjects = [];
    let merge = memory.getData(req.query.key);
    for (const [k, v] of Object.entries(config["images.star"])) {
      if (merge[v.file] != undefined && merge[v.info] != undefined) {
        let filePath = path.join(memory.getPath(req.query.key), merge[v.file]);
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
  } else {
    res.send([]);
  }
});

//API: images by key + type
app.get("/imageSingleAPI", async (req, res) => {
  if (memory.has(req.query.key)) {
    let filePath = path.join(memory.getPath(req.query.key), req.query.filename);
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
app.listen(config.app.api_port, () => {
  console.log(
    `Server app listening at ${config.app.api_host}:${config.app.api_port} (API)`
  );
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
