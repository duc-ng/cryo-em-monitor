const fs = require("fs");
const fspromises = require("fs").promises;
const config = require("./../config.json");

/*
  convert star-file to object
  assumption: first value is fixed (key) 
*/
class Reader {
  async readStarFile(file) {
    const { birthtime } = fs.statSync(file);
    const { rootDirDaysOld } = config.app;

    if (new Date() - birthtime < rootDirDaysOld * 24 * 60 * 60 * 1000) {
      //read file
      var data = await fspromises.readFile(file, "utf8");
      var substrings = data.split(/[\n,\t]+/);

      //remove first two and last line
      substrings.shift();
      substrings.shift();
      substrings.pop();

      //get number of properties
      var valueCount = 0
      for (i = 0; i < substrings.length; i++) {
        if (substrings[i][0]=="_"){
          valueCount++;
        } else {
          break;
        }
      }

      //clean data
      for (i = 0; i < substrings.length; i++) {
        substrings[i] = substrings[i].trim();
        substrings[i] = substrings[i].replace('"', "");
        substrings[i] = substrings[i].replace('"', "");

        //dates
        if (
          i > valueCount &&
          file.endsWith("times.star") &&
          substrings[i].length > 1
        ) {
          substrings[i] = substrings[i].replaceAt(10, " ");
        }

        //numeric values
        if (i >= valueCount && substrings[i].match(/^[0-9.]+$/) != null) {
          substrings[i] = parseFloat(substrings[i]);
        }
      }

      //convert to object
      var object = {};
      for (var i = 0; i < valueCount; ++i)
        object[substrings[i]] = substrings[i + valueCount];

      //Return
      return object;
    }
  }
}

//replace specific char in string
String.prototype.replaceAt = function (index, replacement) {
  return (
    this.substr(0, index) +
    replacement +
    this.substr(index + replacement.length)
  );
};

module.exports = Reader;
