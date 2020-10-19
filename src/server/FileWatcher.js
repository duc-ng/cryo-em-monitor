const chokidar = require("chokidar");
const config = require("./../config.json");
const path = require("path");
const Reader = require("./Reader");
const Memory = require("./Memory");

class FileWatcher {
  constructor(subfolder) {
    this.memory = new Memory();
    this.reader = new Reader();
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
      usePolling: true,
    });

    this.watcher.on("add", async (dirPath) => {
      dirPath = dirPath.substring(0, dirPath.lastIndexOf("/"));
      try {
        const files = await Promise.all([
          this.reader.readStarFile(path.join(dirPath, "data.star")),
          this.reader.readStarFile(path.join(dirPath, "times.star")),
          this.reader.readStarFile(path.join(dirPath, "images.star")),
        ]);
        const merge = { ...files[0], ...files[1], ...files[2] };
        this.memory.add(merge, dirPath, subfolder);
      } catch (error) {
        this.errorCount++;
        console.log(
          this.errorCount +
            ". File reading error " +
            dirPath +
            " (" +
            subfolder +
            ")"
        );
      }
    });
  }

  set memory(val) {
    this.mem = val;
  }

  get memory() {
    return this.mem;
  }
}

module.exports = FileWatcher;
