/**
* @Author: David Schmotz <David>
* @Date:   2018-05-03T15:04:36+02:00
* @Email:  davidschmotz@gmail.com
* @Filename: dragndrop.js
 * @Last modified by:   David
 * @Last modified time: 2018-05-03T22:12:33+02:00
*/

const fs = require('fs')

//  loads all files of the given path into the sidebar
function openPath(path) {
  document.getElementById("display-files").innerHTML = "";
  console.log('File(s) you dragged here: ', path)
  fs.readdir(path, (err, files) => {
    'use strict';
    //if an error is thrown when reading the directory, we throw it. Otherwise we continue
    if (err) throw  err;
    //the files parameter is an array of the files and folders in the path we passed. So we loop through the array, printing each file and folder
    for (let file of files) {
      console.log(file);
      document.getElementById("display-files").innerHTML += `<a class="file">${file}</a>`;
    }
    addListenersForFiles()
  });
}

//  adds click events to all the file buttons
function addListenersForFiles(classname = "file") {
  const file_elements = document.getElementsByClassName(classname)
  for (var i=0; i<file_elements.length; i++) {
    file_elements[i].addEventListener("click", () => {
      console.log("clicki");
    })
  }
}


module.exports = {
  openPath
};
