/**
* @Author: David Schmotz <David>
* @Date:   2018-05-03T12:43:26+02:00
* @Email:  davidschmotz@gmail.com
* @Filename: dragndrop.js
 * @Last modified by:   David
 * @Last modified time: 2018-05-03T16:03:02+02:00
*/

const fs = require('fs');

var holder = document.getElementById('drag-file');

holder.ondragover = () => {
  return false;
};

holder.ondragleave = () => {
  return false;
};

holder.ondragend = () => {
  return false;
};

holder.ondrop = (e) => {
  e.preventDefault();

  for (let f of e.dataTransfer.files) {

    
  }
}

return false;
