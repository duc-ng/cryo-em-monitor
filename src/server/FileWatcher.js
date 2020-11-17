const chokidar = require("chokidar");
const config = require("./../config.json");
const path = require("path");
const Reader = require("./Reader");
const Memory = require("./Memory");
const Logger = require("./Logger");

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
  }

  read = async (filePath, subfolder) => {
    const dirPath = filePath.substring(0, filePath.lastIndexOf("/"));
    this.watcher.unwatch(filePath);
    try {
      const files = await Promise.all([
        this.reader.readStarFile(path.join(dirPath, "data.star")),
        this.reader.readStarFile(path.join(dirPath, "times.star")),
        this.reader.readStarFile(path.join(dirPath, "images.star")),
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
