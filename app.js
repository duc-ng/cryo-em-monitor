//init server
const express = require("express");
const path = require("path");
const fs = require("fs");
const app = express();
const port = process.env.PORT || 3000;

//Set static folder (main page)
app.use(express.static(path.join(__dirname, "public")));

//convert star file to object
function readStarFile(source) {
  //read source
  var data = fs.readFileSync(source, "utf8");

  //clean data
  var substrings = data.split(/[\n,\t]+/);
  substrings.shift();
  substrings.shift();
  substrings.pop();
  for (i = 0; i < substrings.length; i++) {
    substrings[i] = substrings[i].trim();
    substrings[i] = substrings[i].replace('"', "");
    substrings[i] = substrings[i].replace('"', "");
    if (substrings[i].charAt(0) == "_") {
      substrings[i] = substrings[i].replace("_", "");
    }
    if (i == 22 || i==24 || i==26 || i==28 || i==30 || i==32) {
      substrings[i]=parseFloat(substrings[i]); 
    }
  }

  //clean dates
  substrings[18]=substrings[18].replaceAt(10,' ');
  substrings[19]=substrings[19].replaceAt(10,' ');
  substrings[20]=substrings[20].replaceAt(10,' ');
  substrings[21]=substrings[21].replaceAt(10,' ');

  //convert string to int
  substrings[17]=parseInt(substrings[17]);


  
  //Convert to object
  var object = {};
  var counter = substrings.length / 2;
  for (var i = 0; i < counter; ++i)
    object[substrings[i]] = substrings[i + counter];

  //Return
  return object;
}

//Replace specific char in string
String.prototype.replaceAt=function(index, replacement) {
  return this.substr(0, index) + replacement+ this.substr(index + replacement.length);
}

//get all Files by filetype from director and subdirectory 
function getFilesFromDir(dir, fileTypes) {
  var filesToReturn = [];
  function walkDir(currentPath) {
    var files = fs.readdirSync(currentPath);
    for (var i in files) {
      var curFile = path.join(currentPath, files[i]);      
      if (fs.statSync(curFile).isFile() && fileTypes.indexOf(path.extname(curFile)) != -1) {
        filesToReturn.push(curFile.replace(dir, ''));
      } else if (fs.statSync(curFile).isDirectory()) {
       walkDir(curFile);
      }
    }
  };
  walkDir(dir);
  return filesToReturn; 
}

//turn all star files into array of objects
function readAllFiles(starfile) {   
  //get all .star sources
  var prefix = "4Duc/data4Web/Titan1"; //TODO: variable ? + sort
  var allFiles = getFilesFromDir("./"+prefix, [".star"])
  allFiles=allFiles.filter(file => file.endsWith(starfile) )

  //turn star files into objects
  res = []
  for (var i = 0; i < allFiles.length; ++i)
    res.push(readStarFile(allFiles[i]))

  //return object array
  return res
}

//API: Get number of images recorded
app.get("/api/imagesrecorded", (req, res) => {
  var imagesStar = readAllFiles("data.star")
  var default_value ="" //TODO: check for real default value
  var dates = imagesStar.map(a => a.mmsdateAuqired_Value);
  dates = dates.filter(a => a !== default_value);
  res.json({ number: dates.length });
});

//API: Get number of images imported
app.get("/api/imagesimported", (req, res) => {
  var imagesStar = readAllFiles("data.star")
  var default_value ="" //TODO: check for real default value
  var dates = imagesStar.map(a => a.mmsdateImported_Value);
  dates = dates.filter(a => a !== default_value);
  res.json({ number: dates.length });
});

//API: Get number of images processed
app.get("/api/imagesprocessed", (req, res) => {
  var imagesStar = readAllFiles("data.star")
  var default_value ="" //TODO: check for real default value
  var dates = imagesStar.map(a => a.mmsdateProcessed_Value);
  dates = dates.filter(a => a !== default_value);
  res.json({ number: dates.length });
});

//API: Get number of processing errors //TODO: validate logic
app.get("/api/processingerrors", (req, res) => {
  var imagesStar = readAllFiles("data.star")
  var default_value ="" //TODO: check for real default value
  var dates = imagesStar.map(a => a.mmsdateExported_Value);
  dates = dates.filter(a => a !== default_value);
  res.json({ number: dates.length });
});


//API: get data
app.get("/api/plotdata", (req, res) => {
  var data = readAllFiles("data.star");
  res.json(data);
});






//API: get all JSON
// const members = [
//   {
//     id: 1,
//     name: "Duc",
//     age: "25"
//   },
//   {
//     id: 2,
//     name: "Ben",
//     age: "20"
//   }
// ];
// app.get("/api/members", (req, res) => {
//   res.json(members);
// });

//API: get specific JSON element
// app.get("/api/members/:id", (req, res) => {
//   const found = members.some(member => member.id === parseInt(req.params.id));

//   if (found) {
//     res.json(members.filter(member => member.id === parseInt(req.params.id)));
//   } else {
//     res.status(400).json({ msg: `No member with id of ${req.params.id}` });
//   }
// });


//Create server
app.listen(port, () =>
  console.log(`App listening at http://localhost:${port}`)
);
