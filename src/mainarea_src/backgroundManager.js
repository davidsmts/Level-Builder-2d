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
const mainarea = require("./mainareaManager");

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
    document.getElementById("display-backgrounds").innerHTML = "";
    for (let file of files) {
      let {fileprefix, fileEnding} = getFileEndingAndName(file)
      if (fileEnding == "png") {
        console.log(file);
        var _img = fs.readFileSync(path + "/" + file).toString('base64');
        var _out = '<img class="bg-element bordered" id="'+fileprefix+'" src="data:image/png;base64,' + _img + '" />';
        document.getElementById("display-backgrounds").innerHTML += _out;
      }
    }
    ipcRenderer.send('load-background-images', files)
    actionsOnBgElements()
  });
}

//
//
const getFileEndingAndName = (filename) => {
  let filenameParts = filename.split(".")
  let fileprefix = filenameParts[0]
  let fileEnding = filenameParts[filenameParts.length-1]
  return {fileprefix, fileEnding}
}

//
//
const actionsOnBgElements = () => {
  const bgElements = document.getElementsByClassName("bg-element")
  for (let element of bgElements) {
    element.addEventListener("click", () => {
      let filename = element.id
      mainarea.changeBlockType("background");
      mainarea.changeBackground(filename);
    })
  }
}
