const chokidar = require("chokidar");
const config = require("./../config.json");
const path = require("path");
const Reader = require("./Reader");
const Memory = require("./Memory");
const Logger = require("./Logger");
const fs = require("fs");
const glob = require("glob");

class FileWatcher {
  constructor(subfolder) {
    this.memory = new Memory();
    this.reader = new Reader();
    this.logger = new Logger();
    this.errorCount = 0;
    this.readCount = 0;
    this.directory = path.join(
      config.app.rootDir,
      subfolder,
      "*",
      "*",
      "*.star"
    );

    // this.watcher = chokidar.watch(this.directory, {
    //   ignored: /^\./,
    //   persistent: true,
    //   // awaitWriteFinish: true,
    //   ignoreInitial: true,
    // });

    // this.watcher
    //   .on("ready", () => console.log("Initial scan complete."))
    //   .on("add", (dirPath) => this.read(dirPath, subfolder));
    let self = this;
    glob(this.directory, function (er, files) {
      files.forEach((file) => {
        self.read(file, subfolder);
      });
    });
  }

  read = async (filePath, subfolder) => {
    const dirPath = filePath.substring(0, filePath.lastIndexOf("/"));
    const dataStar = path.join(dirPath, "data.star");
    const timesStar = path.join(dirPath, "times.star");
    const imagesStar = path.join(dirPath, "images.star");
    // this.watcher.unwatch(filePath);
    this.readCount++;
    console.log(this.readCount + ". read path");
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
