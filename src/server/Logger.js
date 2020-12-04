const config = require("./../config.json");
const winston = require("winston");
require("winston-daily-rotate-file");

class Logger {
  constructor() {
    this.config = {
      filename: "logs/%DATE%.log",
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
    };

    //AutoDelete
    if (config.app.autodelete.isOn) {
      this.config.maxFiles = config.app.autodelete.maxLogDays + "d";
    }

    this.logger = winston.createLogger({
      transports: [new winston.transports.DailyRotateFile(this.config)],
    });

    // log to the console with colors
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

  getTime = () => {
    const d = new Date();
    return (
      ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2)
    );
  };

  log = (level, message) => {
    this.logger.log({
      level: level,
      message: this.getTime() + " " + message,
    });
  };
}

module.exports = Logger;
