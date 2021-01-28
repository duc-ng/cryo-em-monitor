const express = require("express");
const app = express();
const path = require("path");
const FileWatcher = require("./src/server/FileWatcher");
const Logger = require("./src/server/Logger");
const config = require("./src/config.json");
const fspromises = require("fs").promises;
const cors = require("cors");
const compression = require("compression");
const AutoDelete = require("./src/server/AutoDelete");
require("dotenv").config();

const PORT = process.env.REACT_APP_PORT;

// init app
app.use(cors());
app.use(compression());
app.use(express.static(path.join(__dirname, "build")));
app.listen(PORT, () => {
  logger.log("info", "Server is listening on port: " + PORT);
});
const fw = config.microscopes.map((x) => new FileWatcher(x.folder));
const logger = new Logger();
const autoDelete = new AutoDelete();
autoDelete.start();

// API: home
app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

// API: sync data
app.get("/data", (req, res) => {
  try {
    const memory = fw[req.query.microscope].memory;
    const lastKey = parseInt(req.query.lastKey);
    logger.log("debug", "Received fetch request (data): " + lastKey);
    const newData =
      lastKey === 0
        ? memory.getDataFromTo(req.query.from, req.query.to)
        : memory.getDataNewerThan(lastKey);

    res.json({
      data: newData,
      id: req.query.id,
    });
    const ret = !newData ? null : newData.length;
    logger.log("info", "Items sent: " + ret);
  } catch (err) {
    logger.log("error", "(Fetch data) " + err);
  }
});

// API: image
app.get("/image", async (req, res) => {
  try {
    const memory = fw[req.query.microscope].memory;
    const key = parseFloat(req.query.key);
    const type = parseFloat(req.query.type);
    const filename = memory.getData(key).times[
      config["images.star"][type].value
    ];
    logger.log(
      "debug",
      "Received fetch request (image): " + key + " " + filename
    );
    const info = memory.getData(key).times[config["images.star"][type].info];
    const response = { data: undefined, info: info };

    if (memory.has(key)) {
      const filePath = path.join(memory.getPath(key), filename);
      try {
        const image = await fspromises.readFile(filePath);
        response.data = "data:image/jpeg;base64," + image.toString("base64");
      } catch (error) {
        logger.log("error", "(Reading image) " + error);
      }
    }

    res.json(response);
    logger.log("debug", "Image sent: " + key + " " + filename);
  } catch (err) {
    logger.log("error", "(Fetch image) " + err);
  }
});

// exit handling
process.stdin.resume();
const exitHandler = (options, exitCode) => {
  if (exitCode === 0) {
    logger.log("info", "\nApp excited with code " + exitCode);
  } else {
    logger.log("debug", "\nApp excited with code " + exitCode);
  }
  if (options.exit) process.exit();
};
process.on("exit", exitHandler.bind(null, { cleanup: true }));
process.on("SIGINT", exitHandler.bind(null, { exit: true }));
process.on("SIGUSR1", exitHandler.bind(null, { exit: true }));
process.on("SIGUSR2", exitHandler.bind(null, { exit: true }));
process.on("uncaughtException", exitHandler.bind(null, { exit: true }));
