const config = require("./../config.json");
const path = require("path");
const Reader = require("./Reader");
const Memory = require("./Memory");
const Logger = require("./Logger");
const glob = require("glob");
var sane = require("sane");

class FileWatcher {
  constructor(subfolder) {
    this.memory = new Memory();
    this.reader = new Reader();
    this.logger = new Logger();
    this.errorCount = 0;

    let self = this;
    let dirGlob = path.join(config.app.rootDir, subfolder, "*", "*", "*.star");
    var watcher = sane(config.app.rootDir, {
      glob: [path.join(subfolder, "*", "*", "*.star")],
      watchman: true,
    });

    watcher.on("ready", () => {
      glob(dirGlob, async (er, files) => {
        for (let i = 0; i < files.length; i++) {
          await self.read(files[i], subfolder);
          if (i === files.length) {
            this.logger.log("info", "Server is ready.");
          }
        }
      });
    });

    watcher.on("add", (filepath, root, stat) => {
      const dir = path.join(config.app.rootDir, filepath);
      self.read(dir, subfolder);
    });
  }

  read = async (filePath, subfolder) => {
    const dirPath = filePath.substring(0, filePath.lastIndexOf("/"));
    const dataStar = path.join(dirPath, "data.star");
    const timesStar = path.join(dirPath, "times.star");
    const imagesStar = path.join(dirPath, "images.star");

    try {
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
