/**
* @Author: David Schmotz <David>
* @Date:   2018-05-05T20:27:20+02:00
* @Email:  davidschmotz@gmail.com
* @Filename: actions.js
 * @Last modified by:   David
 * @Last modified time: 2018-06-16T21:16:35+02:00
*/

const mainarea = require('./mainareaManager');
const maps = require('../assets/typeMaps');


const changeSizeBut = document.getElementById("changeSizeBut");
changeSizeBut.addEventListener("click", () => {
  mainarea.changeSize();
});

const saveBut = document.getElementById("saveBut");
saveBut.addEventListener("click", () => {
  mainarea.saveXML();
});

const zoomBut = document.getElementById("zoomBut");
zoomBut.addEventListener("click", () => {
  console.log("zoomBut")
  mainarea.changeZoom();
});

const cleanBut = document.getElementById("cleanBut");
cleanBut.addEventListener("click", () => {
  console.log("cleanBut")
  mainarea.clean();
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
  mainarea.changeBlockType("player");
});

const finish_block = document.getElementById("finish_block");
finish_block.addEventListener("click", () => {
  console.log("changeBlockType")
  mainarea.changeBlockType("finish");
});

const opponent1_block = document.getElementById("opponent1_block");
opponent1_block.addEventListener("click", () => {
  console.log("changeBlockType")
  mainarea.changeBlockType("opponent1");
});
