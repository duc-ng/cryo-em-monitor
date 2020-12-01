const config = require("./../config.json");
const path = require("path");
const Reader = require("./Reader");
const Memory = require("./Memory");
const Logger = require("./Logger");
const fg = require("fast-glob");
const async = require("async");

class FileWatcher {
  constructor(subfolder) {
    this.subfolder = subfolder;
    this.memory = new Memory();
    this.reader = new Reader();
    this.logger = new Logger();
    this.errorCount = 0;
    this.directory = path.join(config.app.rootDir, subfolder, "*", "*");

    let queue = async.queue(async (file, cb) => {
      await this.read(file);
      cb(); //has to be invoked
    }, 100);

    queue.drain(() => {
      console.log("all items have been processed");
    });

    this.readLoop = async () => {
      const dirKeys = await fg([this.directory], { onlyDirectories: true });
      for (let i = 0; i < dirKeys.length; i++) {
        if (!this.memory.has(dirKeys[i])) {
          queue.push(dirKeys[i]);
        }
      }
    };

    this.readLoop();
    setInterval(this.readLoop, 10000);
  }

  read = async (filePath) => {
    // const dirPath = filePath.substring(0, filePath.lastIndexOf("/"));
    const dirPath = filePath;
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
        this.memory.add(obj, this.subfolder);
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
