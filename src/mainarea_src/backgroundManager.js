/**
* @Author: David Schmotz <David>
* @Date:   2018-10-04T14:37:57+02:00
* @Email:  davidschmotz@gmail.com
* @Filename: backgroundManager.js
* @Last modified by:   David
* @Last modified time: 2018-10-04T18:25:36+02:00
*/

const electron = require("electron")
const fs = require('fs')
const ipcRenderer = electron.ipcRenderer
const currentBackgroundTexturesPath = "";

//
//
ipcRenderer.on('bgPath', (event, path) => {
  console.log("here")
  console.log(path)
  loadBackgrounds(path)
})

//
//  loads all files of the given path into the sidebar
const loadBackgrounds = (path) => {
  document.getElementById("display-backgrounds").innerHTML = "";
  console.log('File(s) you dragged here: ', path)
  //messageMainPath(path)
  fs.readdir(path, (err, files) => {
    //if an error is thrown when reading the directory, we throw it. Otherwise we continue
    if (err) throw  err;
    //the files parameter is an array of the files and folders in the path we passed. So we loop through the array, printing each file and folder
    for (let file of files) {
      let fileEnding = getFileEnding(file)
      if (fileEnding == "png") {
        console.log(file);
        var _img = fs.readFileSync(path + "/" + file).toString('base64');
        var _out = '<img class="bg-element bordered" src="data:image/png;base64,' + _img + '" />';
        document.getElementById("display-backgrounds").innerHTML += _out;
      }
    }
  });
}

const getFileEnding = (filename) => {
  let filenameParts = filename.split(".")
  return filenameParts[filenameParts.length-1]
}
