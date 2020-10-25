const config = require("./../config.json");
const winston = require("winston");

class Logger {
  constructor() {
    this.logger = winston.createLogger({
      level: "info",
      format: winston.format.json(),
      transports: [
        new winston.transports.File({
          filename: "logs/" + this.getTime(true) + ".log",
        }),
      ],
    });

    // log to the `console` with colors
    if (process.env.NODE_ENV !== "production") {
      this.logger.add(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize(),
            winston.format.simple()
          ),
        })
      );
    }
  }

  getTime = (isDate) => {
    const d = new Date();
    if (isDate) {
      return (
        ("0" + d.getDate()).slice(-2) +
        "-" +
        ("0" + (d.getMonth() + 1)).slice(-2) +
        "-" +
        d.getFullYear()
      );
    } else {
      return (
        ("0" + d.getHours()).slice(-2) +
        ":" +
        ("0" + (d.getMinutes() + 1)).slice(-2)
      );
    }
  };

  log = (level, message) => {
    this.logger.log({
      level: level,
      message: this.getTime(false) + " " + message,
    });
  };
}

module.exports = Logger;
