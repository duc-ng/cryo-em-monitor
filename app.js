const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
const path = require("path");
const fs = require("fs");
const reader = require("./src/server/reader");
const chokidar = require("chokidar");
const config = require("./src/config.json");
const fspromises = require("fs").promises;


//init
const host = config.app.api_host;
const port = config.app.api_port;
const folder = config.app.folder;
const maxAge = config.app.maxAge_min;
app.get("/", (req, res) => res.send("Server is running!"));


//websocket
io.eio.pingTimeout = 120000
io.on("connection", function (socket) {

  //init
  console.log("User connected");
  var watcher = chokidar.watch(folder, {
    ignored: /^\./,
    persistent: true,
  });
  watcher.on("addDir", function (dirPath) {
    readDir(dirPath);
  });

  //read star files
  async function readDir(dirPath) {
    //console.log("Directory read: "+dirPath);
    if (reader.fileIsYoungerThan(dirPath, maxAge)) {

      //send data
      try {
        var files = await Promise.all([
          reader.readStarFile(path.join(dirPath,"data.star")),
          reader.readStarFile(path.join(dirPath,"times.star")),
          reader.readStarFile(path.join(dirPath,"images.star"))
        ]);
      } catch (error){
        return;
      }
      let merge = {...files[0], ...files[1], ...files[2]}; 
      socket.emit("data", merge);

      //send images
      let imageObject = {
        images: [],
        key: files[2][config["images.star"].key]
      }
      for (let x in config["images.star"].data){
        let imageName = config["images.star"].data[x].file;
        let imageInfo = config["images.star"].data[x].info;
        let imageFile = files[2][imageName];
        let imageInfoContent= files[2][imageInfo];
        if (imageFile != undefined && imageInfoContent != undefined) {
          let imagePath = path.join(dirPath, imageFile)
          try {
            var image = await fspromises.readFile(imagePath);
          } catch (error){
            console.log("Image reading error");  
            return; 
          }
          if (image != undefined) {
            imageObject.images.push({
              data: "data:image/jpeg;base64," + image.toString("base64"),
              label: imageInfoContent,
            })
          }
        }
      }
      socket.emit("images", imageObject);
    }
  }


    //images
    // if (
    //   file.endsWith(config.get("starFiles.names.file3")) &&
    //   reader.fileIsYoungerThan(file, maxHours)
    // ) {
    //   reader.readStarFile(file).then((res) => {
    //     var fixedValues = 1;
    //     for (i = fixedValues; i < Object.keys(res).length; i = i + 2) {
    //       var filePath = path.join(
    //         __dirname,
    //         path.dirname(file),
    //         Object.values(res)[i]
    //       );
    //       fs.readFile(filePath, function (err, data) {
    //         socket.emit(
    //           "newImages",
    //           "data:image/png;base64," + data.toString("base64")
    //         );
    //         console.log("Image sent");
    //       });
    //     }
    //     socket.emit("newImageData", res);
    //   });
    // }





  //end 
  socket.on("disconnect", function (reason) {
    console.log("User disconnected: "+reason);
  });

});

//listen for incoming connections
http.listen(port, () => {
  console.log(`Server app listening at ${host}:${port} (API)`);
});

//exit handling
process.stdin.resume();
function exitHandler(options, exitCode) {
    if (exitCode || exitCode === 0) console.log(0);
    if (options.exit) process.exit();
}
process.on('exit', exitHandler.bind(null,{cleanup:true}));
process.on('SIGINT', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR1', exitHandler.bind(null, {exit:true}));
process.on('SIGUSR2', exitHandler.bind(null, {exit:true}));
process.on('uncaughtException', exitHandler.bind(null, {exit:true}));