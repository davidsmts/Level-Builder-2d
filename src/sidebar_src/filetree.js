/**
* @Author: David Schmotz <David>
* @Date:   2018-05-03T15:04:36+02:00
* @Email:  davidschmotz@gmail.com
* @Filename: dragndrop.js
 * @Last modified by:   David
 * @Last modified time: 2018-05-15T22:04:02+02:00
*/

const electron = require("electron")
const fs = require('fs')
const ipcRenderer = electron.ipcRenderer
const mainarea = require("../mainarea_src/mainareaManager")

const filesOfCurrentPath = new Array();

//  loads all files of the given path into the sidebar
function openPath(path) {
  document.getElementById("display-files").innerHTML = "";
  console.log('File(s) you dragged here: ', path)
  //mainarea.loadXML()
  messageMainPath(path)
  fs.readdir(path, (err, files) => {
    'use strict';
    //if an error is thrown when reading the directory, we throw it. Otherwise we continue
    if (err) throw  err;
    //the files parameter is an array of the files and folders in the path we passed. So we loop through the array, printing each file and folder
    for (let file of files) {
      let fileEnding = getFileEnding(file)
      console.log(fileEnding)
      if (fileEnding == "xml") {
        filesOfCurrentPath.push(file);
        console.log(file);
        document.getElementById("display-files").innerHTML += `<a class="file">${file}</a>`;
      }
    }
    addListenersForFiles()
  });
}

//  adds click events to all the file buttons
function addListenersForFiles(classname = "file") {
  const file_elements = document.getElementsByClassName(classname)
  for (var i=0; i<file_elements.length; i++) {
    const filename = filesOfCurrentPath[i];
    console.log(filename);
    file_elements[i].addEventListener("click", () => {
      messageMainDoc(filename);
    })
  }
}

const getFileEnding = (filename) => {
  let filenameParts = filename.split(".")
  return filenameParts[filenameParts.length-1]
}

//  sends the new path to the ipc main proccess
const messageMainDoc = (filename) => {
  console.log("messaging name : " + filename);
  ipcRenderer.send('new-doc-main', filename);
}

//  sends the new path to the ipc main proccess
const messageMainPath = (path) => {
  ipcRenderer.send('new-path', path)
}

ipcRenderer.on('givingyou-currentDocumentPath', (event, path) => {
  console.log(path)
  openPath(path)
})


module.exports = {
  openPath
};
