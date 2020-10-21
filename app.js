const express = require("express");
const app = express();
const path = require("path");
const FileWatcher = require("./src/server/FileWatcher");
const config = require("./src/config.json");
const fspromises = require("fs").promises;
const cors = require("cors");

//init app
app.use(cors());
app.use(express.static(path.join(__dirname, "build")));

//init file watchers
const mics = config.microscopes;
const fw = mics.map((x) => new FileWatcher(x.folder));

//API: home
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

//API: sync data
app.get("/data", async (req, res) => {
  const key = req.query.lastKey;
  const memory = fw[req.query.microscope].memory;
  const newData =
    key == "ALL"
      ? memory.getDataAll()
      : memory.getDataNewerThan(parseFloat(key));

  if (key === memory.getLastKey() || newData.length === 0) {
    res.send({ data: null });
  } else {
    const keyImage = newData[newData.length - 1][config.key];
    const imgs = await getImages(keyImage, memory);
    res.send({
      data: newData,
      id: req.query.id,
      images: imgs,
    });
    console.log("Items sent: " + newData.length);
  }
});

//get images of item
const getImages = async (key, memory) => {
  let images = [];
  let obj = memory.getData(key);
  for (const [k, v] of Object.entries(config["images.star"])) {
    if (obj[v.file] != undefined && obj[v.info] != undefined) {
      try {
        var filePath = path.join(
          memory.getPath(obj[config.key]),
          obj[v.file]
        );
        var image = await fspromises.readFile(filePath);
      } catch (error) {
        console.log("Error reading image: " + filePath);
      }
      if (image != undefined) {
        images.push({
          data: "data:image/jpeg;base64," + image.toString("base64"),
          label: obj[v.info],
          name: obj[v.file],
          key: obj[config.key],
        });
      }
    }
  }
  return images;
};

//API: images by key
app.get("/images", async (req, res) => {
  const key = parseFloat(req.query.key);
  const memory = fw[req.query.microscope].memory;
  const imgs = await getImages(key, memory);
  res.send(imgs);
});

//API: image by key + type
app.get("/image", async (req, res) => {
  const memory = fw[req.query.microscope].memory;
  const key = parseFloat(req.query.key);
  if (memory.has(key)) {
    let filePath = path.join(memory.getPath(key), req.query.filename);
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
