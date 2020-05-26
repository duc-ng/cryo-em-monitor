 //if new star file is added -> push to client
 watcher.on("add", function (file) {

    //read times
    if (
      file.endsWith("times.star") &&
      reader.fileIsYoungerThan(file, maxAge)
    ) {
      reader.readStarFile(file).then((res) => {
        socket.emit("newTimes", res);
      });
    }

    //read data
    if (
      file.endsWith("data.star") &&
      reader.fileIsYoungerThan(file, maxAge)
    ) {
      reader.readStarFile(file).then((res) => {
        socket.emit("newData", res);
      });
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
  });