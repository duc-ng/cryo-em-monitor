const config = require("./src/config.json");
const fs = require("fs");
const path = require("path");
const Logger = require("./src/server/Logger");
const readline = require("readline");

class Test {
  constructor() {
    this.logger = new Logger();
    this.dataStar = fs.readFileSync(path.join("test", "data.star"), "utf8");
    this.imagesStar = fs.readFileSync(path.join("test", "images.star"), "utf8");
    this.timesStar = fs.readFileSync(path.join("test", "times.star"), "utf8");
    this.imgSrc = [
      "ctfdiag",
      "driftplot",
      "motionCorrAvg",
      "pick",
      "psMotionCorrAvg",
      "psRawAvg",
      "rawAvg",
    ];
    this.imgFilenames = this.imgSrc.map((x) =>
      fs.readdirSync(path.join("test", x))
    );
    this.readline = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    this.startLoop();
  }

  startLoop = async () => {
    let n = 0;
    this.readline.question(
      "How many files do you want to generate? > ",
      async (x) => {
        if (Number.isInteger(parseInt(x))) n = x;
        for (let i = 0; i < n; i++) {
          await this.sleep(config.test.loopMs);
          if (i > n - 5) {
            this.createFiles(true);
          } else {
            this.createFiles(false);
          }
          console.log("Files generated: " + (i + 1));
        }
        this.startLoop();
      }
    );
  };

  sleep = (ms) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
  };

  createFiles = (withImages) => {
    //generate star files
    let key = this.generateKey();
    let d = this.dataStar.replace(/XXX/g, key);
    let i = this.imagesStar.replace(/XXX/g, key);
    let t = this.timesStar.replace(/XXX/g, key);
    d = d.replace(/VVV/g, this.generateValue);
    d = d.replace(/PPP/g, this.generateValue2Digit);
    t = t.replace(/AAA/g, this.generateDate(false));
    t = t.replace(/TTT/g, this.generateDate(true));
    t = t.replace(/EEE/g, this.generateError);

    //write star files
    const src = path.join(
      config.app.rootDir,
      config.test.folder,
      this.getFolder(),
      key.toString()
    );
    this.createFolder(src);
    this.writeFile("data.star", d, src);
    this.writeFile("images.star", i, src);
    this.writeFile("times.star", t, src);

    //write images
    // for (i = 0; i < this.imgSrc.length; i++) {
    //   let file = this.getRandomArrObj(this.imgFilenames[i]);
    //   let srcFrom = path.join("test", this.imgSrc[i], file);
    //   let srcTo = path.join(src, this.imgSrc[i] + ".png");
    //   this.writeImage(srcFrom, srcTo);
    // }
    if (withImages) {
      for (i = 0; i < this.imgSrc.length; i++) {
        let file = this.getRandomArrObj(this.imgFilenames[i]);
        let srcFrom = path.join("test", this.imgSrc[i], file);
        let srcTo = path.join(src, this.imgSrc[i] + ".png");
        this.writeImage(srcFrom, srcTo);
      }
    }
  };

  generateKey = () => {
    const val = Math.pow(10, 16);
    return Math.floor(val + Math.random() * 9 * val);
  };

  generateValue = () => {
    return Math.random();
  };

  generateValue2Digit = () => {
    return Math.floor(Math.random() * 100);
  };

  generateDate = (isErrorPossible) => {
    if (isErrorPossible) {
      return Math.random() < 0.05 ? 0 : this.getDate();
    } else {
      return this.getDate();
    }
  };

  generateError = () => {
    return Math.random() < 0.05 ? this.getDate() : 0;
  };

  getDate = () => {
    var d = new Date();
    return (
      d.getFullYear() +
      "-" +
      ("0" + (d.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + d.getDate()).slice(-2) +
      "-" +
      ("0" + d.getHours()).slice(-2) +
      ":" +
      ("0" + d.getMinutes()).slice(-2) +
      ":" +
      ("0" + d.getSeconds()).slice(-2)
    );
  };

  writeFile = (name, file, src) => {
    fs.writeFile(path.join(src, name), file, () => {});
  };

  getFolder = () => {
    var d = new Date();
    return (
      d.getFullYear() +
      "-" +
      ("0" + (d.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + d.getDate()).slice(-2)
    );
  };

  createFolder = (src) => {
    try {
      fs.mkdirSync(src, { recursive: true });
    } catch (err) {
      this.logger.log("error", "(Create folder) " + err);
    }
  };

  writeImage = (from, to) => {
    try {
      fs.copyFileSync(from, to);
    } catch (err) {
      this.logger.log("error", "(Create images) " + err);
    }
  };

  getRandomArrObj = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
  };
}

const test = new Test();
