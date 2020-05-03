//init modules
const path = require("path");
const fs = require("fs");
const fspromises = require("fs").promises;

//replace specific char in string
String.prototype.replaceAt = function (index, replacement) {
  return (
    this.substr(0, index) +
    replacement +
    this.substr(index + replacement.length)
  );
};

//true, if creation date of file is older than x hours
function fileIsYoungerThan(file, hours) {
  const { birthtime } = fs.statSync(file);
  return new Date() - birthtime < hours * 60 * 60 * 1000;
}

/*
convert star-file to object
assumption: first 5 values are fixed (1 key + 4 dates)
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
    var fixedValues = 0;
    if (file.endsWith("data.star")) {
      fixedValues = 5;
    } else if (file.endsWith("images.star")) {
      fixedValues = 1;
    } else {
      console.log("error: file reading");
    }

    //clean data
    for (i = 0; i < substrings.length; i++) {
      substrings[i] = substrings[i].trim();
      substrings[i] = substrings[i].replace('"', "");
      substrings[i] = substrings[i].replace('"', "");

      //if key or numeric value -> convert to float
      if (
        i == valueCount ||
        (!isNaN(parseFloat(substrings[i])) && i > valueCount + fixedValues - 1)
      ) {
        substrings[i] = parseFloat(substrings[i]);
      }

      //clean dates
      if (i > valueCount && i < valueCount + fixedValues) {
        substrings[i] = substrings[i].replaceAt(10, " ");
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
    return
  }
}

//export functions
module.exports.fileIsYoungerThan = fileIsYoungerThan;
module.exports.readStarFile = readStarFile;