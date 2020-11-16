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
    this.maxArrSize = this.maxHeapSize / config.app.avgDataPointSize;
    this.keysSorted = []; //sorted object keys
    this.dataValues = new Map(); //hashtable: key -> objects
    this.logger = new Logger();
  }

  getData = (key) => {
    return this.dataValues.get(key);
  };

  getDataAll = () => {
    return this.keysSorted.map((key) => this.getData(key).data);
  };

  getPath = (key) => {
    return this.dataValues.get(key).path;
  };

  has = (key) => {
    return this.dataValues.has(key);
  };

  getDataFromTo = (from, to) => {
    let f = from === "undefined" ? new Date(0) : new Date(from);
    let t = to === "undefined" ? new Date() : new Date(to);

    const arr = this.keysSorted
      .map((key) => this.getData(key).data)
      .filter((obj) => {
        let a = new Date(obj[config["times.star"][0].value]);
        return a >= f && a < t;
      });

    return arr;
  };

  getDataNewerThan = (key) => {
    if (this.has(key)) {
      const data = this.getData(key).data;
      if (data !== undefined) {
        let index = this.getIndexByKey(key);
        if (index < this.keysSorted.length) {
          return this.getDataAll().slice(index);
        }
      }
    }
    return null;
  };

  getLastKey = () => {
    if (this.keysSorted.length > 0) {
      const key = this.keysSorted[this.keysSorted.length - 1];
      return this.getData(key).data[config.key].toString();
    } else {
      return undefined;
    }
  };

  add = (obj, subfolder) => {
    const key = obj.data[config.key];
    const date = obj.data[config["times.star"][0].value];

    if (!this.dataValues.has(key) && date !== undefined) {
      //insert
      this.dataValues.set(key, obj);
      let i = this.getIndexByDate(date);
      if (i === this.keysSorted.length) {
        this.logger.log("info", "call spread");
        this.keysSorted = [...this.keysSorted, key];
      } else {
        this.logger.log("info", "call splice()");
        this.keysSorted.splice(i, 0, key);
      }

      //manage memory
      if (this.keysSorted.length > this.maxArrSize) {
        this.dataValues.delete(this.keysSorted.shift());
      }

      //log
      this.logger.log(
        "info",
        this.keysSorted.length + ". Add: " + key + " (" + subfolder + ")"
      );
    }
  };

  getIndexByDate = (date) => {
    let i = 0;
    for (i = this.keysSorted.length - 1; i >= 0; i--) {
      let a = new Date(
        this.getData(this.keysSorted[i]).data[config["times.star"][0].value]
      );
      if (new Date(date) - a >= 0) {
        break;
      }
    }
    return i + 1;
  };

  getIndexByKey = (key) => {
    for (var i = this.keysSorted.length - 1; i >= 0; i--) {
      if (this.keysSorted[i] === key) {
        break;
      }
    }
    return i + 1;
  };
}

module.exports = Memory;
