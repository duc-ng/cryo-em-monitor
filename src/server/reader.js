//init modules
const path = require("path");
const fs = require("fs");
const fspromises = require("fs").promises;
const config = require("./../config.json");

//replace specific char in string
String.prototype.replaceAt = function (index, replacement) {
  return (
    this.substr(0, index) +
    replacement +
    this.substr(index + replacement.length)
  );
};

//true, if creation date of file is older than x minutes
function fileIsYoungerThan(file, time) {
  const { birthtime } = fs.statSync(file);
  return new Date() - birthtime < time  * 60 * 1000;
}

/*
convert star-file to object
assumption: first value is fixed (key)
*/
async function readStarFile(file) {
  try {
    //read file
    var data = await fspromises.readFile(file, "utf8");
    var substrings = data.split(/[\n,\t]+/);

    //remove first two and last line
    substrings.shift();
    substrings.shift();
    substrings.pop();

    //init variables
    var valueCount = Math.floor(substrings.length / 2);

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

  } catch (err) {
    console.log(err);
    return;
  }
}

//export functions
module.exports.fileIsYoungerThan = fileIsYoungerThan;
module.exports.readStarFile = readStarFile;
