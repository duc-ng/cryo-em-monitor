const config = require("./../config.json");
const v8 = require("v8");

class Memory {
  constructor() {
    this.maxHeapSize = //in Byte
      config.app.heapAllocation === "auto"
        ? v8.getHeapStatistics().total_available_size / 2
        : config.app.heapAllocation;
    this.avgDataPointSize = 1400; //in Byte
    this.maxArrSize = this.maxHeapSize / this.avgDataPointSize;
    this.keysSorted = [];
    this.dataValues = new Map();
  }

  getData = (key) => {
    // console.log(this.dataValues.get(key))
    return this.dataValues.get(key).data;
  };

  getDataAll = () => {
    return this.keysSorted.map((key) => this.getData(key));
  };

  getPath = (key) => {
    // console.log(this.dataValues.get(key))
    return this.dataValues.get(key).path;
  };

  has = (key) => {
    return this.dataValues.has(key);
  };

  getDataNewerThan = (key) => {
    const data = this.getData(key);
    if (data !== undefined) {
      let index = this.getIndexToInsert(
        new Date(data[config["times.star"].main])
      );
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

  add = (obj, dirPath) => {
    const key = obj[config.key].toString();
    const date = obj[config["times.star"].main];

    if (!this.dataValues.has(key)) {
      //insert
      this.dataValues.set(key, { path: dirPath, data: obj });
      let i = this.getIndexToInsert(date);
      this.keysSorted.splice(i, 0, key);

      //manage memory
      if (this.keysSorted.length > this.maxArrSize) {
        this.dataValues.delete(this.keysSorted.shift());
      }

      console.log(this.keysSorted.length + ". File added: " + date);
      // this.keysSorted.map((key) =>
      //   console.log(this.getData(key)[config.key])
      // );
    }
  };

  getIndexToInsert = (date) => {
    let i = 0;
    for (i = this.keysSorted.length - 1; i >= 0; i--) {
      let a = new Date(
        this.getData(this.keysSorted[i])[config["times.star"].main]
      );
      if (new Date(date) - a >= 0) {
        break;
      }
    }
    return i + 1;
  };
}

module.exports = Memory;
