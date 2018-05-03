/**
 * @Author: David Schmotz <David>
 * @Date:   2018-05-03T15:04:36+02:00
 * @Email:  davidschmotz@gmail.com
 * @Filename: dragndrop.js
 * @Last modified by:   David
 * @Last modified time: 2018-05-03T16:05:14+02:00
 */

function openPath(path) {
  document.getElementById("display-files").innerHTML = "";
  console.log('File(s) you dragged here: ', f.path)
  fs.readdir(f.path, (err, files) => {
    'use strict';
    //if an error is thrown when reading the directory, we throw it. Otherwise we continue
    if (err) throw  err;
    //the files parameter is an array of the files and folders in the path we passed. So we loop through the array, printing each file and folder
    for (let file of files) {
      console.log(file);
      document.getElementById("display-files").innerHTML += `<li>${file}</li>`;
    }
  });
}
