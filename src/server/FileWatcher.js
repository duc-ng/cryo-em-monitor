const chokidar = require("chokidar");
const config = require("./../config.json");
const path = require("path");
const Reader = require("./Reader");
const Memory = require("./Memory");
const Logger = require("./Logger");
const fs = require("fs");

class FileWatcher {
  constructor(subfolder) {
    this.memory = new Memory();
    this.reader = new Reader();
    this.logger = new Logger();
    this.errorCount = 0;
    this.directory = path.join(
      config.app.rootDir,
      subfolder,
      "*",
      "*",
      "*.star"
    );

    this.watcher = chokidar.watch(this.directory, {
      ignored: /^\./,
      persistent: true,
      awaitWriteFinish: true,
    });

    this.watcher
      .on("add", (dirPath) => this.read(dirPath, subfolder))
      .on("change", (dirPath) => this.read(dirPath, subfolder));

    // this.watcher = sane(this.directory, {
    //   glob: ["**/*.star"],
    // });
    // this.watcher.on("ready", function () {
    //   console.log("ready");
    // });
    // this.watcher.on("add", function (filepath, root, stat) {
    //   console.log("file added", filepath);
    // });
  }

  read = async (filePath, subfolder) => {
    const dirPath = filePath.substring(0, filePath.lastIndexOf("/"));
    const dataStar = path.join(dirPath, "data.star");
    const timesStar = path.join(dirPath, "times.star");
    const imagesStar = path.join(dirPath, "images.star");

    this.watcher.unwatch(filePath);
    try {
      // await fs.promises.access(dataStar);
      // await fs.promises.access(timesStar);
      // await fs.promises.access(imagesStar);
      const files = await Promise.all([
        this.reader.readStarFile(dataStar),
        this.reader.readStarFile(timesStar),
        this.reader.readStarFile(imagesStar),
      ]);
      const merge = { ...files[0], ...files[1] };
      const obj = { path: dirPath, data: merge, times: files[2] };

      if (Object.keys(merge).length !== 0) {
        this.memory.add(obj, subfolder);
      }
    } catch (error) {
      this.errorCount++;
      this.logger.log(
        "error",
        "(File reading) " + this.errorCount + ". " + error
      );
    }
  };

  set memory(val) {
    this.mem = val;
  }

  get memory() {
    return this.mem;
  }
}

module.exports = FileWatcher;
