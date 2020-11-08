const config = require("./../config.json");
const Logger = require("./Logger");
const v8 = require("v8");

class Memory {
  constructor() {
    this.maxHeapSize = //in Byte
      config.app.heapAllocation === "auto"
        ? v8.getHeapStatistics().total_available_size /
          2 /
          Object.keys(config.microscopes).length
        : config.app.heapAllocation;
    this.avgDataPointSize = config.app.avgDataPointSize; //in Byte
    this.maxArrSize = this.maxHeapSize / this.avgDataPointSize;
    this.keysSorted = [];
    this.dataValues = new Map();
    this.logger = new Logger();
  }

  getData = (key) => {
    const val = this.dataValues.get(key);
    return val !== undefined ? val.data : val;
  };

  getDataAll = () => {
    return this.keysSorted.map((key) => this.getData(key));
  };

  getPath = (key) => {
    return this.dataValues.get(key).path;
  };

  has = (key) => {
    return this.dataValues.has(key);
  };

  getDataNewerThan = (key) => {
    const data = this.getData(key);
    if (data !== undefined) {
      let index = this.getIndexByKey(key);
      return this.getDataAll().slice(index);
    } else {
      return [];
    }
  };

  getLastKey = () => {
    if (this.keysSorted.length > 0) {
      const key = this.keysSorted[this.keysSorted.length - 1];
      return this.getData(key)[config.key].toString();
    } else {
      return undefined;
    }
  };

  add = (obj, dirPath, subfolder) => {
    const key = obj[config.key];
    const date = obj[config["times.star"][0].value];

    if (!this.dataValues.has(key) && date !== undefined) {
      //insert
      this.dataValues.set(key, { path: dirPath, data: obj });
      let i = this.getIndexByDate(date);
      this.keysSorted.splice(i, 0, key);

      //manage memory
      if (this.keysSorted.length > this.maxArrSize) {
        this.dataValues.delete(this.keysSorted.shift());
      }

      this.logger.log(
        "info",
        this.keysSorted.length + ". Add: " + key + " (" + subfolder + ")"
      );
    }
  };

  getIndexByKey = (key) => {
    for (var i = this.keysSorted.length - 1; i >= 0; i--) {
      if (this.keysSorted[i] === key) {
        break;
      }
    }
    return i + 1;
  };

  getIndexByDate = (date) => {
    let i = 0;
    for (i = this.keysSorted.length - 1; i >= 0; i--) {
      let a = new Date(
        this.getData(this.keysSorted[i])[config["times.star"][0].value]
      );
      if (new Date(date) - a >= 0) {
        break;
      }
    }
    return i + 1;
  };
}

module.exports = Memory;
