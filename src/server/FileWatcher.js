const config = require("./../config.json");
const path = require("path");
const Reader = require("./Reader");
const Memory = require("./Memory");
const Logger = require("./Logger");
const glob = require("glob");

class FileWatcher {
  constructor(subfolder) {
    this.memory = new Memory();
    this.reader = new Reader();
    this.logger = new Logger();
    this.errorCount = 0;
    this.directory = path.join(config.app.rootDir, subfolder, "*");

    this.readLoop = () => {
      glob(this.directory, (err, files) => {
        files.map((date) => {
          glob(path.join(date, "*"), (err, files) => {
            files.map((file) => {
              let key = path.basename(file);
              if (!this.memory.has(key)) {
                this.read(file, subfolder);
              }
            });
          });
        });
      });
    };

    //get all "date-directories"
    this.readLoop();
    setInterval(this.readLoop, 20000);
  }

  read = async (filePath, subfolder) => {
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
