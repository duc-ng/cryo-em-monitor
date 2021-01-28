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

    //remove empty strings and first lines
    data = data.split(/[\n,\t]+/);
    data = data.map((e) => e.trim());
    data = data.filter(Boolean);
    while (data.length !== 0) {
      if (!data[0].startsWith("loop_")) {
        data.shift();
      } else {
        data.shift();
        break;
      }
    }

    //format and get keys/values
    for (let i = 0; i < data.length; i++) {
      if (data[i].startsWith("_")) {
        keys.push(data[i]);
      } else {
        //text
        data[i] = data[i].replace('"', "");
        data[i] = data[i].replace('"', "");

        //date
        if (file.endsWith("times.star") && data[i][10] === "-") {
          data[i] = this.stringReplaceAt(data[i], 10, "T");
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

  stringReplaceAt = (string, i, replacement) => {
    return (
      string.substr(0, i) + replacement + string.substr(i + replacement.length)
    );
  };
}

module.exports = Reader;
