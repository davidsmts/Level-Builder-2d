/**
* @Author: David Schmotz <David>
* @Date:   2018-05-05T20:27:20+02:00
* @Email:  davidschmotz@gmail.com
* @Filename: actions.js
 * @Last modified by:   David
 * @Last modified time: 2018-06-12T18:23:23+02:00
*/

const mainarea = require('./mainareaManager');
const maps = require('../assets/typeMaps');


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
  mainarea.changeBlockType("normal_block");
});

const wood_block = document.getElementById("wood_block");
wood_block.addEventListener("click", () => {
  console.log("changeBlockType")
  mainarea.changeBlockType("wood_block");
});

const stone_block = document.getElementById("stone_block");
stone_block.addEventListener("click", () => {
  console.log("changeBlockType")
  mainarea.changeBlockType("stone_block");
});

const spawn_block = document.getElementById("spawn_block");
spawn_block.addEventListener("click", () => {
  console.log("changeBlockType")
  mainarea.changeBlockType("spawn_block");
});
