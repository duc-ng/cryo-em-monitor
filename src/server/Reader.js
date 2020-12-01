const fs = require("fs");

/*
  converting star-file to object
*/
class Reader {
  async readStarFile(file) {
    //read file
    var data = await fs.promises.readFile(file, "utf8");
    var keys = [];
    var values = [];

    //remove empty strings and first two lines
    data = data.split(/[\n,\t]+/);
    data = data.map((e) => e.trim());
    data = data.filter(Boolean);
    data.shift();
    data.shift();

    //format and get keys/values
    for (i = 0; i < data.length; i++) {
      if (data[i].startsWith("_")) {
        keys.push(data[i]);
      } else {
        //text
        data[i] = data[i].replace('"', "");
        data[i] = data[i].replace('"', "");

        //date
        if (file.endsWith("times.star") && data[i][10] === "-") {
          data[i] = data[i].replaceAt(10, " ");
        }

        //numerics (e.g. 0.123 or 4.214e-05)
        if (data[i].match(/^[0-9.e-]+$/) != null) {
          data[i] = parseFloat(data[i]);
        }
        values.push(data[i]);
      }
    }

    //convert to object
    var object = {};
    for (var i = 0; i < keys.length; ++i) object[keys[i]] = values[i];

    return object;
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
