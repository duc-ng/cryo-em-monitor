const express = require("express");
const app = express();
const path = require("path");
const FileWatcher = require("./src/server/FileWatcher");
const Logger = require("./src/server/Logger");
const config = require("./src/config.json");
const fspromises = require("fs").promises;
const cors = require("cors");
const compression = require("compression");
require("dotenv").config();

//init app
app.use(cors());
app.use(compression());
app.use(express.static(path.join(__dirname, "build")));
app.listen(config.app.api_port, () => {
  logger.log("info", "Server started");
});

//init others
const fw = config.microscopes.map((x) => new FileWatcher(x.folder));
const logger = new Logger();

//API: home
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

//API: sync data
app.get("/data", (req, res) => {
  logger.log("info", "Received fetch request.");
  const memory = fw[req.query.microscope].memory;
  const lastKey = parseInt(req.query.lastKey);

  if (lastKey === 0) {
    var newData = memory.getDataFromTo(req.query.from, req.query.to);
  } else {
    var newData = memory.getDataNewerThan(lastKey);
  }

  res.json({
    data: newData,
    id: req.query.id,
  });

  if (newData !== null) {
    logger.log("info", "Items sent: " + newData.length);
  }
});

//API: image by key + type
app.get("/image", async (req, res) => {
  const memory = fw[req.query.microscope].memory;
  const key = parseFloat(req.query.key);
  const type = parseFloat(req.query.type);
  const filename = memory.getData(key).times[config["images.star"][type].value];
  const info = memory.getData(key).times[config["images.star"][type].info];

  if (memory.has(key)) {
    let filePath = path.join(memory.getPath(key), filename);
    try {
      let image = await fspromises.readFile(filePath);
      res.json({
        data: "data:image/jpeg;base64," + image.toString("base64"),
        info: info,
      });
    } catch (error) {
      logger.log("error", "(Reading image) " + error);
      res.json({ data: undefined, info: "" });
    }
  } else {
    res.json({ data: undefined, info: "" });
  }
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
