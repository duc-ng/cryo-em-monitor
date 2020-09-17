const chokidar = require("chokidar");
const config = require("./../config.json");
const path = require("path");
const Reader = require("./Reader");

class FileWatcher {
  constructor(memory) {
    this.memory = memory;
    this.reader = new Reader();
    this.errorCount = 0;
    this.watcher = chokidar.watch(
      path.join(config.app.rootDir, "*", "*", "*.star"),
      {
        ignored: /^\./,
        persistent: true,
        awaitWriteFinish: true,
      }
    );
  }

  start = () => {
    this.watcher.on("add", async (dirPath) => {
      dirPath = dirPath.substring(0, dirPath.lastIndexOf("/"));
      try {
        const files = await Promise.all([
          this.reader.readStarFile(path.join(dirPath, "data.star")),
          this.reader.readStarFile(path.join(dirPath, "times.star")),
          this.reader.readStarFile(path.join(dirPath, "images.star")),
        ]);
        const merge = { ...files[0], ...files[1], ...files[2] };
        this.memory.add(merge, dirPath);
      } catch (error) {
        this.errorCount++;
        console.log(this.errorCount + ". File reading error "+dirPath);
      }
    });
  };
}

module.exports = FileWatcher;
