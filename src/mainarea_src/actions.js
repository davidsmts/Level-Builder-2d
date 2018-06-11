/**
* @Author: David Schmotz <David>
* @Date:   2018-05-05T20:27:20+02:00
* @Email:  davidschmotz@gmail.com
* @Filename: actions.js
 * @Last modified by:   David
 * @Last modified time: 2018-06-11T23:19:16+02:00
*/

const mainarea = require('./mainareaManager');


const widthBut = document.getElementById("changeWidthBut");
widthBut.addEventListener("click", () => {
  mainarea.loadXML();
});

const saveBut = document.getElementById("saveBut");
saveBut.addEventListener("click", () => {
  mainarea.saveXML();
});

const normal_block = document.getElementById("normal_block");
normal_block.addEventListener("click", () => {
  console.log("changeBlockType")
  mainarea.changeBlockType("normal_block_xxx");
});
