const config = require("./../config.json");
const winston = require("winston");
require("winston-daily-rotate-file");

class Logger {
  constructor() {
    //init
    const { isOn, maxFiles } = config.app.autodelete;
    this.logger = winston.createLogger({
      transports: [
        new winston.transports.DailyRotateFile({
          filename: "logs/%DATE%.log",
          datePattern: "YYYY-MM-DD",
          maxSize: "20m",
          maxFiles: isOn ? maxFiles + "d" : null,  //autoDelete
        }),
      ],
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
