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
    this.queue = async.queue(async (file, cb) => {
      await this.read(file);
      cb(); //mandatory
    }, 50); //max. 50 parallel read calls

    //poll new files
    let initFlag = true;
    this.initScan();
    this.queue.push("");
    this.queue.drain(() => {
      if (initFlag) {
        //only once
        this.logger.log("info", "Finished initial scan: " + this.subfolder);
        setInterval(this.initLoop, config.app.pollServerMs);
        initFlag = false;
      }
    });
  }

  initScan = () => {
    this.scan(config.app.maxDays);
  };

  initLoop = () => {
    this.scan(2);
  };

  scan = async (nrDays) => {
    let directory = path
      .join(
        process.env.ROOT_DATA,
        this.subfolder,
        this.getLastXDays(nrDays),
        "*"
      )
      .replace(/\\/g, "/");
    const dirKeys = await fg([directory], { onlyDirectories: true });
    dirKeys.forEach((file) => {
      let key = parseFloat(path.basename(file));
      if (!this.memory.has(key)) {
        this.queue.push(file);
      }
    });
  };

  getLastXDays = (nrDays) => {
    const dates = [...Array(nrDays)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return this.formatDate(d);
    });
    return "{" + dates.join(",") + "}";
  };

  formatDate = (d) => {
    return (
      d.getFullYear() +
      "-" +
      ("0" + (d.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + d.getDate()).slice(-2)
    );
  };

  read = async (dirPath) => {
    if (dirPath !== "") {
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
