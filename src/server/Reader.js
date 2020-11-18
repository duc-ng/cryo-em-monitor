const fs = require("fs");
const config = require("./../config.json");

/*
  converting star-file to object
  files have to be no older than x days
*/
class Reader {
  async readStarFile(file) {
    const { birthtime } = fs.statSync(file);
    if (
      new Date() - birthtime <
      config.app.dataNotOlderThan * 24 * 60 * 60 * 1000
    ) {
      //read file
      var data = await fs.promises.readFile(file, "utf8");
      var substrings = data.split(/[\n,\t]+/);
      var keys = [];
      var values = [];

      //remove empty strings and first two lines
      substrings = substrings.map((e) => e.trim());
      substrings = substrings.filter(Boolean);
      substrings.shift();
      substrings.shift();

      //format and get keys/values
      for (i = 0; i < substrings.length; i++) {
        if (substrings[i].startsWith("_")) {
          keys.push(substrings[i]);
        } else {
          //text
          substrings[i] = substrings[i].replace('"', "");
          substrings[i] = substrings[i].replace('"', "");

          //date
          if (file.endsWith("times.star") && substrings[i][10] === "-") {
            substrings[i] = substrings[i].replaceAt(10, " ");
          }

          //numerics (e.g. 0.123 or 4.214e-05)
          if (substrings[i].match(/^[0-9.e-]+$/) != null) {
            substrings[i] = parseFloat(substrings[i]);
          }
          values.push(substrings[i]);
        }
      }

      //convert to object
      var object = {};
      for (var i = 0; i < keys.length; ++i) object[keys[i]] = values[i];

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
